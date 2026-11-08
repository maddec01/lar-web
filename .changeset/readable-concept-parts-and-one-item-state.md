---
'@lar-works/design-system': minor
---

Board parts, rows and pull requests read the same everywhere:

- `PartRow` takes `usage`, the part's figures on their own line under its status, so only the action sits beside it. A
  part's name and status keep at least 12rem, and the action moves under them when the part is narrower. `PartsList`
  lays parts out in as many columns as give each part 32rem, by the part's own width rather than the window's.
- `PartName` draws status, then source, then title.
- `PartsProgress` takes a `note` beside its count, such as why some parts aren't on the board. `DetailsSection`'s
  `heading` is optional, for a section whose content the line above already names.
- `WorkflowSteps` takes `waiting`: a step that hasn't begun draws as an empty track outlined in its colour, never a
  half-filled one.
- Running checks are blue (the `active` state) in `ChecksState` and `DeskMergeState`, as the board's rows draw them;
  checking mergeability is blue too.
- `PullRequestRow` takes `details`, such as a Checks disclosure, inside the card's foot.
- A slice that runs reads "Working", the board's word for work at work, and an unfolded slice's state sits in its
  row's state column. A row's state column is 11rem, so "Blocked · starts after #202" stays on one line, and truncates
  with its tooltip in a narrow row.
- A counter panel's titles wrap to two lines instead of cutting off, in a 28rem panel.
- `RichText` names a link that stands in for an image "Image: " and its alt text, so it never reads as a stray link.
