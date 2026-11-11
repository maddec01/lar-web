---
'@lar-works/design-system': minor
---

One look for every Lar app, calibrated against T3 Code: a pure black page in dark (`#fafafa` in light, both pure grey)
with surfaces as alpha steps (panels bordered on black, cards a faint fill), one glass ladder (bar, menu, and two-zone
dialogs: an ink body with a glass sidebar and footer), subtler fields, a categorical palette, and the `current`,
`segment-chosen` and `attention-*` recipes. Density follows the surface, never the app: 28px and 32px controls share a
13px label, and radii are 6/8/12/16/20.

New: `Card`, `Panel`, `SettingsDialog` (search, links, dirty guard) with the draft save model (`useSettingsDraft`,
`SettingsFooter`), `SettingsGroup`, `SettingsPage`, `SettingsChildPane` and `SettingsSectionPane`, the settings parts
(`SettingsReason`, `SettingsNote`, `SettingsDetails`, `SettingsControl`, `SettingsValueList`), `AppearanceSetting`,
`ToolbarCounter`, `SegmentedProgress`, `ResultGroups`, `Alert presentation="inline"`, `EmptyState` hero and inline
scales with a product halo, and brand marks (`GoogleLogoIcon`, `AppleLogoIcon`). `TitleBar` takes a `product` lockup
and ordered `search`, `status`, `actions`, `settings` and `identity` slots; `AppShell` has a contained, desktop scroll;
`AuthLayout` and `SiteHeader` are product-aware; `ButtonLink` has an app `look` and the tinted variant. Notifications
use one presentation. `AsyncState` says "Still trying…" after three seconds. Also new: `TitleBarLabel` (an action's word
that folds last), `SettingsChildPane` `title` (a third breadcrumb; Escape goes Back), `SettingsRow` `controlWidth`,
`AuthLayout` `footer`, `Avatar` `hueKey` (one hue per person in every app) with `bar` and `lg` sizes,
`GoogleLogoIcon colour="brand"`, `ProgressStatusRow` `hideChevron`, `ButtonLink` `arrow` in the app look, `Modal.Content` `back` (a dialog that navigates
within itself goes back from an arrow before its title, as a settings child pane now does) and `TitleBar`
`statusPlacement` (status buttons at the end, beside search). Alerts
use the attention recipe at a lower strength, the third data series is magenta (orange read as a warning), and status
popovers stop at 40rem. `brand`, `secondaryActions` and the Notifications `presentation` are deprecated but still
accepted, as are `SettingsSection`, `FormRow` and `SettingsRow` `layout` (each now draws the one settings group or row).
