// Side-by-side sheet of card face styles (scene, emblems, traits, traits-icon) for six sample cards.
const L=require('../src/cards.js');const {chromium}=require('playwright');
(async()=>{
 const om=L.CARDS.map((c,i)=>i).filter(i=>L.isOmen(L.CARDS[i]));
 const no=L.CARDS.map((c,i)=>i).filter(i=>!L.isOmen(L.CARDS[i]));const idx=[no[3],no[14],om[4],no[30],no[44],no[52]];
 const faces=['scene','emblems','traits','traits-icon'];
 let h='';
 for(const f of faces){h+=`<div style="font:800 20px Nunito,sans-serif;margin:14px 0 6px">${f}</div><div style="display:flex;gap:12px">`+idx.map(i=>`<img src="data:image/svg+xml;utf8,${encodeURIComponent(L.cardSVG(L.CARDS[i],{rounded:true,face:f}))}" width="200">`).join('')+'</div>';}
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:800}});
 await p.setContent(`<body style="margin:14px;background:#ccc">${h}</body>`);await p.waitForTimeout(300);
 await p.screenshot({path:process.argv[2]||'face-styles.png',fullPage:true});await b.close();console.log(idx.map(i=>L.CARDS[i].map(e=>L.EMBLEMS[e].n).join('/')));
})();
