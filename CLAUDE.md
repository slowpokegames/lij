# Lij

Lij (from "Ellijay") is a 70-card deck: every way to choose 4 of 8 emblems, once each. Made for Tim's youngest daughter.

## Emblems (final choices)
Order in the left strip, top to bottom: Sun, Moon, Leaves, Mountains, Fire, Water, Flower, Snow.
Each emblem has three yes/no traits, placing the 8 on the corners of a cube:

| Emblem | Moving / still | Warm / cool | High / low |
|---|---|---|---|
| Sun | moving | warm | high |
| Moon | moving | cool | high |
| Fire | moving | warm | low |
| Water | moving | cool | low |
| Leaves | still | warm | high |
| Mountains | still | cool | high |
| Flower | still | warm | low |
| Snow | still | cool | low |

In `src/cards.js`, `EMBLEMS[i].b` = [still?, warm?, high?] bits. Flower and Snow replaced Sand and Rocks (too similar to Mountains). Flower pink is light (#F29AC9) so it is distinct from Fire's red-orange.

## Structure
- Card relations: against any card the other 69 split 1 opposite (share 0), 16 share 1, 36 share 2, 16 share 3.
- **Omens**: the 14 cards whose 4 emblems form a plane of the cube (XOR of trait bits is 0). Gold frame + star. Any 3 emblems lie on exactly one Omen (Steiner system S(3,4,8)).
- **Harmony**: 3 cards whose XOR is empty (every shown emblem appears exactly twice). 420 of them. **Eclipse**: XOR = all 8. 420 of them.
- Opposite pairs (35) correspond to Creature Combo cards (lines of PG(3,2)) via the Klein correspondence; "share 2" ⇔ lines meet. See `research/creature_combo_correspondence.py`.

## Card design (decided)
- Poker size 2.5" × 3.5" (SVG viewBox 250 × 350).
- **Left strip** of 8 fixed emblem slots (filled = on card, dashed ghost = missing). Tim chose this over a top band (`design/top-band-vs-left-strip.png`) because it reads in a fanned hand. `cardSVG(set, {layout:'top'})` still exists but is unused.
- Central **scene** built from the emblems: Sun/Moon set day, night, dusk (both) or cloudy (neither); Mountains on the horizon; Water a lake; Snow white ground + flakes + frosted tree; Flower wildflowers (crocuses in snow); Leaves a tree; Fire a campfire. Otherwise a green meadow.
- **Second deck, emblem badges** (`cardSVG(set, {face:'emblems'})`): same strip, but the panel shows the card's 4 emblems as big colored pills stacked in strip order, SET-style. Tim chose it over trait-symbol faces (`face:'traits'` / `'traits-icon'`: moving = dome, still = triangle, warm = orange, cool = blue, high points up, low points down), which still exist. Comparison: `design/face-styles.png` (`npm run faces`).
- Back: emblems in a ring around "Lij" with mountain silhouettes.

## Games (all in `src/games.src.html`)
Harmony (SET-like, 15-card board, optional Eclipses), Mirror (memory, match opposites), Echo (slap on share-3 = +1, opposites = +3, wrong −1), Seek (two-player deduction, ask "how many shared?"; optimal ≤5 questions), Clans (rummy: clan = 3+ cards sharing the same 3 emblems; opposite pair = 2-card meld), Great Loop (Hamiltonian cycle on the share-3 graph; hint uses look-ahead DFS that always finds a completion), plus a Deck browser.

## Build
```
npm install && npx playwright install chromium
npm run build      # dist/Lij-games.html (single self-contained page; cards.js inlined)
npm run pdf        # dist/Lij-deck-print.pdf (8 front sheets + 1 back sheet, 9/letter page, crop marks)
npm run sheet      # dist/contact-sheet.png
npm run pdf:emblems    # dist/Lij-deck-print-emblems.pdf (emblem-badge deck)
npm run sheet:emblems  # dist/contact-sheet-emblems.png
npm test           # builds, then plays every game headlessly and prints results
```
Edit `src/cards.js` for art and `src/games.src.html` for game logic/UI; never edit `dist/Lij-games.html` directly.

## Other
- `design/layout-canvas/` – earlier layout exploration (4×2, 2×4, just four, orthographic cube); the cube view was refined but the left strip + scene won.
- Published web version (claude.ai artifact, private): https://claude.ai/artifact/SjCqoWcZNQpeGQHt3yLzDW
