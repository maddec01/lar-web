---
'@lar-works/design-system': patch
---

Lists and tables no longer draw as boxed, ruled tables. VirtualList, RowList and a `card` ResultList sit unboxed on
the page with no lines between rows; a row that opens something takes a rounded fill under the pointer and with focus
inside, and its focus ring is rounded too. Their rows no longer end in a chevron. VirtualList keeps a quiet column
header that still sticks while scrolling. PropertySheet (and its Collapsible and Table) shows plain label/value rows
under its title with no panel or rules, each value left-aligned right after a fixed label column (stacked under its
label on a phone). A list's section headers lose their rule, and DataTable drops its header line and row rules for
slightly roomier rows. These lists (and a page's ResultList, not a compact palette's) bleed by their rows' padding,
the new `row-inset` spacing, so row text lines up with section titles on the content edge and only the hover fill
reaches into the gutter. VirtualGrid takes `captionLines` (1, 2 or 3; 3 by default) so a grid of one-line cards, such
as artists, has no empty band between rows. ViewTabs loses its full-width rule and underline: tabs are quiet text with
a rounded hover, the chosen one a rounded pill like a segmented control's, and the first tab's label sits on the
content edge. ResultRow takes `status`, such as a StatusIndicator reading "Source missing", shown at the row's end;
the title truncates before it. A Card's media strip has a hairline under it only when the card is `divided`, so a
card with a cover shelf reads as one surface.
