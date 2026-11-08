---
'@lar-works/design-system': minor
---

New `TitleBarSettingsButton` (`label`, `onOpen`, optional `description`): Settings in a title bar, the bar's 28px
icon button with a 16px gear, the same in lar-server and Lar Factory (the board's `OpenSettingsButton` now renders
it). `TitleBar` spaces every tool at its end by one 8px step (4px on a phone) and `ToolbarStatusGroup` drops its own
inline padding, so Settings sits in the bar's group of tools; the board's title bar no longer sets it apart with a
divider.
