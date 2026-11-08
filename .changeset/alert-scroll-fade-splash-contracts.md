---
'@lar-works/design-system': minor
---

Make the design system hard to misuse:

- `Alert`: a `title` alone renders as the regular-weight message (never a bold sentence); inside modals, forms, panes and panels alerts are `compact`.
- Scroll fade everywhere the design system scrolls: `Popover.Content layout="scroll"` and `DropdownMenu.Content` scroll in an inner fading region (the glass box never fades), plus counter lists, `Drawer.Body`, `LabelPicker`, update notes, warnings and setup cards. A test fails on any unfaded scroller.
- `conceptIcons` gains `stopped` and `noKind`; `iconConcept(element)` in `@lar-works/design-system/testing` names the concept a rendered icon draws, for apps' toolbar and empty-state tests.
- `StatusGlyph` draws the Stopped glyph for stopped work (`state="off"` on a status whose own state isn't off) and sits in a fixed box; new `StatusGlyphSlot` boxes a status light that stands in for a glyph.
- `AppSplash`/`LoadingScreen`: one status-line rule (always ends in an ellipsis, `splashStatusText`) and the indeterminate track by default, dropped while leaving.
- `DropdownMenu.ControlRow` keeps the entries' 12px inset for a row with a trailing control; menu icon rule documented.
- `StatusRow` trailing controls no longer grow the row; `HelpTip` opens above its trigger (`side` prop); `PopoverHeader` wraps instead of truncating, moving a status that doesn't fit under the title.
- `Drawer` opens focused on the drawer itself when it has no field.
- Docs: Introduction (EmptyState `compact`, PageError tones), Writing (contractions, one time phrase, button labels in sentences), Icons and Foundations rules.
