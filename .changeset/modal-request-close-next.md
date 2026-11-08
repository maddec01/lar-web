---
'@lar-works/design-system': minor
---

`Modal`: `useModalClose()` returns the guarded `requestClose(next?)` (type `ModalRequestClose`). On a `dirty` dialog it asks the one "Discard changes?" question and on Discard runs `next` (such as opening another dialog in its place) or, without one, `onClose`; a clean dialog goes on at once. Apps no longer need a discard dialog of their own.
