---
'@lar-works/design-system': minor
---

`AttentionList` is redesigned: a card whose header band is tinted in the worst problem's tone (an icon tile, the title,
a tinted count pill and a new optional header `action`), then one row per problem on the card surface, its action at
the row's end (under the text on a narrow card). New `collapsible` folds the rows under the header, and
`AttentionList.Item` takes `onDismiss`/`dismissLabel` and `data-*` attributes. Use it for one problem or many. Lar
Factory's `BoardWarnings` is now this list (new `leadTitle` and required `toggleLabel`; `summary` is a string) and
`BoardWarning` an `AttentionList.Item` with an optional `tone`.
