---
'@lar-works/design-system': minor
---

The design system is platform-agnostic: it keeps the tokens and theme, foundations, generic components and patterns,
and the rules, and names no product. Product compositions move into each app's own UI layer (`src/ui`).

Removed (move the code into the app's `src/ui`, importing from `@lar-works/design-system`, `/primitives` and `/icons`):

- The `@lar-works/design-system/board` and `/board.css` entries: the board's compositions, button kinds, status
  colours, `KindBadge` and the board's sheets (role tokens, base styles, title bar, item parts, rows, and the board's
  loops pausing behind a dialog) now live in Lar Factory's `src/ui/board`. `--spacing-gutter-board` goes with them.
- The `@lar-works/design-system/showcase` and `/showcase.css` entries: the marketing sections, device frames, stage
  and server unit, with their tokens, now live in the website's `src/ui/showcase`.
- The media compositions (`Artwork`, `BookCover`, `DeviceCard`, `ImagePicker`, `PairingList`, `PeoplePreview`,
  `PhotoStage`, `RatingLink`, `RemedyList`), `ActivityCard`, `DetailHero`, `DeviceUsage`, `ImageCard`, `KindIcon`,
  `LibraryCard` and `ResourceCard`, and the media tokens (rating brands, book covers, the transparency stage) that
  `styles.css` imported: they now live in Lar Server's `src/ui`.
- The product concepts of `conceptIcons` (`metadata`, `checkUp`, `scans`, `catalogs`, `providers`, `people`,
  `remoteAccess`, `playback`, `projects`, `integrations`, `skills`, `stopped`, `noKind`). The shared glossary keeps
  `activity`, `diagnostics`, `updates`, `refresh`, `settings`, `users`, `logs`, `archive` and `search`; an app extends
  it with its own concepts (`{ ...conceptIcons, scans: ScanLineIcon }`).

New:

- `@lar-works/design-system/primitives`, for an app's UI layer only (lint keeps feature code off it): the styleable
  bases behind the components (`ButtonBase`, `BadgeBase`, `TextBase`, `HeadingBase`, `StackBase`, `InlineBase`,
  `InputBase`, `FormFieldsetBase`, `GlassBarBase`, `LinkBase`, `LinkBoxBase`, `LinkOverlayBase`,
  `StatusIndicatorBase`, `TooltipPopupBase`, `TooltipTriggerBase`, `ScrollFadeRegion`) and the hooks and recipes they
  share (`useScrollFade`, `scrollFadeClassName`, `useScrolled`, `useVisibleBounds`, `linkRecipe`, `softBreaks`,
  `SpinnerIcon`, `SplashView`).
- `Person` (avatar and name) is a generic display component; `ItemActionProps` is exported.
- `ScrollRow` takes a `placeholder`, the card skeleton its loading row repeats (a 16:9 skeleton without one).
- `iconConcept(element, glossary)` in `/testing` reads an app's extended glossary.

To move: import `@lar-works/design-system/styles.css` with `source(none)` in the app's CSS entry, then the UI layer's
own sheets, and `@source './ui'`. `styles.css` is the one stylesheet.
