---
'@lar-works/design-system': minor
---

Foundations without one-offs:

- Semantic `--color-{primary,success,warning,danger,info}-edge` (a toned border on a neutral box) and `-ring` (the
  hairline of a tinted box), light and dark, plus `--color-primary-fill-hover`. Badge, Alert, Button, ButtonLink,
  AttentionList, CommandPalette, ImagePicker, ResultList, form controls and the board use them; a test fails on a status
  hue at an ad-hoc alpha.
- One even twelve-step neutral ramp per theme (`--color-palette-zinc-1…12` light, `--color-palette-neutral-1…12`
  dark) in place of fifteen and eighteen near-identical steps; roles that share a value are documented; the scrollbar
  takes `--color-scrollbar-thumb(-hover)`. Dark surfaces and lines move by at most a step.
- Radii only from the scale, now with `xs` (4px) and `3xl` (24px); four tracking steps (`tracking-display`, `-title`,
  `-heading`, `-caps`) replace eleven letter-spacings. `scales.test.ts` fails on any other radius or tracking.
