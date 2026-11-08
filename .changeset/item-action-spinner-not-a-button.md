---
'@lar-works/design-system': minor
---

`ItemAction` with no action to press (only `loading`, such as Artwork's loading indicator) renders a plain spinner,
not a held `<button>`, so artwork still loading inside a button (an `ArtworkTabs` season tab, a clickable card) no
longer nests a button in a button. With an action it stays the pencil button, showing the spinner while it runs.
Stories: `ItemAction/LoadingWithoutAction`, `ArtworkTabs/PostersLoading`.
