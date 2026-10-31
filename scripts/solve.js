const L=require('../src/cards.js');const M=L.CARDS.map(L.mask);const pop=x=>{let n=0;while(x){n+=x&1;x>>=1}return n};
const N=70;const NB=[...Array(N).keys()].map(i=>[...Array(N).keys()].filter(j=>pop(M[i]&M[j])===3));
function solveNext(chain,left,budget=200000){
  const first=chain[0];const rem=new Set(left);let nodes=0;const path=[];
  const deg=a=>NB[a].reduce((s,j)=>s+(rem.has(j)?1:0),0);
  function dfs(end){
    if(!rem.size) return NB[end].includes(first);
    if(++nodes>budget) return false;
    if(!NB[first].some(j=>rem.has(j))) return false;
    const cand=NB[end].filter(j=>rem.has(j)).sort((a,b)=>deg(a)-deg(b));
    for(const c of cand){rem.delete(c);path.push(c);if(dfs(c))return true;path.pop();rem.add(c);if(nodes>budget)return false;}
    return false;
  }
  const ok=dfs(chain[chain.length-1]);return {ok,next:path[0],nodes,path};
}
let t=Date.now(),okc=0;
for(let s=0;s<70;s++){const left=new Set([...Array(70).keys()].filter(x=>x!==s));const r=solveNext([s],left);if(r.ok)okc++;}
console.log('solved from',okc,'of 70 starts in',Date.now()-t,'ms');
