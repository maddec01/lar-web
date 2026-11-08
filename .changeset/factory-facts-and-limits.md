---
'@lar-works/design-system': minor
---

Make Lar Factory's item dialog and build limit read plainly. `OptionSelect` gains `presentation="inline"`, a value
in a row of facts that edits in place (no field edge, hover fill). `DetailFact` in the meta area sets its label over
its value, and `MetaArea` lays the facts out as one row. `CounterOfLimit` takes `used` and draws the count with small
`LimitBars` instead of a fraction ("4/2"); `LimitBars` takes a `size` and its words as `children`
("4 running · limit 2"). `KindMarker` says what the ticket says in words, without its arrows glyph or `label`.
`RowStateCell` wraps what follows the state under it instead of cutting it off.
