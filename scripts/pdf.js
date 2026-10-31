const L=require('../src/cards.js');const {chromium}=require('playwright');const fs=require('fs');
const font=fs.readFileSync(require('path').join(__dirname,'../node_modules/@fontsource/nunito/files/nunito-latin-800-normal.woff2')).toString('base64');
// Optional argument: card face style (scene, emblems, ...); non-scene styles get a suffixed filename.
const FACE=process.argv[2]||'scene', SUF=FACE==='scene'?'':'-'+FACE;
const IN=96; const CW=2.5*IN, CH=3.5*IN;
function page(svgs, label){
  const ox=(8.5*IN-3*CW)/2, oy=(11*IN-3*CH)/2;
  let h=`<div class="pg">`;
  svgs.forEach((s,k)=>{const x=ox+(k%3)*CW, y=oy+Math.floor(k/3)*CH; h+=`<div style="position:absolute;left:${x}px;top:${y}px;width:${CW}px;height:${CH}px">${s}</div>`;});
  // crop marks at the outer edges of each grid line
  const xs=[0,1,2,3].map(i=>ox+i*CW), ys=[0,1,2,3].map(i=>oy+i*CH);
  let m='';
  xs.forEach(x=>{m+=`<line x1="${x}" y1="${oy-30}" x2="${x}" y2="${oy-6}"/><line x1="${x}" y1="${oy+3*CH+6}" x2="${x}" y2="${oy+3*CH+30}"/>`;});
  ys.forEach(y=>{m+=`<line x1="${ox-30}" y1="${y}" x2="${ox-6}" y2="${y}"/><line x1="${ox+3*CW+6}" y1="${y}" x2="${ox+3*CW+30}" y2="${y}"/>`;});
  h+=`<svg style="position:absolute;left:0;top:0" width="${8.5*IN}" height="${11*IN}"><g stroke="#888" stroke-width="0.6">${m}</g><text x="${8.5*IN/2}" y="${11*IN-14}" text-anchor="middle" font-family="Nunito" font-size="9" fill="#999">${label}</text></svg>`;
  return h+`</div>`;
}
(async()=>{
  const fronts=L.CARDS.map(c=>L.cardSVG(c,{width:CW,height:CH,face:FACE}));
  let body='';
  for(let p=0;p<8;p++) body+=page(fronts.slice(p*9,p*9+9),`Lij · fronts ${p+1} of 8 · cards ${p*9+1}–${Math.min(70,p*9+9)} · print at 100% (actual size)`);
  body+=page(Array(9).fill(L.backSVG({width:CW,height:CH})),'Lij · backs · print 8 copies on the reverse, or on separate stock and glue');
  const html=`<html><head><style>@font-face{font-family:Nunito;font-weight:800;src:url(data:font/woff2;base64,${font}) format('woff2')}
  @page{size:8.5in 11in;margin:0}body{margin:0}.pg{position:relative;width:8.5in;height:11in;page-break-after:always;overflow:hidden}svg text{font-family:Nunito}</style></head><body>${body}</body></html>`;
  const b=await chromium.launch();const pg=await b.newPage();await pg.setContent(html);await pg.evaluate(()=>document.fonts.ready);
  await pg.pdf({path:`Lij-deck-print${SUF}.pdf`,width:'8.5in',height:'11in',printBackground:true});
  await pg.setViewportSize({width:816,height:1056});await pg.screenshot({path:`pdfp1${SUF}.png`,clip:{x:0,y:0,width:816,height:1056}});
  await b.close();
})();
