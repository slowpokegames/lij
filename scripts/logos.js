// Lij logo options: the i stands on the L's foot, the j hooks under the foot, and both dots
// sit at the same height. Writes design/logos/<name>.svg and design/logos/logo-options.png.
// Run from the repo root: node scripts/logos.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const NIGHT = '#1B1F44', CREAM = '#F7F4ED', GOLD = '#D9B565', INK = '#2B2F5E';
const SUN = '#E3A21A', MOON = '#F6EFC9';

// Shared skeleton (viewBox 200 x 210). s = stroke width.
// L stem x=40 from y=30 to the foot at y=140; foot runs to x=114, clear of the j.
// i stem x=88 from the x-height (y=88) down onto the foot; j stem x=146 from y=88 down to y=160,
// then a quarter turn into a tail running left under the foot at y=182. Dots at y=56.
// around: true instead brings the j (at jx) down to the foot's level and bends it in an arc
// centered on the foot's end (114, 140), so it keeps an even distance around the foot.
function letters({ s, cap = 'round', ink, tail = 'short', gap = 0, around = false, jx = 146 }) {
  const half = s / 2, footTop = 140 - half;
  const join = cap === 'round' ? 'round' : 'miter';
  const capAttr = cap === 'round' ? 'round' : 'butt';
  const iBottom = cap === 'round' ? footTop - half - gap : footTop - gap;
  const tailEnd = { short: 'H60', long: 'H34', swash: 'H44 C24 182 12 174 12 156' }[tail];
  const r = jx - 114;
  const j = around ? `M${jx} 88 V140 A${r} ${r} 0 0 1 114 ${140 + r} H60` : `M146 88 V160 A22 22 0 0 1 124 182 ${tailEnd}`;
  const d = `M40 30 V140 H114 M88 88 V${iBottom} ${j}`;
  return `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${s}" stroke-linecap="${capAttr}" stroke-linejoin="${join}"/>`;
}
const DOT_Y = 56, DOTS_X = [88, 146];
const roundDots = (r, fill) => DOTS_X.map((x) => `<circle cx="${x}" cy="${DOT_Y}" r="${r}" fill="${fill}"/>`).join('');
const squareDots = (w, fill) => DOTS_X.map((x) => `<rect x="${x - w / 2}" y="${DOT_Y - w / 2}" width="${w}" height="${w}" fill="${fill}"/>`).join('');
const star = (x, y, k, fill) => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8Z" fill="${fill}"/>`;
function sunMoon(r, jx = DOTS_X[1]) {
  const sx = DOTS_X[0], mx = jx, y = DOT_Y;
  const sun = `<circle cx="${sx}" cy="${y}" r="${r}" fill="${SUN}"/>`;
  const R = r * 1.08; // crescent drawn as in the card scenes
  const moon = `<path d="M${mx + R * 0.25} ${y - R} A${R} ${R} 0 1 0 ${mx + R * 0.95} ${y + R * 0.35} A${R * 0.82} ${R * 0.82} 0 0 1 ${mx + R * 0.25} ${y - R}Z" fill="${MOON}"/>`;
  return sun + moon;
}

// Each option: (ink, background) -> inner SVG. `onLight` swaps colors that vanish on cream.
const OPTIONS = [
  { name: 'monoline', label: '1 · Monoline', note: 'Even round strokes, the i resting on the foot.',
    draw: (ink) => letters({ s: 18, ink }) + roundDots(11, ink) },
  { name: 'block', label: '2 · Block', note: 'Heavy square-ended strokes and square dots; the i stands just clear of the foot.',
    draw: (ink) => letters({ s: 26, cap: 'butt', ink, gap: 7 }) + squareDots(24, ink) },
  { name: 'sun-moon', label: '3 · Sun & Moon dots', note: 'The dots are the deck’s first two emblems.',
    draw: (ink, light) => letters({ s: 18, ink }) + (light ? sunMoon(12).replace(MOON, INK) : sunMoon(12)) },
  { name: 'cradle', label: '4 · Cradle', note: 'The j’s tail runs under the whole L and curls up.',
    draw: (ink) => letters({ s: 16, ink, tail: 'swash' }) + roundDots(10, ink) },
  { name: 'omen', label: '5 · Omen stars', note: 'Gold four-point stars, like the Omen cards.',
    draw: (ink, light) => letters({ s: 16, ink, gap: 6 }) + DOTS_X.map((x) => star(x, DOT_Y, 2.6, light ? '#B8892B' : GOLD)).join('') },
  { name: 'card', label: '6 · Card badge', note: 'Sun & Moon logo on the card back, for app icons.',
    badge: true,
    draw: () => `<rect x="4" y="4" width="192" height="202" rx="30" fill="${INK}" stroke="${GOLD}" stroke-width="4"/>` +
      `<g transform="translate(22 16) scale(.82)">${letters({ s: 18, ink: CREAM })}${sunMoon(12)}</g>` },
];

