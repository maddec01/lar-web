---
'@lar-works/design-system': minor
---

One caption contract for every catalog grid: `ImageCard` always draws three one-line rows — the title, the maker
(`subtitle`) and the meta row (`meta`, then the `quality` badge, or a `status` in their place) — empty when the item
has nothing for one, so every grid's cards end at the same height. NEW `noMaker` for kinds that never have a maker
(photos, photo albums, artists): the meta row follows the title and the reserved row comes last. `presentation="person"`
keeps a name and a role. REMOVED `rows` and the `ImageCardRow` type, and the loading card's `textRows` (it always
draws the three rows). `VirtualGrid` REMOVES `textRows`: its row estimate counts the three rows. `ScrollRow`'s loading
row uses ImageCard's loading card, so its placeholders match the cards that replace them.
