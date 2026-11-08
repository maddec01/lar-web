---
'@lar-works/design-system': minor
---

One scroll fade: `useScrollFade({ axis, row })` serves every scroller. `ScrollRow` and the board's `DeskSection` fade
their own edges where more cards lie beyond (`ScrollRow` no longer takes `canScrollBack`/`canScrollForward`;
`scrollEdgeFade` is removed), and `Breadcrumbs` and `DataTable` fade when they scroll sideways. A browser test measures
the computed mask of every overflowing scroller in every story; a scroller that is the page itself opts out with
`data-scroll-fade="exempt"`.
