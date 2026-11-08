---
'@lar-works/design-system': minor
---

Share the small details across the website, lar-server and Lar Factory. New `GlassBar` is the one header surface
(AppShell, SiteShell and BoardTitleBar sit on it; BoardShell's main area now scrolls so the board passes under the
glass). `StatusIndicator` is the website's glowing status light for every app: halo and glow per tone, new `accent`
tone, `pulse` (reduced-motion aware), `srLabel` and `overlay`; StatusLight, the toolbar health dots, IconButton's
notification, the Refreshed dot and the board's merge/checks/attention dots use it. `Badge` takes the website's
pill treatment (tone tint plus tone hairline, full radius) with `size: 'sm' | 'md'`; StatusPill, Announcement tags,
the palette trigger's token chips and the route label use it. BoardTitleBar no longer draws traffic-light stand-ins in
a browser; `pastLights` only insets the bar in the Mac app (`nativeWindow`).
