---
'@lar-works/design-system': minor
---

- `ConfirmDialog`'s confirm button wraps a long label instead of clipping it on a narrow screen.
- `Button`'s `wrap` keeps the button's own height as its minimum (36px, 32px with a pointer; 28px when `compact`), so a wrapping button with a short label looks like any other.
- `KindMarker` is named as an image (`role="img"`), so its label is valid on the focusable icon.
