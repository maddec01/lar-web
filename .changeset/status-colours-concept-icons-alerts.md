---
'@lar-works/design-system': minor
---

One answer per concept. Board statuses take the one state map's colours (`statusStateColors`, `boardStatusState`,
`sliceProgressState`, `sliceProgressLabel`, `attentionToneState`; `--color-board-active` is now `info` and
`--color-board-idle` `line-strong`), with violet only as the Review stage's identity on a stage bar (`stageColor`), and a
test that fails on any other status colour; `StatusGlyph state` and `SliceRow label`. New `LegendSwatch` (a square series
key, drawn by `MeterLegend`), `ImagePickerHeader` (one header contract for every image picker, its loading announcement named for assistive
technology), `EmptyState
size="compact"` for empty settings and archive lists, and `conceptIcons` (one icon per concept) with a Writing/Icons
glossary. Alerts of every tone colour only their icon and edge, with primary-colour text, and share ConfirmDialog's
reassurance box; ghost actions sit flush in every header and row action slot; a StatusRow with details keeps its light
on the first line; MarkdownEditor's text area fades where it overflows and keeps the caret clear of the fade; project
icons keep their colour in any container. Writing adds scan vs check-up, On/Off, headline full stops and the audience
rule; Modal.Footer documents the one-shot Checkbox option.
