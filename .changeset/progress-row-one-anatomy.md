---
'@lar-works/design-system': minor
---

ProgressStatusRow has one calm anatomy everywhere: the light in its own column, the label (with any action at its end), one meta line "Task · State · numbers" with the percent at its end, then the bar or the reason, each one line. Meta and bar run under the action to the row's end. New `layout="line"` for a card's one-line summary (with the bar's room kept) and `children` for content under the row, such as a failure's explanation. With `onDetails` the whole row opens the details, named by what it shows.
