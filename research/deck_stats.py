from itertools import combinations
from functools import lru_cache
import random
E=range(8); D=[frozenset(c) for c in combinations(E,4)]
print("cards",len(D))
F=frozenset(E)
even=[t for t in combinations(D,3) if not (t[0]^t[1]^t[2])]
odd=[t for t in combinations(D,3) if (t[0]^t[1]^t[2])==F]
print("even trios",len(even),"odd",len(odd))
# exp trios on board N
from math import comb
for N in (12,15,16,18): print(N, round(comb(N,3)*len(even)/comb(70,3),2))
# prob board of N has no even trio (sim)
for N in (12,15,16):
  z=0
  for _ in range(20000):
    b=random.sample(D,N); s=set(b)
    if not any((x^y) in s for x,y in combinations(b,2)): z+=1
  print("no-trio",N,z/20000)
# SQS: cube planes
pl=[c for c in D if (lambda a,b,c_,d:a^b^c_^d)(*c)==0]
print("planes",len(pl))
# Seek: adaptive worst case queries, query any card, answer=overlap
idx={c:i for i,c in enumerate(D)}
@lru_cache(None)
def w(S):
  if len(S)==1: return 0
  best=99
  for q in D:
    parts={}
    for c in S: parts.setdefault(len(q&c),[]).append(c)
    if len(parts)==1: continue
    best=min(best,1+max(w(frozenset(p)) for p in parts.values()))
    if best==1+0: break
  return best
print("seek worst queries to know card",w(frozenset(D)))
# hamiltonian cycle in overlap-3 graph quick DFS
