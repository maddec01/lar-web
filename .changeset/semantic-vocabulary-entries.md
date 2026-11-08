---
'@lar-works/design-system': minor
---

Components now speak only the semantic colour layer, and a guard test keeps it that way: no base-ramp primitive, no
per-component `dark:` colour override and no in-place `color-mix()` outside the foundations.

- New semantic tokens, light and dark, contrast-tested: `surface-control`, `surface-glass`, `fill-selected`,
  `fill-muted`, `fill-muted-hover`, `line-hover`, `line-control`, `line-strong-hover`, `primary-surface-hover` and
  `danger-fill-hover`. The dark success and warning surfaces are a step deeper, so muted text reads on them.
- Text fields, selects and textareas have a 3:1 edge (`line-strong`) on a `surface-control` fill in both themes, a
  deeper edge on hover, and fade when disabled.
- **Breaking:** the board's compositions moved to `@lar-works/design-system/board` and the showcase's to
  `@lar-works/design-system/showcase`; the root entry keeps the generic layers and `media`. The board's roles are
  renamed to Tailwind colours (`--you`/`--st-amber` → `--color-board-you`, `--thread`/`--st-now` →
  `--color-board-active`, `--sub`/`--st-review` → `--color-board-review`, `--build`/`--st-done` →
  `--color-board-done`, `--st-idle` → `--color-board-idle`, plus `--color-board-past`) for glyphs, dots and bars only;
  `boardColor` gives apps those colours without writing `var(--…)`.
- One link recipe (`accent`, `inherit`, `muted`) for `Link` (new `tone` prop), `InlineLink`, RichText, the Markdown
  editor and the board's links.
- RichText draws task-list checkboxes as Checkbox does, `<details>` summaries with the disclosure chevron, and its
  tables, rules and quotes in the line tokens.
- Contrast fixes: Kbd, chart timestamps, list headers, Alert text (each tone's `-fg` on its surface), muted text in
  ActivityLine and on chosen rows, the board's attention labels (role colour on a dot, text in a text token) and the
  ImageViewer caption, now on a dark stage in both themes.
- New `ModalExpandButton` stories.
