---
'@lar-works/design-system': minor
---

TimeSeriesChart reads its scale off the plot like an axis: the top value on the top gridline and zero on a firmer baseline, in a column beside the plot, rather than a value floating above it. Its screen-reader readings table now hides inside a visually hidden block, since a table ignores sr-only's box: the page no longer scrolls past the chart into blank space.
