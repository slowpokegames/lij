const A=require('../src/cards.js'),L=require('../src/cards.js');const {chromium}=require('playwright');const fs=require('fs');
const font=fs.readFileSync(require('path').join(__dirname,'../node_modules/@fontsource/nunito/files/nunito-latin-800-normal.woff2')).toString('base64');
const pick=[0,20,34,45,56,63];
const svg=(s)=>`<div class="c">${s}</div>`;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:900}});
 // pixel check: old vs new left strip
 let diff=0;
 for(const i of [0,20,45,63]){
   await p.setContent(`<body style="margin:0">${A.cardSVG(A.CARDS[i])}</body>`);const x=await p.screenshot({clip:{x:0,y:0,width:250,height:350}});
   await p.setContent(`<body style="margin:0">${L.cardSVG(L.CARDS[i])}</body>`);const y=await p.screenshot({clip:{x:0,y:0,width:250,height:350}});
   if(!x.equals(y))diff++;
 }
 console.log('left-strip pixel diffs',diff);
 const row=(lay)=>pick.map(i=>svg(L.cardSVG(L.CARDS[i],{layout:lay,rounded:true,id:lay+i}))).join('');
 // overlap demos: column of 6 cards top layout (show 50px each), fan of left-strip cards
 const col=pick.map((i,k)=>`<div style="position:absolute;left:0;top:${k*50}px;width:250px;height:350px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))">${L.cardSVG(L.CARDS[i],{layout:'top',rounded:true,id:'c'+i})}</div>`).join('');
 const fan=pick.map((i,k)=>`<div style="position:absolute;left:${k*52}px;top:0;width:250px;height:350px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))">${L.cardSVG(L.CARDS[i],{rounded:true,id:'f'+i})}</div>`).join('');
 const lab=(t)=>`<div style="font:800 20px Nunito;color:#F7F4ED;margin:4px 0 10px">${t}</div>`;
 await p.setContent(`<html><head><style>@font-face{font-family:Nunito;font-weight:800;src:url(data:font/woff2;base64,${font})}body{margin:0;padding:24px;background:#242958;font-family:Nunito}.r{display:flex;gap:16px}.c{width:250px;height:350px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))}</style></head><body>
 ${lab('Current: emblems down the left edge')}<div class="r">${row('left')}</div>
 <div style="height:28px"></div>${lab('Proposed: emblems across the top edge')}<div class="r">${row('top')}</div>
 <div style="height:28px"></div>
 <div class="r" style="gap:70px">
  <div>${lab('Top band, overlapped in a column')}<div style="position:relative;width:250px;height:${5*50+350}px">${col}</div></div>
  <div>${lab('Left strip, fanned in a hand')}<div style="position:relative;width:${5*52+250}px;height:350px">${fan}</div></div>
  <div>${lab('Top band, fanned in a hand')}<div style="position:relative;width:${5*52+250}px;height:350px">${pick.map((i,k)=>`<div style="position:absolute;left:${k*52}px;top:0;width:250px;height:350px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))">${L.cardSVG(L.CARDS[i],{layout:'top',rounded:true,id:'t'+i})}</div>`).join('')}</div></div>
 </div></body></html>`);
 await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 await p.screenshot({path:'Lij-top-vs-left.png',fullPage:true});await b.close();
})();
