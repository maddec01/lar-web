---
'@lar-works/design-system': minor
---

One token architecture. `foundations/theme.css` adds a semantic layer over the primitives, light and dark, and every
generic component uses it: surfaces (`surface-page`, `surface-raised`, `surface-sunken`, `surface-overlay`,
`fill-hover`, `track`), text (`fg`, `fg-soft`, `fg-muted`, `fg-inverse`), edges (`line`, `line-strong`, `focus`), brand
(`primary-fg`, `primary-surface`) and each status's `-fill`, `-on-fill`, `-fg` and `-surface`, all checked for WCAG AA
contrast. Status text now uses the `-fg` tokens and the destructive button an AA fill. The board's duplicate vocabulary
(`--foreground`, `--muted-foreground`, `--card`, `--soft`, `--primary`, `--ring`…) and `--lar-*-text` are gone: board.css
keeps only the board's own roles (`--you`, `--thread`, `--sub`, `--build`, `--st-*`). The showcase's device, glow and
grid tokens move to `showcase.css`.

Scales: named type steps (`text-3xs`, `text-ui`, `text-md`, `text-title`, `text-headline`, `text-display`), named
container breakpoints (`@pane`, `@split`), `max-w-page`, elevation (`--shadow-raised`, `--shadow-popup`,
`--shadow-dialog`, replacing `--lar-shadow-*`) and motion tokens (`--motion-duration-*`, `--motion-loop-*`,
`ease-standard`, `ease-emphasized`) with a reduced-motion policy. One focus ring (`focus-ring`, `focus-ring-inset`,
`focus-ring-within`, `focus-ring-stretched`, `focus-field`), on every element by default, replacing the board's own.
The Switch owns its states (an off track at 3:1, a disabled one clearly fainter), checkboxes and radios take a 3:1
edge, and a Markdown task list's checkboxes are named by their item.
