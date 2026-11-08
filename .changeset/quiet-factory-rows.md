---
'@lar-works/design-system': minor
---

Quieter, single-height board rows and a dialog that states each fact once: desk cards keep a neutral border (the status
glyph and word carry the colour), `RowSide` takes `figures` beside its action so a row with nothing else to add keeps one
height (the side column widens to 13rem), `SliceChip` takes `href` to open its ticket, every item dialog section heading
(description, comments, working agents, sidebar lists) shares the sentence-case `label` style, attention labels are
sentence case beside their tone dot, and emoji project icons are sized like line icons. `OpenSettingsButton` draws its
icon again under icon-only Buttons. `BoardCounter`, `RefreshIndicator`, `BoardTitleBar`, `EarlierThread` and
`EditorSlot` expose `data-*` hooks (`data-fold`, `data-width`, `data-counter-head|list|foot`, `data-health`,
`data-past-lights`, `data-thread-name|state`, `data-editor-slot`) so app tests can read state without depending on
classes; the counter geometry moves into the design system's own test.
