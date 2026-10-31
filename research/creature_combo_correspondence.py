from itertools import combinations, permutations
E=["Sun","Moon","Water","Fire","Mountains","Leaves","Rocks","Sand"]
cards=[frozenset(c) for c in combinations(range(8),4)]
pairs=sorted({frozenset([c,frozenset(range(8))-c]) for c in cards},key=lambda p:min(tuple(sorted(x)) for x in p))
std=frozenset(c for c in cards if (lambda a,b,c_,d:a^b^c_^d)(*c)==0)
def sign(p):
  s=1;p=list(p)
  for i in range(8):
    for j in range(i+1,8):
      if p[i]>p[j]: s=-s
  return s
orb={}
for p in permutations(range(8)):
  S=frozenset(frozenset(p[x] for x in c) for c in std)
  if S not in orb: orb[S]=sign(p)
even=[S for S,s in orb.items() if s==1]; odd=[S for S,s in orb.items() if s==-1]
print(len(orb),len(even),len(odd))
pts=even
inc={P:[i for i,S in enumerate(pts) if all(c in S for c in P)] for P in pairs}
assert all(len(v)==3 for v in inc.values())
lines=[frozenset(v) for v in inc.values()]
# any two points on exactly one line
from collections import Counter
cnt=Counter(frozenset(x) for L in lines for x in combinations(L,2)); assert len(cnt)==105 and set(cnt.values())=={1}
third={}
for L in lines:
  a,b,c=L; third[frozenset([a,b])]=c;third[frozenset([a,c])]=b;third[frozenset([b,c])]=a
# find basis: 4 points not coplanar; build map
def span(B):
  vec={}
  for m in range(1,16):
    idx=[B[i] for i in range(4) if m>>i&1]
    p=idx[0]
    for q in idx[1:]: p=third[frozenset([p,q])] if p!=q else None
    vec[m]=p
  return vec
for B in permutations(range(15),4):
  try:
    v=span(B)
  except Exception: continue
  if None in v.values() or len(set(v.values()))!=15: continue
  inv={p:m for m,p in v.items()}
  ok=all((inv[a]^inv[b])==inv[c] for L in lines for a,b,c in [tuple(L)])
  if ok: break
name=lambda m:"".join("ABCD"[i] for i in range(4) if m>>i&1)
rows=[]
for P in pairs:
  c=min(P,key=lambda x:tuple(sorted(x)))
  animals=sorted((inv[i] for i in inc[P]),key=lambda m:(bin(m).count('1'),m))
  rows.append((" + ".join(E[i] for i in sorted(c))," + ".join(E[i] for i in sorted(frozenset(range(8))-c)),", ".join(name(a) for a in animals)))
for r in rows: print(" | ".join(r))
# check: overlap2 <-> lines meet
def meet(P,Q): return bool(set(inc[P])&set(inc[Q]))
for P,Q in combinations(pairs,2):
  a=next(iter(P)); b=next(iter(Q)); k=len(a&b)
  assert meet(P,Q)==(k==2), k
# spreads: 5 pairwise skew lines ↔ 5 pairs, every two overlapping odd
print("verified: share-2 <=> lines meet")
# animal = 7 pairs
for m in (1,3,15):
  i=[k for k,v in inv.items() if v==m][0]
  S=pts[i]; prs=sorted({min(c,frozenset(range(8))-c,key=lambda x:tuple(sorted(x))) for c in S},key=lambda x:tuple(sorted(x)))
  print(name(m),":"," / ".join("+".join(E[j] for j in sorted(c)) for c in prs))
