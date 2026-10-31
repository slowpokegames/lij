const L=require('../src/cards.js');const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const idx=process.argv[2]?process.argv[2].split(',').map(Number):[...Array(70).keys()];
 const imgs=idx.map(i=>`<img src="data:image/svg+xml;utf8,${encodeURIComponent(L.cardSVG(L.CARDS[i],{rounded:true,face:process.argv[4]}))}" width="250">`).join('')+`<img src="data:image/svg+xml;utf8,${encodeURIComponent(L.backSVG({rounded:true}))}" width="250">`;
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1340,height:800}});
 await p.setContent(`<body style="margin:10px;background:#ccc;display:flex;flex-wrap:wrap;gap:10px">${imgs}</body>`);
 await p.waitForTimeout(300);await p.screenshot({path:process.argv[3]||'sheet.png',fullPage:true});await b.close();
 console.log(L.CARDS.length, L.CARDS.filter(L.isOmen).length);
})();