// Round 2 (after Tim picked Sun & Moon and the card badge): the j curves around the foot's end,
// the i stands just clear of the foot as in Omen stars; three radii from tight to roomy.
const ROUND2 = [
  { name: 'arc-tight', label: 'A · Tight', note: 'j hugs the foot: radius 26, gap 8.', jx: 140 },
  { name: 'arc-medium', label: 'B · Medium', note: 'Radius 32, gap 14: the middle ground.', jx: 146 },
  { name: 'arc-roomy', label: 'C · Roomy', note: 'Radius 38, gap 20: a wider ring around the foot.', jx: 152 },
].map((o) => ({ ...o, mark: (ink, light) => letters({ s: 18, ink, gap: 6, around: true, jx: o.jx }) + (light ? sunMoon(12, o.jx).replace(MOON, INK) : sunMoon(12, o.jx)) }));
const badge = (mark) => `<rect x="4" y="4" width="192" height="202" rx="30" fill="${INK}" stroke="${GOLD}" stroke-width="4"/><g transform="translate(22 14) scale(.82)">${mark}</g>`;

const svg = (inner, bg, w = 200) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 210" width="${w}" height="${w * 1.05}">${bg ? `<rect width="200" height="210" fill="${bg}"/>` : ''}${inner}</svg>`;

(async () => {
  const out = path.join(__dirname, '..', 'design', 'logos');
  fs.mkdirSync(out, { recursive: true });
  let rows = '';
  for (const o of OPTIONS) {
    const dark = o.draw(CREAM, false), light = o.draw(INK, true);
    fs.writeFileSync(path.join(out, `${o.name}.svg`), svg(dark, o.badge ? null : NIGHT));
    if (!o.badge) fs.writeFileSync(path.join(out, `${o.name}-light.svg`), svg(light, CREAM));
    const small = [64, 32, 20].map((w) => svg(dark, o.badge ? null : NIGHT, w)).join('');
    rows += `<div class="row"><div class="txt"><b>${o.label}</b><span>${o.note}</span></div>
      <div class="tile dark">${svg(dark, null, 190)}</div>
      <div class="tile light">${o.badge ? svg(dark, null, 190) : svg(light, null, 190)}</div>
      <div class="tile dark smalls">${small}</div></div>`;
  }
  const html = `<html><head><style>
    body{margin:0;padding:24px;background:#E9E4D8;font:15px/1.4 Verdana,sans-serif;color:#2B2F5E}
    .row{display:grid;grid-template-columns:200px 220px 220px 160px;gap:14px;align-items:center;margin-bottom:14px}
    .txt b{display:block;font-size:17px;margin-bottom:4px}.txt span{color:#5A5F86}
    .tile{height:220px;border-radius:14px;display:flex;align-items:center;justify-content:center}
    .dark{background:${NIGHT}}.light{background:${CREAM};border:1px solid #D8D0BE}
    .smalls{gap:12px;align-items:flex-end;padding-bottom:70px;height:150px}
  </style></head><body>${rows}</body></html>`;
  fs.writeFileSync(path.join(out, 'logo-options.html'), html);
  let rows2 = '';
  for (const o of ROUND2) {
    const dark = o.mark(CREAM, false), light = o.mark(INK, true), card = badge(o.mark(CREAM, false));
    fs.writeFileSync(path.join(out, `${o.name}.svg`), svg(dark, NIGHT));
    fs.writeFileSync(path.join(out, `${o.name}-light.svg`), svg(light, CREAM));
    fs.writeFileSync(path.join(out, `${o.name}-card.svg`), svg(card, null));
    const small = [64, 32, 20].map((w) => svg(card, null, w)).join('');
    rows2 += `<div class="row r2"><div class="txt"><b>${o.label}</b><span>${o.note}</span></div>
      <div class="tile dark">${svg(dark, null, 190)}</div>
      <div class="tile light">${svg(light, null, 190)}</div>
      <div class="tile light">${svg(card, null, 190)}</div>
      <div class="tile dark smalls">${small}</div></div>`;
  }
  const html2 = html.replace('.row{', '.r2{grid-template-columns:200px 220px 220px 220px 160px!important}.row{').replace(rows, rows2);
  fs.writeFileSync(path.join(out, 'logo-round2.html'), html2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 600 } });
  await p.setContent(html); await p.screenshot({ path: path.join(out, 'logo-options.png'), fullPage: true });
  await p.setViewportSize({ width: 1140, height: 600 });
  await p.setContent(html2); await p.screenshot({ path: path.join(out, 'logo-round2.png'), fullPage: true });
  await b.close();
  console.log('wrote', OPTIONS.length, 'options to design/logos/');
})();
