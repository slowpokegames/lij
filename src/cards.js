// Lij card renderer: pure functions returning SVG strings. 250 x 350 units = 2.5" x 3.5".
(function (root) {
  const EMBLEMS = [
    { n: 'Sun', c: '#E3A21A', ink: '#3A2A08', b: [0, 1, 1], d: 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8' },
    { n: 'Moon', c: '#4F56A6', ink: '#F7F4ED', b: [0, 0, 1], d: 'M15.5 3.5a8.5 8.5 0 1 0 5 13.6A7 7 0 0 1 15.5 3.5z' },
    { n: 'Water', c: '#1E73B0', ink: '#F7F4ED', b: [0, 0, 0], d: 'M3 8.5c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 17.5c2-2 4-2 6 0s4 2 6 0 4-2 6 0' },
    { n: 'Fire', c: '#CF4520', ink: '#F7F4ED', b: [0, 1, 0], d: 'M12 3c1 3.5 5.5 5.5 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.5 1.3-4 2.5-5.5.3 1.8 1 2.8 2 3.3 0-3 .4-5.6 1-8.3z' },
    { n: 'Mountains', c: '#56636B', ink: '#F7F4ED', b: [1, 0, 1], d: 'M2 19.5L9 7l4.2 7.2L16 10l6 9.5zM7.3 10l1.7 1.3 1.5-1.2' },
    { n: 'Leaves', c: '#3A8A2E', ink: '#F7F4ED', b: [1, 1, 1], d: 'M5 19C5 10.5 10.5 5 19.5 4.5 19.5 13.5 14 19 5 19zM5 19l8.5-8.5' },
    { n: 'Snow', c: '#8EC3E6', ink: '#0E3550', b: [1, 0, 0], d: 'M12 12L12.0 2.5M12.0 5.8L13.9 3.5M12.0 5.8L10.1 3.5M12 12L3.8 7.3M6.6 8.9L5.6 6.1M6.6 8.9L3.7 9.4M12 12L3.8 16.8M6.6 15.1L3.7 14.6M6.6 15.1L5.6 17.9M12 12L12.0 21.5M12.0 18.2L10.1 20.5M12.0 18.2L13.9 20.5M12 12L20.2 16.8M17.4 15.1L18.4 17.9M17.4 15.1L20.3 14.6M12 12L20.2 7.2M17.4 8.9L20.3 9.4M17.4 8.9L18.4 6.1' },
    { n: 'Flower', c: '#F29AC9', ink: '#5A1636', b: [1, 1, 0], d: 'M8.6 6.8a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0 -6.8 0M3.7 10.4a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0 -6.8 0M5.5 16.2a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0 -6.8 0M11.7 16.2a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0 -6.8 0M13.5 10.4a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0 -6.8 0M9.8 12a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0' }
  ];
  const STRIP = [0, 1, 5, 4, 3, 2, 7, 6]; // Sun, Moon, Leaves, Mountains, Fire, Water, Flower, Snow

  // All 70 cards: sorted 4-subsets of 0..7, ordered by strip position for a natural deck order.
  const CARDS = [];
  (function () {
    for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) for (let c = b + 1; c < 8; c++) for (let d = c + 1; d < 8; d++) {
      CARDS.push([STRIP[a], STRIP[b], STRIP[c], STRIP[d]]);
    }
  })();
  const mask = (set) => set.reduce((m, i) => m | (1 << i), 0);
  const isOmen = (set) => [0, 1, 2].every((k) => set.reduce((a, i) => a ^ EMBLEMS[i].b[k], 0) === 0);
  const shared = (a, b) => { let x = mask(a) & mask(b), n = 0; while (x) { n += x & 1; x >>= 1; } return n; };

  function icon(i, x, y, s, stroke, sw) {
    const k = s / 24;
    return `<path transform="translate(${x - s / 2} ${y - s / 2}) scale(${k})" d="${EMBLEMS[i].d}" fill="none" stroke="${stroke}" stroke-width="${sw / k}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  function strip(set) {
    let s = `<rect x="0" y="0" width="46" height="350" fill="#EEE8DA"/><line x1="46" y1="0" x2="46" y2="350" stroke="#DED5C3" stroke-width="1"/>`;
    STRIP.forEach((i, k) => {
      const y = 24 + k * 37.5;
      if (set.includes(i)) {
        s += `<circle cx="23" cy="${y}" r="15" fill="${EMBLEMS[i].c}"/>` + icon(i, 23, y, 19, EMBLEMS[i].ink, 1.9);
      } else {
        s += `<circle cx="23" cy="${y}" r="12.5" fill="none" stroke="#D3C9B5" stroke-width="1.2" stroke-dasharray="2.6 2.6"/>` + icon(i, 23, y, 14, '#D6CDBA', 1.3);
      }
    });
    s += `<text x="23" y="334" text-anchor="middle" font-family="Nunito, Verdana, sans-serif" font-weight="800" font-size="12" fill="#9A8F7B" letter-spacing="1">Lij</text>`;
    return s;
  }

  // Deterministic pseudo-random for stars etc.
  function rng(seed) { let x = seed * 9301 + 49297; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }

  function scene(set, id, W0, Hh0, H0) {
    const has = (n) => set.includes(EMBLEMS.findIndex((e) => e.n === n));
    const sun = has('Sun'), moon = has('Moon'), water = has('Water'), fire = has('Fire');
    const mtn = has('Mountains'), leaves = has('Leaves'), snow = has('Snow'), flower = has('Flower');
    const W = W0 || 190, Hh = Hh0 || 326, H = H0 || 186; // scene width, height, horizon
    const k190 = W / 190, X = (x) => +(x * k190).toFixed(1), dy = H - 186, SC = `scale(${k190.toFixed(4)} 1)`;
    const mode = sun && moon ? 'dusk' : sun ? 'day' : moon ? 'night' : 'haze';
    const SKY = { day: ['#7FC3EE', '#D4EEFA'], dusk: ['#3E3C7C', '#F2A469'], night: ['#0F1538', '#2C3870'], haze: ['#BFCBD2', '#E6EBEC'] }[mode];
    const P = `g${id}`;
    let defs = `<linearGradient id="${P}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY[0]}"/><stop offset="1" stop-color="${SKY[1]}"/></linearGradient>`;
    defs += `<radialGradient id="${P}f"><stop offset="0" stop-color="#FFB347" stop-opacity="0.75"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>`;
    defs += `<radialGradient id="${P}h"><stop offset="0" stop-color="#FFE7A0" stop-opacity="0.8"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient>`;
    defs += `<clipPath id="${P}c"><rect x="0" y="0" width="${W}" height="${Hh}" rx="10"/></clipPath>`;
    let g = `<rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#${P}s)"/>`;
    const r = rng(mask(set) + 7);
    if (mode === 'night' || mode === 'dusk') {
      const n = mode === 'night' ? 26 : 10;
      for (let k = 0; k < n; k++) {
        const x = 6 + r() * (W - 12), y = 6 + r() * (mode === 'night' ? 150 : 80);
        g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + r() * 0.9).toFixed(2)}" fill="#FFF6D8" opacity="${(0.5 + r() * 0.5).toFixed(2)}"/>`;
      }
    }
    if (mode === 'haze') {
      g += `<g fill="#F7F8F8" opacity="0.85" transform="${SC}"><ellipse cx="48" cy="64" rx="34" ry="11"/><ellipse cx="66" cy="56" rx="22" ry="12"/><ellipse cx="146" cy="102" rx="30" ry="9"/><ellipse cx="160" cy="95" rx="18" ry="10"/></g>`;
    }
    if (sun) {
      if (moon) { // low evening sun; above the peaks when mountains fill the horizon
        const sy = mtn ? 108 + dy : H - 6, sxx = X(mtn ? 164 : leaves ? 84 : 132);
        g += `<circle cx="${sxx}" cy="${sy}" r="44" fill="url(#${P}h)"/><circle cx="${sxx}" cy="${sy}" r="${mtn ? 20 : 27}" fill="#FFC75A"/>`;
      } else {
        const SX = X(140);
        g += `<circle cx="${SX}" cy="58" r="46" fill="url(#${P}h)"/>`;
        for (let k = 0; k < 12; k++) {
          const a = (k * Math.PI) / 6, x1 = SX + Math.cos(a) * 30, y1 = 58 + Math.sin(a) * 30, x2 = SX + Math.cos(a) * 40, y2 = 58 + Math.sin(a) * 40;
          g += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#FFC23D" stroke-width="3.2" stroke-linecap="round"/>`;
        }
        g += `<circle cx="${SX}" cy="58" r="23" fill="#FFC23D"/><circle cx="${SX}" cy="58" r="23" fill="none" stroke="#F0A41C" stroke-width="2"/>`;
      }
    }
    if (moon) {
      const mx = X(sun ? 50 : 56), my = sun ? 50 : 60, mr = sun ? 15 : 21;
      g += `<circle cx="${mx}" cy="${my}" r="${mr + 14}" fill="#FFF6D8" opacity="0.12"/>`;
      g += `<path d="M${mx + mr * 0.25} ${my - mr} A${mr} ${mr} 0 1 0 ${mx + mr * 0.95} ${my + mr * 0.35} A${mr * 0.82} ${mr * 0.82} 0 0 1 ${mx + mr * 0.25} ${my - mr}Z" fill="#F6EFC9"/>`;
    }
    if (mtn) {
      const back = mode === 'night' ? '#4C5878' : mode === 'dusk' ? '#7A6E92' : '#9EAAB5';
      const front = mode === 'night' ? '#36405D' : mode === 'dusk' ? '#56506E' : '#6F7F8C';
      g += `<g transform="translate(0 ${dy}) ${SC}"><path d="M-5 190 L30 112 L52 136 L84 92 L118 140 L140 120 L196 190Z" fill="${back}"/>`;
      g += `<path d="M-5 194 L46 104 L76 146 L104 118 L150 194Z" fill="${front}"/>`;
      g += `<path d="M84 92 L95 108 L88 105 L82 111 L76 104 L73 108Z" fill="#F4F6F7"/><path d="M46 104 L57 122 L50 118 L44 124 L38 117Z" fill="#F4F6F7"/><path d="M30 112 L37 123 L31 121 L25 124Z" fill="#F4F6F7" opacity="0.9"/>${snow ? '<path d="M84 92 L104 124 L96 120 L88 128 L80 120 L70 128 L62 118 L66 112Z M46 104 L64 134 L56 130 L48 138 L40 130 L32 136 L38 122Z" fill="#F4F6F7"/>' : ''}</g>`;
    } else {
      // gentle far hills so the horizon reads
      const hill = mode === 'night' ? '#283358' : mode === 'dusk' ? '#6A5F7E' : mode === 'haze' ? '#AEB9B8' : '#A9C3B4';
      g += `<path transform="${SC}" d="M-5 ${H + 2} Q40 ${H - 16} 95 ${H - 4} T196 ${H - 6} L196 ${H + 6} L-5 ${H + 6}Z" fill="${hill}"/>`;
    }
    // ground
    const shore = water ? H + 52 : H;
    const groundC = snow ? '#EEF3F6' : '#B7C48A';
    const groundD = snow ? '#C9D8E3' : '#9AAA6C';
    if (water) {
      g += `<rect x="0" y="${H}" width="${W}" height="${shore - H + 12}" fill="${mode === 'night' ? '#1E3F72' : mode === 'dusk' ? '#5A6FA6' : snow ? '#5D9CC4' : '#3F8FC6'}"/>`;
      for (let k = 0; k < 6; k++) {
        const y = H + 8 + k * 7.5, x = X(14 + ((k * 53) % 120));
        g += `<path d="M${x} ${y} q6 -3 12 0 t12 0" fill="none" stroke="#EAF6FF" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>`;
      }
      if (sun && !moon) g += `<path transform="translate(${(X(140) - 140).toFixed(1)} 0)" d="M128 ${H + 6} h24 M132 ${H + 14} h16 M136 ${H + 22} h8" stroke="#FFE08A" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`;
      if (moon && !sun) g += `<path transform="translate(${(X(56) - 56).toFixed(1)} 0)" d="M48 ${H + 8} h18 M51 ${H + 16} h12" stroke="#F6EFC9" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>`;
      if (sun && moon) { const cxr = X(mtn ? 164 : leaves ? 84 : 132); g += `<path d="M${cxr - 20} ${H + 6} h40 M${cxr - 14} ${H + 14} h28 M${cxr - 8} ${H + 22} h16" stroke="#FFC75A" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`; }
    }
    g += `<path transform="${SC}" d="M-5 ${shore + 6} Q50 ${shore - 6} 100 ${shore + 2} T196 ${shore} L196 ${Hh + 5} L-5 ${Hh + 5}Z" fill="${groundC}"/>`;
    if (snow) {
      g += `<path transform="${SC}" d="M-5 ${shore + 46} Q40 ${shore + 30} 90 ${shore + 42} T196 ${shore + 34}" fill="none" stroke="${groundD}" stroke-width="2.4"/>`;
      g += `<path transform="${SC}" d="M10 ${Hh - 30} Q60 ${Hh - 48} 120 ${Hh - 34} T196 ${Hh - 42}" fill="none" stroke="${groundD}" stroke-width="2.4"/>`;
    } else {
      for (let k = 0; k < 10; k++) {
        const x = X(10 + r() * 170), y = shore + 16 + r() * (Hh - shore - 26);
        g += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l2 -6 l2 6 M${(x + 4).toFixed(1)} ${y.toFixed(1)} l2 -4" fill="none" stroke="${groundD}" stroke-width="1.2" stroke-linecap="round"/>`;
      }
    }
    if (leaves) {
      const tx = X(150), base = Hh - 44;
      g += `<path d="M${tx - 6} ${base} L${tx - 4} ${base - 70} L${tx + 4} ${base - 70} L${tx + 7} ${base}Z" fill="#7A5236"/>`;
      g += `<path d="M${tx} ${base - 52} L${tx - 18} ${base - 76} M${tx + 1} ${base - 60} L${tx + 20} ${base - 82}" stroke="#7A5236" stroke-width="4" stroke-linecap="round"/>`;
      const blobs = [[0, -112, 34], [-26, -92, 26], [26, -94, 27], [-12, -132, 22], [16, -128, 23], [0, -84, 22]];
      blobs.forEach(([dx, dy, rr], k) => { g += `<circle cx="${tx + dx}" cy="${base + dy}" r="${rr}" fill="${k % 2 ? '#3A8A2E' : '#4FA33A'}"/>`; });
      if (snow) [[0, -146, 16], [-14, -152, 9], [16, -150, 10], [-30, -116, 10], [30, -118, 10]].forEach(([dx, dy, rr]) => { g += `<ellipse cx="${tx + dx}" cy="${base + dy + rr * 0.4}" rx="${rr}" ry="${rr * 0.45}" fill="#F4F8FB"/>`; });
      [[-14, -118], [12, -106], [-4, -96], [22, -124], [-22, -98]].forEach(([dx, dy]) => {
        g += `<path transform="translate(${tx + dx} ${base + dy}) rotate(${(dx * 7) % 60})" d="M0 0 C3 -6 9 -7 12 -6 C11 -2 6 3 0 0Z" fill="#8BCB5E"/>`;
      });
      for (let k = 0; k < 3; k++) {
        const x = X(70 + k * 26 + r() * 10), y = Hh - 22 - r() * 30;
        g += `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(r() * 360).toFixed(0)})" d="M0 0 C3 -6 9 -7 12 -6 C11 -2 6 3 0 0Z" fill="#6FB14A" opacity="0.9"/>`;
      }
    }
    if (flower) {
      const spots = [[18, -22], [40, -46], [30, -8], [62, -24], [8, -54], [56, -58], [84, -10], [150, -14], [176, -30], [128, -38]];
      const cols = snow ? ['#9B6FD0', '#E2B321', '#B88AE0'] : ['#F29AC9', '#F2C14E', '#FFFFFF', '#E879B4'];
      spots.slice(0, snow ? 6 : 10).forEach(([px, py], k) => {
        const x = X(px), y = Hh + py, c = cols[k % cols.length];
        if (snow) {
          g += `<path d="M${x} ${y} l0 -9" stroke="#5E8A3A" stroke-width="1.6" stroke-linecap="round"/><path d="M${x} ${y - 9} c-4 -2 -4 -9 0 -12 c4 3 4 10 0 12z" fill="${c}"/><path d="M${x} ${y - 9} c-6 -1 -7 -6 -5 -9 c2 1 4 5 5 9z M${x} ${y - 9} c6 -1 7 -6 5 -9 c-2 1 -4 5 -5 9z" fill="${c}" opacity="0.85"/>`;
        } else {
          g += `<path d="M${x} ${y} l0 -10" stroke="#4E7D2E" stroke-width="1.6" stroke-linecap="round"/>`;
          for (let q = 0; q < 5; q++) { const t = (q * 2 * Math.PI) / 5; g += `<circle cx="${(x + 3.6 * Math.cos(t)).toFixed(1)}" cy="${(y - 12 + 3.6 * Math.sin(t)).toFixed(1)}" r="2.8" fill="${c}"/>`; }
          g += `<circle cx="${x}" cy="${y - 12}" r="2" fill="${c === '#F2C14E' ? '#C0571F' : '#F2C14E'}"/>`;
        }
      });
    }
    if (snow) {
      for (let k = 0; k < 22; k++) g += `<circle cx="${(4 + r() * (W - 8)).toFixed(1)}" cy="${(4 + r() * (Hh - 40)).toFixed(1)}" r="${(1 + r() * 1.3).toFixed(2)}" fill="#FFFFFF" opacity="0.85"/>`;
    }
    const shade = { night: 0.38, dusk: 0.14, day: 0, haze: 0.04 }[mode];
    if (shade) g += `<rect x="0" y="0" width="${W}" height="${Hh}" fill="#0E1436" opacity="${shade}"/>`;
    if (moon && !sun) g += `<path d="M${X(56) + 21 * 0.25} ${60 - 21} A21 21 0 1 0 ${X(56) + 21 * 0.95} ${60 + 21 * 0.35} A${21 * 0.82} ${21 * 0.82} 0 0 1 ${X(56) + 21 * 0.25} ${60 - 21}Z" fill="#F6EFC9"/>`;
    if (fire) {
      const fx = X(112), fy = Hh - 26;
      g += `<circle cx="${fx}" cy="${fy - 18}" r="${mode === 'night' ? 62 : 42}" fill="url(#${P}f)"/>`;
      g += `<path d="M${fx - 24} ${fy + 4} L${fx + 22} ${fy - 6}" stroke="#6B4429" stroke-width="7" stroke-linecap="round"/><path d="M${fx - 22} ${fy - 6} L${fx + 24} ${fy + 4}" stroke="#7D5232" stroke-width="7" stroke-linecap="round"/>`;
      g += `<path d="M${fx} ${fy - 52} C${fx + 6} ${fy - 36} ${fx + 20} ${fy - 30} ${fx + 18} ${fy - 12} C${fx + 16} ${fy} ${fx - 16} ${fy} ${fx - 18} ${fy - 12} C${fx - 20} ${fy - 26} ${fx - 8} ${fy - 32} ${fx - 6} ${fy - 44} C${fx - 2} ${fy - 38} ${fx} ${fy - 44} ${fx} ${fy - 52}Z" fill="#E4572E"/>`;
      g += `<path d="M${fx + 1} ${fy - 38} C${fx + 6} ${fy - 26} ${fx + 12} ${fy - 22} ${fx + 10} ${fy - 11} C${fx + 8} ${fy - 3} ${fx - 9} ${fy - 3} ${fx - 10} ${fy - 11} C${fx - 11} ${fy - 20} ${fx - 3} ${fy - 24} ${fx + 1} ${fy - 38}Z" fill="#F7A631"/>`;
      g += `<path d="M${fx} ${fy - 24} C${fx + 4} ${fy - 17} ${fx + 6} ${fy - 13} ${fx + 4} ${fy - 8} C${fx + 2} ${fy - 4} ${fx - 4} ${fy - 4} ${fx - 5} ${fy - 8} C${fx - 6} ${fy - 13} ${fx - 2} ${fy - 16} ${fx} ${fy - 24}Z" fill="#FFE07A"/>`;
      for (let k = 0; k < 4; k++) g += `<circle cx="${(fx - 14 + r() * 28).toFixed(1)}" cy="${(fy - 60 - r() * 30).toFixed(1)}" r="1.3" fill="#FFC14D" opacity="0.85"/>`;
    }
    return { defs, body: `<g clip-path="url(#${P}c)">${g}</g>` };
  }

  // Abstract faces (SET-like): the card's 4 emblems, one per row, in strip order.
  // 'emblems': each as a big colored badge. 'traits': a symbol from its yes/no traits —
  // moving = dome, still = triangle; warm = orange, cool = blue; high points up, low points down.
  // 'traits-icon': the trait symbol with the emblem's icon inside.
  const TRAIT_C = [['#2F6DB5', '#1F4F8A'], ['#E8792A', '#B8561A']]; // [cool, warm] fill, edge
  function traitShape(i) {
    const [still, warm, high] = EMBLEMS[i].b, s = high ? 1 : -1;
    const d = still
      ? `M-56 ${29 * s} L0 ${-29 * s} L56 ${29 * s}Z`
      : `M-56 ${29 * s} A56 58 0 0 ${high ? 1 : 0} 56 ${29 * s}Z`;
    return { d, fill: TRAIT_C[warm][0], edge: TRAIT_C[warm][1], iy: (still ? 10 : 6) * s };
  }
  function abstractFace(set, style, W, Hh) {
    const rows = STRIP.filter((i) => set.includes(i)), cx = W / 2, step = Hh / 4;
    let g = `<rect x="0" y="0" width="${W}" height="${Hh}" rx="10" fill="#FFFDF8"/>`;
    rows.forEach((i, k) => {
      const cy = step * (k + 0.5);
      if (style === 'emblems') {
        g += `<rect x="${cx - 70}" y="${cy - 31}" width="140" height="62" rx="31" fill="${EMBLEMS[i].c}"/>` + icon(i, cx, cy, 44, EMBLEMS[i].ink, 2.6);
      } else {
        const t = traitShape(i);
        g += `<path transform="translate(${cx} ${cy})" d="${t.d}" fill="${t.fill}" stroke="${t.edge}" stroke-width="2.5" stroke-linejoin="round"/>`;
        if (style === 'traits-icon') g += icon(i, cx, cy + t.iy, 26, '#FFFFFF', 2.2);
      }
    });
    return g;
  }

  function topBand(set) {
    let s = `<rect x="0" y="0" width="250" height="42" fill="#EEE8DA"/><line x1="0" y1="42" x2="250" y2="42" stroke="#DED5C3" stroke-width="1"/>`;
    STRIP.forEach((i, k) => {
      const x = 23.5 + k * 29, y = 21;
      if (set.includes(i)) s += `<circle cx="${x}" cy="${y}" r="13" fill="${EMBLEMS[i].c}"/>` + icon(i, x, y, 17, EMBLEMS[i].ink, 1.9);
      else s += `<circle cx="${x}" cy="${y}" r="10.5" fill="none" stroke="#D3C9B5" stroke-width="1.1" stroke-dasharray="2.3 2.3"/>` + icon(i, x, y, 12, '#D6CDBA', 1.2);
    });
    return s;
  }

  function cardSVG(set, opts) {
    opts = opts || {};
    const id = opts.id != null ? opts.id : mask(set);
    const omen = isOmen(set);
    const top = opts.layout === 'top';
    const SW = top ? 234 : 190, SH = top ? 284 : 326, SHz = top ? 158 : 186;
    const sc = opts.face && opts.face !== 'scene' ? { defs: '', body: abstractFace(set, opts.face, SW, SH) } : scene(set, id, SW, SH, SHz);
    const sx = top ? 8 : 52, sy = top ? 50 : 12;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 350" width="${opts.width || 250}" height="${opts.height || 350}">`;
    s += `<defs>${sc.defs}</defs>`;
    s += `<rect x="0" y="0" width="250" height="350" ${opts.rounded ? 'rx="12"' : ''} fill="#F7F4ED"/>`;
    s += top ? topBand(set) : strip(set);
    s += `<g transform="translate(${sx} ${sy})">${sc.body}<rect x="0" y="0" width="${SW}" height="${SH}" rx="10" fill="none" stroke="${omen ? '#B8892B' : '#D6CEBD'}" stroke-width="${omen ? 3 : 1}"/></g>`;
    if (top) s += `<text x="125" y="345" text-anchor="middle" font-family="Nunito, Verdana, sans-serif" font-weight="800" font-size="9" fill="#9A8F7B" letter-spacing="1">Lij</text>`;
    if (omen) {
      s += `<rect x="2.5" y="2.5" width="245" height="345" rx="12" fill="none" stroke="#B8892B" stroke-width="5"/>`;
      if (top) s += `<path transform="translate(108 342) scale(0.6)" d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8Z" fill="#B8892B"/>`;
      else s += `<path transform="translate(23 314)" d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8Z" fill="#B8892B"/>`;
    }
    return s + `</svg>`;
  }

  function backSVG(opts) {
    opts = opts || {};
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 350" width="${opts.width || 250}" height="${opts.height || 350}">`;
    s += `<rect x="0" y="0" width="250" height="350" ${opts.rounded ? 'rx="12"' : ''} fill="#2B2F5E"/>`;
    s += `<rect x="12" y="12" width="226" height="326" rx="10" fill="none" stroke="#C9A85A" stroke-width="1.5"/>`;
    s += `<path d="M12 300 L60 236 L84 262 L122 214 L160 262 L184 244 L238 300 L238 338 L12 338Z" fill="#232750"/>`;
    s += `<path d="M12 318 L52 278 L86 300 L130 266 L176 304 L206 284 L238 312 L238 338 L12 338Z" fill="#1C2046"/>`;
    const cx = 125, cy = 150, R = 72;
    STRIP.forEach((i, k) => {
      const a = -Math.PI / 2 + (k * Math.PI) / 4, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="${EMBLEMS[i].c}" stroke="#F7F4ED" stroke-width="1.5"/>` + icon(i, x, y, 20, EMBLEMS[i].ink, 1.9);
    });
    s += `<circle cx="${cx}" cy="${cy}" r="44" fill="none" stroke="#C9A85A" stroke-width="1" opacity="0.6"/>`;
    s += `<text x="${cx}" y="${cy + 12}" text-anchor="middle" font-family="Nunito, Verdana, sans-serif" font-weight="800" font-size="36" fill="#F7F4ED" letter-spacing="2">Lij</text>`;
    return s + `</svg>`;
  }

  const api = { EMBLEMS, STRIP, CARDS, mask, isOmen, shared, cardSVG, backSVG, icon };
  if (typeof module !== 'undefined') module.exports = api; else root.Lij = api;
})(this);
