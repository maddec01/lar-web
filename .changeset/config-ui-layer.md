---
'@lar-works/config': minor
---

`lint({ apps })` treats each app's `src/ui` as its UI layer, where the app composes its own product components from the
design system:

- `lar/no-visual-recipes` is off in `src/ui`.
- `lar/boundaries` has a `ui` role there: it may import the design system (`/primitives` included), its icons, React,
  other ui files and type-only shared modules, never app state, routing, services or features. Outside `src/ui`, code
  may not import `@lar-works/design-system/primitives`, and services may not import `src/ui`.
- `lar/no-raw-colours` (new, on in `src/ui`): no hex, `rgb()` or `hsl()` colour in a class string or a style, such as
  `bg-[#0a0a0a]`; colour comes from the design system's tokens. Spacing and layout utilities are fine.
