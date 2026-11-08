---
'@lar-works/design-system': minor
---

Modal takes `dirty` (and optional `discardLabels`): while it holds unsaved changes, Escape, a click outside, the close button and `Modal.Cancel` / `useModalClose()` ask "Discard changes?" in ConfirmDialog's look before closing. ActionModal passes `dirty` through. New DesignSystemProvider labels `dialog.discardTitle`, `discardConsequence`, `discardConfirm` and `keepEditing`.
