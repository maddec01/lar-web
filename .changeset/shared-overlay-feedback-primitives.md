---
'@lar-works/design-system': minor
---

Shared overlay and feedback primitives, so the apps stop improvising the same surfaces:

- `PopoverHeader`: a toolbar or counter popover's header (sentence-case title, quiet count or status light and word, optional action, divider always). `StatusPopoverContent` composes it, gains `count`, `action` and `width="lg"`, and caps at 32rem with its rows scrolling under the header (`Popover.Content height="capped"`).
- `ConfirmDialog`: "Delete {name}?", the consequence, an optional neutral `reassurance` note, an explicit confirm label, danger or primary tone, busy state; a compact `Modal.Content presentation="confirm"` read as an alert dialog.
- Menus: chosen `DropdownMenu.RadioItem` and `CheckboxItem` entries carry a trailing tick instead of a fill alone; `RadioGroup` and `Group` take a `label` that heads and names the group. A `Select`'s list is as wide as its trigger or its longest option, up to the window, so option labels never clip; its tick sits at the end too.
- Notifications: one contract. `showNotification` takes `tone` (`success`, `info`, `warning`, `danger`), `title`, `description`, `body` and an `action`; every notification shows its tone's icon, tint and edge in both presentations; warnings and failures stay until closed, successes and infos clear themselves after hover and focus leave. `showErrorNotification` (now with an optional `action`) and `showSuccessNotification` go through it.
- `AppSplash`: the shared app boot screen (the drawing Lar lockup, a rolling status line, a calm progress track). The board's `LoadingScreen` renders the same view.
- Alerts: dark tinted surfaces are low-chroma, every Alert has a coloured edge, and the icon centres on the first line at both sizes. New `AttentionList` gathers stacked problems in one "Needs attention" surface, one row and action per problem.
- `CommandPalette`: the palette renders its own key hints ("↑↓ move · ↵ select · esc close", plus "⌫ remove filter" or "back"), translated through `DesignSystemProvider` `labels.commandPalette` or a palette's `hints`; the `footer` prop is removed. Every palette is one width (40rem). `CommandPaletteOption` gains `current`.
