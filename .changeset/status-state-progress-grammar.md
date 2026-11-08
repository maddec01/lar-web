---
'@lar-works/design-system': minor
---

One status and progress contract, plus form and overlay fixes:

- `StatusState` (`ready` | `active` | `waiting` | `failed` | `off`), `statusStateTones` and `statusTone()`: the one tone
  map. `StatusIndicator`, `StatusRow`, `ToolbarStatusItem`, `ProgressStatusRow` and `StatusPopoverContent` take
  `state` next to `tone` (`StatusIndicator`'s `tone` is now optional).
- `StatusSummary` for mixed states ("5 active · 3 failed"), each part in its own tone; `PopoverHeader status` and
  `StatusPopoverContent status` also take an array of parts.
- `ProgressStatusRow` is Lar's one progress grammar: identity-first `label`, `operation`, `status` (`ProgressState`:
  queued, running, paused, failed, done), `statusLabel`, `count` · percent · `eta`, `reason`; nothing truncates; the
  running bar takes the active (info) colour; `active` is now optional. Existing props keep working.
- `PasswordField` with a show/hide toggle and an optional requirement that ticks once met.
- `AppSplash chrome` (`browser` default, `desktop`): the drag region and title-bar padding apply only to desktop.
- Popovers and dropdown menus keep an 8px gutter from the window edges; board counter panels open from their counter's
  start and pad their list.
- Checkbox draws its tick centred inside the box; `CommandPaletteOption` sizes any icon (bare or in a `KindIcon`) to
  16px in the muted tone; the reduced-motion indeterminate bar is soft stripes instead of dashes.
- Every scrolling region a `Modal` can hold (its body, `SidebarPane`, `ImagePicker`, `ScrollArea`, the board's draft and
  ticket panes) fades at an edge while content runs past it, including while a field inside has focus (the fade used
  to lift whenever anything inside was focused, so editor dialogs had none).
- `Field` draws its error line in the danger colour (ninna-ui's helper colour used to win).
