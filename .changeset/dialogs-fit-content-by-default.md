---
'@lar-works/design-system': minor
---

Every dialog takes its content's height up to the window by default, workspace dialogs included. Two hold one height so they never jump: a paned dialog with tabs and a dialog whose body fills it (`Modal.Body layout="fill"`). `fitsContent` is now tri-state: `true` fits even then, `false` holds the height for any dialog.
