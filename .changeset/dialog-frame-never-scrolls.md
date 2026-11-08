---
'@lar-works/design-system': minor
---

A dialog's frame never scrolls: `Modal.Content` (and `Drawer`, `DropdownMenu`) clip instead of hiding overflow, so no
`scrollIntoView` or focus inside can scroll the frame, and `Modal.Body`, `Drawer.Body`, popover and menu scrollers and
`ScrollFadeRegion` contain their absolutely positioned descendants (screen-reader text, hidden inputs). A long settings
pane with an opened disclosure or a revealed status keeps its title, close button, search, sidebar and footer in view;
only the body scrolls. Story `Overlays/Modal › LongPaneWithOpenedDisclosure`, with a browser test.
