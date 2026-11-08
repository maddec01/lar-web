---
'@lar-works/design-system': minor
---

Fold every boolean `compact` into the size ladder: Button, ButtonLink, Alert, StatusRow, ProgressStatusRow, CollectionViewToggle/ViewToggle, ScrollRow/ScrollRowArrows, ResourceCard, ActivityCard, Avatar and showcase Callout take `size="sm"` (Alert `size="md"` opts out of a surface default). DetailList `compact` becomes `variant="inline"`. DetailHero `artworkSize` is `"sm" | "md"`, DeviceStage `startSize`/`endSize` are `"sm" | "lg"`. The prop vocabulary test checks every `size`/`…Size` prop and rejects boolean size flags.
