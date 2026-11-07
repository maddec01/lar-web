---
'@lar-works/design-system': minor
---

The marketing showcase's styles move to `@lar-works/design-system/showcase.css`, so apps that import `styles.css` no
longer ship them (about 58 KB less CSS). A website that uses the showcase components imports `showcase.css` instead
of `styles.css`. `ActionModal`'s `children` is optional, for a confirmation with no body.
