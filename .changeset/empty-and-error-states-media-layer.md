---
'@lar-works/design-system': minor
---

One grammar for empty, not-found and failed states, a media layer, and fixes across components.

- New `EmptyState` and `PageError` (icon, title, description, `primaryAction`/`secondaryAction` or `actions`, `footer`;
  `size` hero · page · panel · inline; PageError adds `tone` and `code`). They replace `CollectionState` (removed) and
  `ResultEmpty` (removed).
- New `media/` category: `Artwork`, `DeviceCard`, `ImagePicker`, `PairingList`, `PeoplePreview`, `Person` and
  `RatingLink` move there (same public imports); rating brand colours are tokens (`media/tokens.css`, loaded by
  styles.css).
- `DetailHero`: a backdrop or title logo now sits on a dark stage in both themes so light logos stay readable; a failed
  logo falls back to the text title; under 40rem the cover sits beside the identity and `DetailHeroDetails` takes
  `moreLabel`/`lessLabel` to disclose details past the first two.
- `VirtualList` and `DataTable` take `density: 'default' | 'compact'`; the list's sort caret sits beside its label.
- `ProgressStatusRow`: left-aligned text, no empty track while idle, one-line detail and issue when `compact`.
- `DeskSection`: scroll arrows (`backLabel`/`forwardLabel`) when its cards overflow; `ScrollRowArrows` takes `compact`
  and `useScrollRow` is generic.
- `SiteHeader`: the mobile menu carries the page's actions, closes on Escape (focus returns to its button) and on a
  press outside.
- `ButtonLink` compact links honour `onNavigate`.
- `TimeSeriesChart`: keyboard reading of samples with a live readout, optional `timeLabel` (a hidden readings table)
  and `keyboardHint`, and dashed/square host vs solid/round lar series.
- `Screenshot` shows a tinted placeholder until it decodes.
- `ResourceCard` `presentation="scan"` is renamed `presentation="row"`.
- `Button`, `Badge` and `Alert` no longer accept `className` in their public props.
