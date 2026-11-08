---
'@lar-works/design-system': minor
---

One prop vocabulary, checked at the type level (`foundations/propVocabulary.test.ts`): `tone` is a status colour
(StatusTone or `accent`; the text components add muted/lead/soft), a look is a `variant`, a scale is `size` on one
`xs`–`xl` ladder, and `presentation` never sizes. Renames (no aliases):

- `ConfirmDialog tone="danger" | "primary"` → `intent="destructive" | "default"`.
- `PageSection tone="plain" | "raised"` → `variant`; `SectionHeading size="display" | "headline"` → `variant`.
- `FormResult tone="error"` → `tone="danger"`; `DetailsText tone="muted" | "error"` → `"neutral" | "danger"`.
- `MeterTone` (`StackedMeter`, `LegendSwatch`) `'primary'` → `'accent'`.
- `BrowserFrame tone="dark"` → `scheme="dark"`; `MapPartNode tone="asks" | "waits"` → `attention`.
- `StatusGlyph`/`StatusGlyphSlot` `presentation="compact" | "default" | "title"` → `size="sm" | "md" | "lg"`.
- `ProjectIcon size="small" | "row" | "medium"` → `size="sm" | "md" | "lg"`.
- `ResultList density="comfortable"` → `density="default"`.
