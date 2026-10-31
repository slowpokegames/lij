const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>'+fs.readFileSync('Lij-games.html','utf8')+'</body></html>';
 fs.writeFileSync('t.html',html);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+process.cwd()+'/t.html#harmony');await p.waitForTimeout(500);
 // Harmony: find set
 const r=await p.evaluate(()=>{const L=window.Lij;const M=L.CARDS.map(L.mask);const ids=[...document.querySelectorAll('#h-board .card')].map(b=>+b.dataset.i);
   for(let a=0;a<ids.length;a++)for(let c=a+1;c<ids.length;c++)for(let d=c+1;d<ids.length;d++)if((M[ids[a]]^M[ids[c]]^M[ids[d]])===0)return [ids.length,ids[a],ids[c],ids[d]];return [ids.length]});
 console.log('harmony board',r);
 for(const i of r.slice(1)) await p.click(`#h-board .card[data-i="${i}"]`);
 await p.waitForTimeout(1600);console.log('harmony score',await p.textContent('#h-score'),await p.textContent('#h-msg'));
 await p.screenshot({path:'g-harmony.png'});
 // Mirror
 await p.goto('file://'+process.cwd()+'/t.html#mirror');await p.waitForTimeout(300);
 const mc=await p.$$('#m-board .card');console.log('mirror cards',mc.length);await mc[0].click();await (await p.$$('#m-board .card'))[1].click();await p.waitForTimeout(700);
 console.log('mirror',await p.textContent('#m-msg'));await p.screenshot({path:'g-mirror.png'});
 // Echo
 await p.goto('file://'+process.cwd()+'/t.html#echo');await p.waitForTimeout(300);
 await p.selectOption('#e-speed','950');await p.click('#e-start');await p.waitForTimeout(4500);await p.keyboard.press('Space');await p.waitForTimeout(300);
 console.log('echo',await p.textContent('#e-you'),await p.textContent('#e-bot'),await p.textContent('#e-left'),await p.textContent('#e-msg'));
 await p.screenshot({path:'g-echo.png'});await p.click('#e-start');
 // Seek
 await p.goto('file://'+process.cwd()+'/t.html#seek');await p.waitForTimeout(300);
 for(let k=0;k<3;k++){const c=await p.$$('#s-grid .card:not(.dim):not([disabled])');if(!c.length)break;await c[Math.floor(c.length/2)].click();await p.waitForTimeout(900);}
 console.log('seek',await p.textContent('#s-counts'),await p.textContent('#s-msg'));await p.screenshot({path:'g-seek.png'});
 // Clans
 await p.goto('file://'+process.cwd()+'/t.html#clans');await p.waitForTimeout(300);
 for(let t=0;t<4;t++){
   await p.click('#c-deck');await p.waitForTimeout(100);
   // deselect all, select first card, discard
   const sel=await p.$$('#c-hand .card.sel');for(const s of sel)await s.click();
   const hc=await p.$$('#c-hand .card');await hc[0].click();await p.click('#c-discard-btn');await p.waitForTimeout(1800);
   console.log('clans turn',t,await p.textContent('#c-msg'),'bot',await p.textContent('#c-bothand'),'melds',(await p.$$('#c-melds .meld')).length);
 }
 await p.screenshot({path:'g-clans.png'});
 // Loop
 await p.goto('file://'+process.cwd()+'/t.html#loop');await p.waitForTimeout(300);
 for(let k=0;k<69;k++){await p.click("#l-hint");const h=await p.$('#l-pool .card.hint');if(!h)break;await h.click();}
 console.log('loop',await p.textContent('#l-count'),await p.textContent('#l-msg'));await p.screenshot({path:'g-loop.png'});
 await p.goto('file://'+process.cwd()+'/t.html#deck');await p.waitForTimeout(300);console.log('deck',await p.textContent('#d-count'));
 await p.click('#v-deck [data-f="omen"]');console.log('omens',await p.textContent('#d-count'));
 // phone width
 await p.setViewportSize({width:390,height:844});await p.goto('file://'+process.cwd()+'/t.html#harmony');await p.waitForTimeout(300);
 console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth));await p.screenshot({path:'g-phone.png'});
 console.log('errors',errs);await b.close();
})();
