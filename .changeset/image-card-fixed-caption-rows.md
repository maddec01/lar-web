---
'@lar-works/design-system': minor
---

ImageCard: one caption anatomy for every catalog tile — fixed one-line rows (title, then `subtitle`, then a `meta`
line whose facts share it with a `quality` badge), so every card of a grid ends at the same height. New `meta`,
`quality`, `status` (a passing state such as "Updating details…" takes the meta line's place), `rows` (rows a grid's
cards all keep, empty or not) and `selected`; `detail` and `titleDetail` are gone (use `meta`). Titles keep one line,
in full on hover and to screen readers; pointing at a card veils its art. Loading cards draw `textRows` rows of the
same height, and VirtualGrid's row estimate matches. Exports type `ImageCardRow`.
