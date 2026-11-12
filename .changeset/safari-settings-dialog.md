---
'@lar-works/design-system': patch
---

Settings dialog and menu fixes, mostly for Safari:

- The settings dialog's reading zone no longer shows vertical stripes in Safari: its tint is one colour sized to the
  zone, not a hard-stop gradient (which Safari dithers over the blurred page).
- A switch that is on no longer flashes off when the pointer enters its row in Safari: the thumb moves by a plain
  `translate` instead of Tailwind's translate variables, whose transition Safari restarted from 0 on every restyle.
- Menu rows and select options show a visible highlight in dark (white 10%; black 6% in light), where ninna-ui's
  accent fill was darker than the menu glass.
- A `paned` dialog (settings) grows from 896×704 to 1024×768 on a window from 1280px.
