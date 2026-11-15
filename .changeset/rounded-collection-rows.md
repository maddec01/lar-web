---
'@lar-works/design-system': patch
---

Lists and tables no longer draw as boxed, ruled tables. VirtualList, RowList and a `card` ResultList sit unboxed on
the page with no lines between rows; a row that opens something takes a rounded fill under the pointer and with focus
inside, and its focus ring is rounded too. Their rows no longer end in a chevron. VirtualList keeps a quiet column
header that still sticks while scrolling. PropertySheet (and its Collapsible and Table) shows plain label/value rows
under its title with no panel or rules, a list's section headers lose their rule, and DataTable drops its header line
and row rules for slightly roomier rows.
