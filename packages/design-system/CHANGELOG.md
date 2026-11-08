# @lar-works/design-system

## 0.5.0

### Minor Changes

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Every notice is an Alert with one recipe per tone: the tone's quiet surface, its hairline and its icon, the words in the primary text colour, at either size. ConfirmDialog's reassurance note is an info Alert.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Make the design system hard to misuse:
  
  - `Alert`: a `title` alone renders as the regular-weight message (never a bold sentence); inside modals, forms, panes and panels alerts are `compact`.
  - Scroll fade everywhere the design system scrolls: `Popover.Content layout="scroll"` and `DropdownMenu.Content` scroll in an inner fading region (the glass box never fades), plus counter lists, `Drawer.Body`, `LabelPicker`, update notes, warnings and setup cards. A test fails on any unfaded scroller.
  - `conceptIcons` gains `stopped` and `noKind`; `iconConcept(element)` in `@lar-works/design-system/testing` names the concept a rendered icon draws, for apps' toolbar and empty-state tests.
  - `StatusGlyph` draws the Stopped glyph for stopped work (`state="off"` on a status whose own state isn't off) and sits in a fixed box; new `StatusGlyphSlot` boxes a status light that stands in for a glyph.
  - `AppSplash`/`LoadingScreen`: one status-line rule (always ends in an ellipsis, `splashStatusText`) and the indeterminate track by default, dropped while leaving.
  - `DropdownMenu.ControlRow` keeps the entries' 12px inset for a row with a trailing control; menu icon rule documented.
  - `StatusRow` trailing controls no longer grow the row; `HelpTip` opens above its trigger (`side` prop); `PopoverHeader` wraps instead of truncating, moving a status that doesn't fit under the title.
  - `Drawer` opens focused on the drawer itself when it has no field.
  - Docs: Introduction (EmptyState `compact`, PageError tones), Writing (contractions, one time phrase, button labels in sentences), Icons and Foundations rules.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add `RemedyList` and `RemedyRow` to the media layer: the ways to resolve one issue, each a row with its description and one action aligned at the end, for use inside `NoticeCard`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `AttentionList` is redesigned: a card whose header band is tinted in the worst problem's tone (an icon tile, the title,
  a tinted count pill and a new optional header `action`), then one row per problem on the card surface, its action at
  the row's end (under the text on a narrow card). New `collapsible` folds the rows under the header, and
  `AttentionList.Item` takes `onDismiss`/`dismissLabel` and `data-*` attributes. Use it for one problem or many. Lar
  Factory's `BoardWarnings` is now this list (new `leadTitle` and required `toggleLabel`; `summary` is a string) and
  `BoardWarning` an `AttentionList.Item` with an optional `tone`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Align board draft field gutters, keep kind disagreements compact with a tooltip, and use sentence case for check states. Preserve explicit paned forms and bound long draft descriptions so their fields and footer remain reachable. Add a wide, capped menu policy for model/account choices.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Make board merge assurance reflect structured check counts before mergeability, distinguish waiting slice segments, consolidate dialog summary facts, document primary stage actions, and adopt shared popover headers. Preserve accessible consequence descriptions in confirmation dialogs.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Rename board AttentionList to BoardAttentionList to distinguish it from the shared feedback component. Add independent BoardCounter header counts. Centre section icons, deepen the desk carousel fade, inset map source glyphs and slice bars, align ticket search controls, and centre Board stories at realistic widths. Tracker LabelChip surfaces and text are neutral with a colour dot.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Top-align Board attention labels and omit the status dot for open questions. Keep the ticket-search footer at the bottom of a held-height dialog. Show editing and failed-save actions as separate stories, and protect Board story frames and Add item tab height with browser tests.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Align slice rows and chips with the board's status-first order, clarify workflow stage ordinals, and allow secondary status context in a tooltip.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Allow board status text to wrap without truncation and keep project icon fallbacks visible until an avatar loads. Share slice labels between rows and chips, hide provisional desk counts while loading, and add examples for current PR evidence and loading.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Keep workflow segments equal in width, including queued work, with the stage label above the track. Render image links in rich text as attachment rows with a paperclip and a named link, without loading remote images.
  
  Add an OptionSelect badge presentation for editable kinds in item summaries.
  
  Allow named public component sizes in app compositions while keeping typography and raw styling in the design system.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - CollectionBrowseSelector and CollectionBrowseTrigger take `presentation="inline"`: a ghost for a choice on the page itself, such as a search's scope, with no fill, its text on the gutter and a turning chevron.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Clarify board item hierarchy with inline warning actions, calm dependency holds, aligned row metadata, and shared disclosure chevrons.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - One scroll fade: `useScrollFade({ axis, row })` serves every scroller. `ScrollRow` and the board's `DeskSection` fade
  their own edges where more cards lie beyond (`ScrollRow` no longer takes `canScrollBack`/`canScrollForward`;
  `scrollEdgeFade` is removed), and `Breadcrumbs` and `DataTable` fade when they scroll sideways. A browser test measures
  the computed mask of every overflowing scroller in every story; a scroller that is the page itself opts out with
  `data-scroll-fade="exempt"`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Cards get more depth, as the website's: new `surface-card` utility with the tokens `--color-surface-card`,
  `--color-line-card` (a half step deeper than `line` in light, a step lighter in dark), `--shadow-card` (a hairline drop
  and a soft lift in light, a lit top edge in dark) and a faint top sheen in dark. ResourceCard, InsetPanel,
  ActivityCard, RowList, StatTile, TimeSeriesChart, the board's stage panes and desk cards use it; ResourceCard's
  overview card puts its icon in a tile and its status in a sunken footer.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ChangeList changes take `kind`: `text` (the default) shows people's words in the reading font, `code` keeps a machine's values (paths, ids) on code chips.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Explain additional concept summary chips on hover and keyboard focus, with the full summary available to assistive technology.
  
  Keep inline ticket references flush with surrounding punctuation.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Confirmation-size dialogs (`Modal.Content presentation="confirm"`, `ConfirmDialog`, the "Discard changes?" question) have no close button and open with the focus on the footer's first button, the safe answer (Cancel, Keep editing); Escape still gives that answer.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - - `ConfirmDialog`'s confirm button wraps a long label instead of clipping it on a narrow screen.
  - `Button`'s `wrap` keeps the button's own height as its minimum (36px, 32px with a pointer; 28px when `compact`), so a wrapping button with a short label looks like any other.
  - `KindMarker` is named as an image (`role="img"`), so its label is valid on the focusable icon.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Unify counts across headings, selectors and tabs, suppress loading counts, and add SettingsSection with a heading action slot. Add Modal sidebarSections for single-section plain dialogs and ImagePickerOption kind/year for readable media matches. Align inline empty states and state action sizes, use quiet destructive icon controls, tighten adjacent form fields, adopt elevation roles with a guard, and split large board/form compositions without changing their public exports.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - DateField reports its draft through `onDraftChange` (`DateFieldDraft`: text, parsed value, validity and a message once the reader leaves an invalid draft), so forms can hold submit and show the message as the Field's `errorText`. Enter on an invalid draft marks it invalid too.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `DateField` shows the long date at rest ("January 10, 2021", "January 2021", "2021") and the numeric editing text while focused. New `formatDateLong(value, locale?)` formats a partial ISO date the same way for pages.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `DetailHero` REMOVES `artworkSize`: the art column is always the same, so a work with no image of its own shows its
  placeholder in its type's frame (a 2:3 poster for a film, a square for an album) instead of a small square tile, and
  the page keeps one layout with or without art.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `DetailHero`: a `titleLogoSrc` is sized by its visible lettering (transparent margins are measured and trimmed), up to 5rem tall and 24rem wide, so the label, title and facts sit together. A logo so wide its lettering would be smaller than the heading shows the text title instead.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - DetailHero takes `synopsis`, set at a reading measure of about 70 characters a line; text passed straight into its content column keeps the same measure.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add `BookCover` (a book's cover, or a drawn cover with its title and author on a seeded cloth tone) and `PhotoStage` (a photo detail page's opening: the photo whole, at its own shape, selectable to view larger) to the media layer, with `Artwork aspect="fill"` for a frame already sized by its parent. `ImageCard` titles now take up to two lines, with the full title on hover, and `VirtualGrid` rows grow to their tallest card.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - New DeviceUsage: how much of a device's capacity is in use and by what (a figure with the room left, one stacked meter with a limit marker, and the work using it keyed to its series). StackedMeter gains `size` (sm/md) and a marker that stands past the bar; DeviceCard uses the page's card surface.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Dialog and drawer bodies (Modal.Body, Drawer.Body, a paned dialog's content) fade 3rem under their header once scrolled, like their bottom edge, so content scrolled under a header no longer reads as sliced.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Modal and Drawer bodies dissolve their last row over 3rem at the bottom edge (`useScrollFade({ body: true })`, `scrollFadeBodyClassName`), so a long body no longer ends in a row sliced by the frame.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Focus read-only dialog content on opening, preserving editable-field and safe confirmation focus.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - A dialog's frame never scrolls: `Modal.Content` (and `Drawer`, `DropdownMenu`) clip instead of hiding overflow, so no
  `scrollIntoView` or focus inside can scroll the frame, and `Modal.Body`, `Drawer.Body`, popover and menu scrollers and
  `ScrollFadeRegion` contain their absolutely positioned descendants (screen-reader text, hidden inputs). A long settings
  pane with an opened disclosure or a revealed status keeps its title, close button, search, sidebar and footer in view;
  only the body scrolls. Story `Overlays/Modal › LongPaneWithOpenedDisclosure`, with a browser test.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Every dialog takes its content's height up to the window by default, workspace dialogs included. Two hold one height so they never jump: a paned dialog with tabs and a dialog whose body fills it (`Modal.Body layout="fill"`). `fitsContent` is now tri-state: `true` fits even then, `false` holds the height for any dialog.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `Disclosure`: the `group` and `framed` presentations lead their summary with the same turning chevron as `note` and `section`, never the browser's own marker.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Docs: Foundations and Writing now state the status-word rule (neutral state words beside a coloured light) and the quiet-destructive rule (danger text at rest) as the Introduction does; the Introduction documents confirmation focus and `DropdownMenu.Status`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - One grammar for empty, not-found and failed states, a media layer, and fixes across components.
  
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

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - EmptyState and PageError take `size="start"`: an app's first run owning its page on the app's scale (a page title, regular buttons, room for a step list under them); `hero` stays the website's scale.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Allow board agent rows to show their activity state, with the attention mark for threads waiting for an answer.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Make Lar Factory's item dialog and build limit read plainly. `OptionSelect` gains `presentation="inline"`, a value
  in a row of facts that edits in place (no field edge, hover fill). `DetailFact` in the meta area sets its label over
  its value, and `MetaArea` lays the facts out as one row. `CounterOfLimit` takes `used` and draws the count with small
  `LimitBars` instead of a fraction ("4/2"); `LimitBars` takes a `size` and its words as `children`
  ("4 running · limit 2"). `KindMarker` says what the ticket says in words, without its arrows glyph or `label`.
  `RowStateCell` wraps what follows the state under it instead of cutting it off.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add the `fg-lead` semantic colour (muted long-form text, a step lighter in dark) as Typography's `lead` tone, which
  muted leads and prose now use, and the `brand-mark` colour for the mark's navy square; components no longer hard-code
  colours, and a test keeps it that way.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - A Field's error message under its invalid control is in the danger text colour, pairing with the control's danger edge; help stays muted.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Allow property sheet rows to emphasize item names, with supporting values kept quiet.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `FormField`: labels top their control (offset to its first line) in every row, and an empty `action` keeps no column. FormFields placed directly in a `FormStack` (a dialog's editor) are flush with the dialog's text, full width, one 20px gap apart; inside a FormSection or settings InsetPanel they keep the panel's padding.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - FormUnit passes on what a Field gives its control (the label's id, the error it is described by, invalid, required, disabled) to the field inside it, so a unit never unwires the label or the error.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Foundations documents what a progress row wraps and what stays on one line, adds surface-card, line-card and --shadow-card specimens with the card versus raised elevation rule, and the rule that an action under prose is an outlined button. Writing allows one turned-off exception, "Turned off · Last scanned {time}", and ImageCard's maker row stays empty for an unknown maker on every card.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ImageCard: one caption anatomy for every catalog tile — fixed one-line rows (title, then `subtitle`, then a `meta`
  line whose facts share it with a `quality` badge), so every card of a grid ends at the same height. New `meta`,
  `quality`, `status` (a passing state such as "Updating details…" takes the meta line's place), `rows` (rows a grid's
  cards all keep, empty or not) and `selected`; `detail` and `titleDetail` are gone (use `meta`). Titles keep one line,
  in full on hover and to screen readers; pointing at a card veils its art. Loading cards draw `textRows` rows of the
  same height, and VirtualGrid's row estimate matches. Exports type `ImageCardRow`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - One caption contract for every catalog grid: `ImageCard` always draws three one-line rows — the title, the maker
  (`subtitle`) and the meta row (`meta`, then the `quality` badge, or a `status` in their place) — empty when the item
  has nothing for one, so every grid's cards end at the same height. NEW `noMaker` for kinds that never have a maker
  (photos, photo albums, artists): the meta row follows the title and the reserved row comes last. `presentation="person"`
  keeps a name and a role. REMOVED `rows` and the `ImageCardRow` type, and the loading card's `textRows` (it always
  draws the three rows). `VirtualGrid` REMOVES `textRows`: its row estimate counts the three rows. `ScrollRow`'s loading
  row uses ImageCard's loading card, so its placeholders match the cards that replace them.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ImagePicker marks the chosen image in its caption beside the name, never over the artwork.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ImagePickerHeader keeps one toolbar row that never wraps under its title: the ways to add an image, then a ⋯ menu
  (`actionsLabel`) holding "Use automatic" and "Remove"; Undo moves to the end of the staged-change line. Option captions
  stay on one line.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `ItemAction` with no action to press (only `loading`, such as Artwork's loading indicator) renders a plain spinner,
  not a held `<button>`, so artwork still loading inside a button (an `ArtworkTabs` season tab, a clickable card) no
  longer nests a button in a button. With an action it stays the pencil button, showing the spinner while it runs.
  Stories: `ItemAction/LoadingWithoutAction`, `ArtworkTabs/PostersLoading`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - LibraryCard's shelf always has the same slots (five square covers, six posters): the ones its covers don't fill are blank covers, so a part-filled library reads as the start of a shelf and an empty one as waiting.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - New LibraryCard (and LibraryCardSkeleton): a media library on an overview, with a shelf of its newest covers or posters (blank covers with its kind's icon when empty), its name as a card-wide link, what it holds in one line and its state in one line, so every card in a grid has the same anatomy and height.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Link takes tone="default": body text whose underline shows only on hover, for a cluster that reads as one fact. RatingLink uses it, so a rating's mark, score and scale read as one link.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add a dedicated People concept icon for media contributors, distinct from account access and permissions. The icon glossary story includes the new concept.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - New `DropdownMenu.Status` (light, state word, optional detail) heads a menu whose subject is in a state worth knowing, instead of a disabled entry, and describes the menu to screen readers. Menus and popovers keep the app's 16px gutter from the window's edges (was 8px).

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - StackedMeter, MeterLegend, LegendSwatch and DeviceUsage colour a data series by `series: 1 | 2 | 3` (type `MeterSeries`, replacing `MeterTone` and the `tone` field), from the new `series-1` to `series-3` tokens: navy, teal and orange, validated apart for every colour vision and 3:1 on a card in both themes. Status hues no longer name a series.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Modal takes `dirty` (and optional `discardLabels`): while it holds unsaved changes, Escape, a click outside, the close button and `Modal.Cancel` / `useModalClose()` ask "Discard changes?" in ConfirmDialog's look before closing. ActionModal passes `dirty` through. New DesignSystemProvider labels `dialog.discardTitle`, `discardConsequence`, `discardConfirm` and `keepEditing`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `Modal.Content fitsContent` takes its content's height from 40rem only; on a phone a paned dialog stays the full-height sheet, so every editor and review step has one mobile presentation.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `Modal`: `useModalClose()` returns the guarded `requestClose(next?)` (type `ModalRequestClose`). On a `dirty` dialog it asks the one "Discard changes?" question and on Discard runs `next` (such as opening another dialog in its place) or, without one, `onClose`; a clean dialog goes on at once. Apps no longer need a discard dialog of their own.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `Alert` ignores an empty `action` (null, false or an empty list) instead of leaving an empty action row. `NeedsYouNotice`'s `actions` are optional. `buttonKind('other', 'danger')` is the board's quiet-destructive trigger (`destructive-quiet`), as a notice's Abandon; the NeedsYou stories show it with its confirmation and a notice without actions.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Status words are neutral text beside their coloured dot everywhere: StatusIndicator labels no longer take the tone colour, and the board's DeskCard status word and DeskMergeState are neutral.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Notifications (toasts) and AttentionList follow Alert's rule: a neutral body, the tone only on the icon and the edge.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `NoticeCard`'s description and `RemedyRow`'s description are set at a reading measure (about 75 characters a line,
  `text-pretty`), so a long explanation never runs the width of a wide page; a remedy's action stays at the row's end.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Image pickers have one toolbar style: Undo, Use automatic and Remove are secondary buttons like Upload an image (which
  now shows an upload icon), so the toolbar no longer mixes ghost and outlined buttons.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - One prop vocabulary, checked at the type level (`foundations/propVocabulary.test.ts`): `tone` is a status colour
  (StatusTone or `accent`; the text components add muted/lead/soft), a look is a `variant`, a scale is `size` on one
  `xs`–`xl` ladder, and `presentation` never sizes. Renames (no aliases):
  
  - `ConfirmDialog tone="danger" | "primary"` → `intent="destructive" | "default"`.
  - `PageSection tone="plain" | "raised"` → `variant`; `SectionHeading size="display" | "headline"` → `variant`.
  - `FormResult tone="error"` → `tone="danger"`; `DetailsText tone="muted" | "error"` → `"neutral" | "danger"`.
  - `MeterTone` (`StackedMeter`, `LegendSwatch`) `'primary'` → `'accent'`.
  - `BrowserFrame tone="dark"` → `scheme="dark"`; `MapPartNode tone="asks" | "waits"` → `attention`.
  - `StatusGlyph`/`StatusGlyphSlot` `presentation="compact" | "default" | "title"` → `size="sm" | "md" | "lg"`.
  - `ProjectIcon size="small" | "row" | "medium"` → `size="sm" | "md" | "lg"`.
  - `ResultList density="comfortable"` → `density="default"`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `CommandPaletteTrigger` has one look in every app, with or without `tokens`: a 28px field with a 16px magnifier, the
  14px muted word and the ⌘K hint, folding to the title bar's 28px icon button. lar-server's field and Lar Factory's
  token field no longer differ in icon size or font; the field also folds by the title bar's measured width.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `glass-menu` (menus, popovers, selects, tooltips, toasts) is nearly opaque (`--lar-menu-opacity`, 94%) under the shared glass blur, so artwork behind a menu never reads through its rows.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `PageLayout`: new `actions` slot at the end of the title row for a page's quiet controls, such as a "Technical details" icon button.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Complete the semantic colour chain with fixed palette primitives, preserving both themes. Add aligned settings action
  rows and row-shaped loading states, unify destructive triggers as neutral until hover or focus, and add Link's arrow
  affordance for navigation instructions. Document shared writing, spelling, chart units and vocabulary decisions.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - The design system is platform-agnostic: it keeps the tokens and theme, foundations, generic components and patterns,
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

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Export `problemBodyViolations` from `@lar-works/design-system/testing`, so apps run the problem-body rule (neutral explanatory text, tone on icons, edges and status labels) on their own sources.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ProgressStatusRow's card summary (layout="line") keeps its numbers whole: the label, task, status and reason give way first, down to a few letters, while the count and the percent stay at the line's end. The list (stacked) layout is unchanged.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `ProgressStatusRow` has one row anatomy: the name line with any action (`trailing`) at its end, on the name's line;
  one meta line under it from the text's start, with the percent alone at its end; the bar from the text's start to the
  row's end; then the reason and last line. New `StatusPopoverSection` (`title`, `count`) groups a status popover's rows
  under a small heading, each row ruled from the next, as lar-server's Background tasks.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ProgressStatusRow has one calm anatomy everywhere: the light in its own column, the label (with any action at its end), one meta line "Task · State · numbers" with the percent at its end, then the bar or the reason, each one line. Meta and bar run under the action to the row's end. New `layout="line"` for a card's one-line summary (with the bar's room kept) and `children` for content under the row, such as a failure's explanation. With `onDetails` the whole row opens the details, named by what it shows.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Tighten the public API and the foundations.
  
  - Public component props no longer accept `className`, `style` or ninna-ui's look props (`size`, `color`, `variant`,
    `radius`…) where the component owns its look: IconButton, Input (now `presentation` only), Switch and the rest of the
    exported components (overlay compounds, Stack/Inline/Grid, Tooltip parts…); the design system's own compositions use
    the internal `…Base` exports, and `foundations/publicApi.test.ts` fails the type check on a leak. The raw `Box` and
    `Divider` re-exports are removed. Every public prop has a one-line description in the Storybook props table.
  - `KindBadge` (new): a badge in a kind's lar-brand hue (an item's bug or feature, a catalog's music). `Badge` no longer
    takes `hue`.
  - `Switch`: `busy` now blocks the toggle itself (pointer, label, Space and Enter), not just the callback, keeps the
    focus and sets `aria-busy`. Its props are explicit: `size`, `variant`, `thumbIcon`, `trackLabels` and `description`
    are gone.
  - `TimeSeriesChart`: `formatTime` formats sample times in the app's locale (default: the browser's, to the second).
  - Elevation: `--shadow-highlight`, `--shadow-pressed` and `--shadow-logo` join the shadow roles; the sign-in card uses
    `--shadow-dialog`; `scales.test.ts` fails on a shadow mixed in a class.
  - StatusIndicator's halo is the foundations' `status-halo` / `status-halo-overlay` / `status-cutout` utilities; the
    status light breathes on `--motion-loop-breath`.
  - Native controls take the primary `accent-color`; no WebKit tap flash.
  - Storybook: GitHub-flavoured Markdown in the docs pages (tables render), and controls are disabled for object or array
    props holding functions or React nodes.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Allow stable keys on property rows with repeated labels, such as multipart media files.
  
  Show breadcrumb chevrons only between items, avoiding a trailing separator.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Document tinted board starts as launches of agent work, including their model/options split half, and quiet icon controls as the thread affordance in concept parts lists. Show accessible quiet thread icons in the parts stories.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - One documented quiet-destructive rule: `Button variant="destructive-quiet"` (the destructive ghost), `IconButton tone="danger"` and destructive menu items are named in the danger text colour at rest and gain the danger surface on hover or focus; only the confirm button is solid red.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Quieter, single-height board rows and a dialog that states each fact once: desk cards keep a neutral border (the status
  glyph and word carry the colour), `RowSide` takes `figures` beside its action so a row with nothing else to add keeps one
  height (the side column widens to 13rem), `SliceChip` takes `href` to open its ticket, every item dialog section heading
  (description, comments, working agents, sidebar lists) shares the sentence-case `label` style, attention labels are
  sentence case beside their tone dot, and emoji project icons are sized like line icons. `OpenSettingsButton` draws its
  icon again under icon-only Buttons. `BoardCounter`, `RefreshIndicator`, `BoardTitleBar`, `EarlierThread` and
  `EditorSlot` expose `data-*` hooks (`data-fold`, `data-width`, `data-counter-head|list|foot`, `data-health`,
  `data-past-lights`, `data-thread-name|state`, `data-editor-slot`) so app tests can read state without depending on
  classes; the counter geometry moves into the design system's own test.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - The artwork transparency stage is a quiet mid grey with a checker one shade apart, so it no longer competes with white or black title lettering.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add a shared 75ch reading measure for RichText paragraphs and lists and supporting Text (`measure="reading"`). Keep technical content wide, give board metadata notices their own full-width slot, document ticket search guidance, and use neutral demo triggers in stories.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Board parts, rows and pull requests read the same everywhere:
  
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
    row's state column. A row's state column is 11rem, so "Blocked · starts after [#202](https://github.com/maddec01/lar-web/issues/202)" stays on one line, and truncates
    with its tooltip in a narrow row.
  - A counter panel's titles wrap to two lines instead of cutting off, in a 28rem panel.
  - `RichText` names a link that stands in for an image "Image: " and its alt text, so it never reads as a stray link.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Frame mobile Factory close-ups at a consistent UI scale, keep slice statuses clear of edge fades, and show tracker identity alongside the real Add item action. App-window bezels now follow the theme, and mobile site navigation gives the current page a selected surface.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add locale-aware partial DateField inputs, sentence-only Alerts with compact overlay defaults, and shared UI copy checking through @lar-works/config/copy. Keep problem bodies neutral, stage transparent logos consistently, protect hero contrast and mobile titles, honour textarea rows, and remove empty resource status bands. Align overview card footers with shared grid rows and publish the inverse status/progress mapping plus StatusSummary stories.
  
  Keep selected tabs visible with responsive edge fades, standardise form actions, and expose a clear-search recovery action in browse selectors.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Keep product previews readable with fixed detail crops and guides below screenshots. Separate mobile site navigation from the page and offer visible theme-choice labels.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Allow compact progress summaries to wrap to two lines and connection detail lists to display complete, copyable addresses.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add real Chromium accessibility coverage of every story in both themes, including colour contrast. Make Storybook docs follow the theme and suppress serialized node/function controls. Hold busy actions without losing focus, unify section headings and numeric counts, tighten detail headers, align browse controls, omit empty card footers, move chart maxima above plots, and name shell gutter tokens. Add a showcase skin for shared page error states and close the website menu after action links.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ResourceCard (default) is a container: its status sits beside the details from 36rem in a column of at most half the card, its children clamped so a long status truncates or wraps instead of painting over the details, and below 36rem it takes its own line under the details, from their text's start. The footer's trailing controls keep to the end when they wrap.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add ResultList choice presentation and ResultChoice radio rows with optional supporting details, for one match picker anatomy.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ResultList takes `presentation="card"`: a library's list on one card, a hairline between rows and a chevron on every row that opens a page.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - SectionTitle is public, with size="sm" for a part inside a section (a label-sized heading with the same action slot, so a quiet action sits flush with the edge).

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - New SegmentedControl: two to four short choices side by side in a field's height, the chosen one raised, as a radio group (arrow keys move and choose). Use it wherever buttons would act as a choice.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - A Select's list shows eight rows at most and scrolls the rest, so a long list fits below its trigger in a dialog instead of rising over the dialog's title and close button.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Align scrolled select menus with whole option rows below their scroll controls.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - One token architecture. `foundations/theme.css` adds a semantic layer over the primitives, light and dark, and every
  generic component uses it: surfaces (`surface-page`, `surface-raised`, `surface-sunken`, `surface-overlay`,
  `fill-hover`, `track`), text (`fg`, `fg-soft`, `fg-muted`, `fg-inverse`), edges (`line`, `line-strong`, `focus`), brand
  (`primary-fg`, `primary-surface`) and each status's `-fill`, `-on-fill`, `-fg` and `-surface`, all checked for WCAG AA
  contrast. Status text now uses the `-fg` tokens and the destructive button an AA fill. The board's duplicate vocabulary
  (`--foreground`, `--muted-foreground`, `--card`, `--soft`, `--primary`, `--ring`…) and `--lar-*-text` are gone: board.css
  keeps only the board's own roles (`--you`, `--thread`, `--sub`, `--build`, `--st-*`). The showcase's device, glow and
  grid tokens move to `showcase.css`.
  
  Scales: named type steps (`text-3xs`, `text-ui`, `text-md`, `text-title`, `text-headline`, `text-display`), named
  container breakpoints (`@pane`, `@split`), `max-w-page`, elevation (`--shadow-raised`, `--shadow-popup`,
  `--shadow-dialog`, replacing `--lar-shadow-*`) and motion tokens (`--motion-duration-*`, `--motion-loop-*`,
  `ease-standard`, `ease-emphasized`) with a reduced-motion policy. One focus ring (`focus-ring`, `focus-ring-inset`,
  `focus-ring-within`, `focus-ring-stretched`, `focus-field`), on every element by default, replacing the board's own.
  The Switch owns its states (an off track at 3:1, a disabled one clearly fainter), checkboxes and radios take a 3:1
  edge, and a Markdown task list's checkboxes are named by their item.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Components now speak only the semantic colour layer, and a guard test keeps it that way: no base-ramp primitive, no
  per-component `dark:` colour override and no in-place `color-mix()` outside the foundations.
  
  - New semantic tokens, light and dark, contrast-tested: `surface-control`, `surface-glass`, `fill-selected`,
    `fill-muted`, `fill-muted-hover`, `line-hover`, `line-control`, `line-strong-hover`, `primary-surface-hover` and
    `danger-fill-hover`. The dark success and warning surfaces are a step deeper, so muted text reads on them.
  - Text fields, selects and textareas have a 3:1 edge (`line-strong`) on a `surface-control` fill in both themes, a
    deeper edge on hover, and fade when disabled.
  - **Breaking:** the board's compositions moved to `@lar-works/design-system/board` and the showcase's to
    `@lar-works/design-system/showcase`; the root entry keeps the generic layers and `media`. The board's roles are
    renamed to Tailwind colours (`--you`/`--st-amber` → `--color-board-you`, `--thread`/`--st-now` →
    `--color-board-active`, `--sub`/`--st-review` → `--color-board-review`, `--build`/`--st-done` →
    `--color-board-done`, `--st-idle` → `--color-board-idle`, plus `--color-board-past`) for glyphs, dots and bars only;
    `boardColor` gives apps those colours without writing `var(--…)`.
  - One link recipe (`accent`, `inherit`, `muted`) for `Link` (new `tone` prop), `InlineLink`, RichText, the Markdown
    editor and the board's links.
  - RichText draws task-list checkboxes as Checkbox does, `<details>` summaries with the disclosure chevron, and its
    tables, rules and quotes in the line tokens.
  - Contrast fixes: Kbd, chart timestamps, list headers, Alert text (each tone's `-fg` on its surface), muted text in
    ActivityLine and on chosen rows, the board's attention labels (role colour on a dot, text in a text token) and the
    ImageViewer caption, now on a dark stage in both themes.
  - New `ModalExpandButton` stories.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Long values read whole. `ImageCard` titles clamp to two lines in every presentation (poster and person too) with the
  full title on hover, and a missing subtitle closes up instead of leaving a blank line above the detail (story
  `FileNameWithoutYear`). A single unbroken token — a file-name title (`harbour_footage_2009_FINAL`) in `ImageCard` and
  `DetailHero`, an address in `DetailList wrapValues` — breaks after its separators (`_ . / : -`) instead of mid-word;
  `DetailList wrapValues` labels wrap at word boundaries.
  
  `Grid variant="posters"` columns are as wide as a catalog's poster cards (min 9.5rem, was 6.5rem), so a person's
  "Appears on" posters match the catalog grid.
  
  `DetailHero artworkSize="compact"`: artwork that is only a stand-in (no image of its own) sits as a small tile beside
  the title instead of an empty poster-sized frame (story `PlaceholderArtwork`).

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - SidebarPane takes a `header` outside its nav scroller, and SettingsNav puts its search there: on a phone the search stays above the sideways row of sections instead of scrolling away or clipping.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Share the small details across the website, lar-server and Lar Factory. New `GlassBar` is the one header surface
  (AppShell, SiteShell and BoardTitleBar sit on it; BoardShell's main area now scrolls so the board passes under the
  glass). `StatusIndicator` is the website's glowing status light for every app: halo and glow per tone, new `accent`
  tone, `pulse` (reduced-motion aware), `srLabel` and `overlay`; StatusLight, the toolbar health dots, IconButton's
  notification, the Refreshed dot and the board's merge/checks/attention dots use it. `Badge` takes the website's
  pill treatment (tone tint plus tone hairline, full radius) with `size: 'sm' | 'md'`; StatusPill, Announcement tags,
  the palette trigger's token chips and the route label use it. BoardTitleBar no longer draws traffic-light stand-ins in
  a browser; `pastLights` only insets the bar in the Mac app (`nativeWindow`).

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Shared overlay and feedback primitives, so the apps stop improvising the same surfaces:
  
  - `PopoverHeader`: a toolbar or counter popover's header (sentence-case title, quiet count or status light and word, optional action, divider always). `StatusPopoverContent` composes it, gains `count`, `action` and `width="lg"`, and caps at 32rem with its rows scrolling under the header (`Popover.Content height="capped"`).
  - `ConfirmDialog`: "Delete {name}?", the consequence, an optional neutral `reassurance` note, an explicit confirm label, danger or primary tone, busy state; a compact `Modal.Content presentation="confirm"` read as an alert dialog.
  - Menus: chosen `DropdownMenu.RadioItem` and `CheckboxItem` entries carry a trailing tick instead of a fill alone; `RadioGroup` and `Group` take a `label` that heads and names the group. A `Select`'s list is as wide as its trigger or its longest option, up to the window, so option labels never clip; its tick sits at the end too.
  - Notifications: one contract. `showNotification` takes `tone` (`success`, `info`, `warning`, `danger`), `title`, `description`, `body` and an `action`; every notification shows its tone's icon, tint and edge in both presentations; warnings and failures stay until closed, successes and infos clear themselves after hover and focus leave. `showErrorNotification` (now with an optional `action`) and `showSuccessNotification` go through it.
  - `AppSplash`: the shared app boot screen (the drawing Lar lockup, a rolling status line, a calm progress track). The board's `LoadingScreen` renders the same view.
  - Alerts: dark tinted surfaces are low-chroma, every Alert has a coloured edge, and the icon centres on the first line at both sizes. New `AttentionList` gathers stacked problems in one "Needs attention" surface, one row and action per problem.
  - `CommandPalette`: the palette renders its own key hints ("↑↓ move · ↵ select · esc close", plus "⌫ remove filter" or "back"), translated through `DesignSystemProvider` `labels.commandPalette` or a palette's `hints`; the `footer` prop is removed. Every palette is one width (40rem). `CommandPaletteOption` gains `current`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Unify section counts, settings rows and picker widths, inline empty states and neutral 404s. Fold secondary title-bar tools into a narrow-screen overflow, align overview metrics at the top, and colocate board styling and overlay-motion tests with the design system.
  
  Use the shared limit bars in board stage headings; BuildLimit now uses the board active tone and no longer accepts a color look prop.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Showcase: a test keeps the marketing layer from redefining a board or generic component (by name) or copying a board class, so the website shows the apps only through their own captures and components. `PhotoSearchConcept` tiles show a quiet fill while their photos load instead of an empty box.
  
  Readiness lights (`ReadinessStatus`, `StatusLight`, `Announcement`) now name their status on the shared map: available is `ready`, planned is `off`, and in development keeps the accent.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Showcase screenshot crops match the final product captures: `concept-dependencies` frames the whole concept map (both
  lanes and the outcome check), `album-shelf` centres the five-album shelf and `item-create` drops the edge of the search
  field. Storybook product captures are refreshed from the final apps.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Showcase readiness chips now use the apps' status treatment: `StatusPill` is renamed `ReadinessStatus` and draws the
  StatusIndicator dot and label (no badge), the Announcement tag is a pulsing dot and label, the RouteDiagram label is a plain Badge (no light), and the ReadinessLegend
  spaces its labels like a key. `Roadmap` takes an optional `title` and `lead` for closing a section that has its own
  heading.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Add a screenshot detail crop for three complete server user identities, keeping account and catalog access text readable on narrow screens.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `SidebarPane`: as a phone's sideways row of sections it takes the wider 3rem fade and 48px scroll padding, so a cut section label dissolves and the selected section is revealed clear of the fade.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - SiteHeader's phone menu holds the page still while it is open (the menu itself scrolls) and leaves it where it was on close; the page behind the menu and the bar are opaque, so nothing reads through.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `SiteHeader`: the open phone menu is a named modal dialog (new optional `menuTitle`, defaulting to `navigationLabel`). Opening moves focus to its first link, Tab and Shift+Tab wrap inside it instead of leaving for the document or the browser, and its navigation rows, theme switcher and call to action share one left inset.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `SiteHeader`: the open phone menu is modal. Everything outside the header is inert while it is open, so Tab and a screen reader's cursor stay in the menu instead of reaching the page behind it; Escape still closes it and hands focus back to the menu button, and it closes once the window is wide enough for the bar's own links.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Fold every boolean `compact` into the size ladder: Button, ButtonLink, Alert, StatusRow, ProgressStatusRow, CollectionViewToggle/ViewToggle, ScrollRow/ScrollRowArrows, ResourceCard, ActivityCard, Avatar and showcase Callout take `size="sm"` (Alert `size="md"` opts out of a surface default). DetailList `compact` becomes `variant="inline"`. DetailHero `artworkSize` is `"sm" | "md"`, DeviceStage `startSize`/`endSize` are `"sm" | "lg"`. The prop vocabulary test checks every `size`/`…Size` prop and rejects boolean size flags.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - StateMessage's footer (EmptyState, PageError) sits centred under a centred message as a block, left-aligned inside, so a first run's step list lines up under the title and actions.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - One answer per concept. Board statuses take the one state map's colours (`statusStateColors`, `boardStatusState`,
  `sliceProgressState`, `sliceProgressLabel`, `attentionToneState`; `--color-board-active` is now `info` and
  `--color-board-idle` `line-strong`), with violet only as the Review stage's identity on a stage bar (`stageColor`), and a
  test that fails on any other status colour; `StatusGlyph state` and `SliceRow label`. New `LegendSwatch` (a square series
  key, drawn by `MeterLegend`), `ImagePickerHeader` (one header contract for every image picker, its loading announcement named for assistive
  technology), `EmptyState
  size="compact"` for empty settings and archive lists, and `conceptIcons` (one icon per concept) with a Writing/Icons
  glossary. Alerts of every tone colour only their icon and edge, with primary-colour text, and share ConfirmDialog's
  reassurance box; ghost actions sit flush in every header and row action slot; a StatusRow with details keeps its light
  on the first line; MarkdownEditor's text area fades where it overflows and keeps the caret clear of the fade; project
  icons keep their colour in any container. Writing adds scan vs check-up, On/Off, headline full stops and the audience
  rule; Modal.Footer documents the one-shot Checkbox option.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - StatusPopoverSection headings are clearer (semibold, count in a small pill). A StatusRow with an `action` reads its value under the label, so its Review never wraps onto a line of its own. AttentionList.Item gains `singleLine` (one-line description, action beside the text at every width), and every row's light sits under the header's icon tile.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - StatusRow takes `action` (`{ label, href?, onNavigate?, onClick? }`): the way to what the row reports, such as "Review", as the small secondary button every attention row uses, before the row's value. New type `StatusRowAction`.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `StatusRow`: the label wraps instead of truncating, and when the row's end (a value or controls) can't fit beside it, the end moves under the label at the row's end.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - One status and progress contract, plus form and overlay fixes:
  
  - `StatusState` (`ready` | `active` | `waiting` | `failed` | `off`), `statusStateTones` and `statusTone()`: the one tone
    map. `StatusIndicator`, `StatusRow`, `ToolbarStatusItem`, `ProgressStatusRow` and `StatusPopoverContent` take
    `state` next to `tone` (`StatusIndicator`'s `tone` is now optional).
  - `StatusSummary` for mixed states ("5 active · 3 failed"), each part in its own tone; `PopoverHeader status` and
    `StatusPopoverContent status` also take an array of parts.
  - `ProgressStatusRow` is Lar's one progress grammar: identity-first `label`, `operation`, `status` (`ProgressState`:
    queued, running, paused, failed, done), `statusLabel`, `count` · percent · `eta`, `reason`; nothing truncates; the
    running bar takes the active (info) colour; `active` is now optional. Existing props keep working.
  - `PasswordField` with a show/hide toggle and an optional requirement that ticks once met.
  - `AppSplash chrome` (`browser` default, `desktop`): the drag region and title-bar padding apply only to desktop.
  - Popovers and dropdown menus keep an 8px gutter from the window edges; board counter panels open from their counter's
    start and pad their list.
  - Checkbox draws its tick centred inside the box; `CommandPaletteOption` sizes any icon (bare or in a `KindIcon`) to
    16px in the muted tone; the reduced-motion indeterminate bar is soft stripes instead of dashes.
  - Every scrolling region a `Modal` can hold (its body, `SidebarPane`, `ImagePicker`, `ScrollArea`, the board's draft and
    ticket panes) fades at an edge while content runs past it, including while a field inside has focus (the fade used
    to lift whenever anything inside was focused, so editor dialogs had none).
  - `Field` draws its error line in the danger colour (ninna-ui's helper colour used to win).

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - The status-word rule, in docs/Introduction.mdx: a state is StatusIndicator's light and a neutral word; a tone Badge is only for a verdict or a category. `statusWordViolations` in `@lar-works/design-system/testing` finds tinted state words in an app's sources. `ProgressStatusRow`'s status word is neutral; the board's `StartTag`, `RowBlocked`, `SummaryBlocked` and `ActivityLine` words follow the rule; new board `PullRequestState` (merged or closed) takes a pull request's checks' place; DeviceCard, FormSection and PageLayout stories show states as StatusIndicators.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Storybook docs resolve one theme before they paint: the toolbar's default is the stories' light theme, set on <html> from the URL before any render and in the docs container's first render, and the docs chrome derives from the same value, so a docs page cold-loaded under a dark system preference never pairs dark palette text with light docs chrome. The Writing page renders again (its {placeholders} were MDX expressions), and Markdown numbered lists keep their numbers.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - ThemeSwitch is the one theme control everywhere: `placement="menu"` makes it a DropdownMenu's labelled row, the same pill and segments as menu radio items, and `label` names it ("Appearance"). DropdownMenu's `segmented` radio groups take ThemeSwitch's pill.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Share one-tab-stop, arrow-to-select keyboard behaviour between theme switches and segmented controls, including menu placement.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - TimeSeriesChart reads its scale off the plot like an axis: the top value on the top gridline and zero on a firmer baseline, in a column beside the plot, rather than a value floating above it. Its screen-reader readings table now hides inside a visually hidden block, since a table ignores sr-only's box: the page no longer scrolls past the chart into blank space.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - TimeSeriesChart draws both series solid, the host's thinner: a dashed line read as a placeholder. The legend's marker shapes still tell them apart without colour.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - New `TitleBarSettingsButton` (`label`, `onOpen`, optional `description`): Settings in a title bar, the bar's 28px
  icon button with a 16px gear, the same in lar-server and Lar Factory (the board's `OpenSettingsButton` now renders
  it). `TitleBar` spaces every tool at its end by one 8px step (4px on a phone) and `ToolbarStatusGroup` drops its own
  inline padding, so Settings sits in the bar's group of tools; the board's title bar no longer sets it apart with a
  divider.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Foundations without one-offs:
  
  - Semantic `--color-{primary,success,warning,danger,info}-edge` (a toned border on a neutral box) and `-ring` (the
    hairline of a tinted box), light and dark, plus `--color-primary-fill-hover`. Badge, Alert, Button, ButtonLink,
    AttentionList, CommandPalette, ImagePicker, ResultList, form controls and the board use them; a test fails on a status
    hue at an ad-hoc alpha.
  - One even twelve-step neutral ramp per theme (`--color-palette-zinc-1…12` light, `--color-palette-neutral-1…12`
    dark) in place of fifteen and eighteen near-identical steps; roles that share a value are documented; the scrollbar
    takes `--color-scrollbar-thumb(-hover)`. Dark surfaces and lines move by at most a step.
  - Radii only from the scale, now with `xs` (4px) and `3xl` (24px); four tracking steps (`tracking-display`, `-title`,
    `-heading`, `-caps`) replace eleven letter-spacings. `scales.test.ts` fails on any other radius or tracking.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `ToolbarStatusItem`: `state` and `tone` are optional; with neither it is the quiet state, the icon alone in the same 16px box as a lit one, so a toolbar's icons keep one size whether or not a light is on. Use it in place of a bare icon.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Show loaded image dimensions consistently beside viewer captions when an original resolution is not supplied.

### Patch Changes

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - DateField selects its numeric text when editing starts, so tabbing in and typing replaces the date instead of appending to it.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Modal: the header stays visible when a dialog gains or loses its sidebar while open.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `DesignSystemProvider` now shares one tooltip provider, so components that show a tooltip (such as `ImagePicker`'s
  full candidate titles) work in every app without the app mounting `TooltipProvider` itself.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `StatusPopoverContent` focuses the popover itself as it opens, so its rows no longer show a focus ring around the
  whole list, and its rows fade where they run past the popover's edge, like every other scrolling region.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - Title-bar icon buttons (such as Settings) draw their icon in the header's icon colour, like the status items and menu
  buttons beside them, instead of a lighter muted grey.

## 0.4.0

### Minor Changes

- [#2](https://github.com/maddec01/lar-web/pull/2) [`8e3ae1f`](https://github.com/maddec01/lar-web/commit/8e3ae1fa66d0aaaf0227c2b54914b9fd7218f63c) Thanks [@dependabot](https://github.com/apps/dependabot)! - Upgrade ninna-ui to 0.7.0, retain accessible tooltips, and use LabelPicker for vocabulary labels. Block label edits while busy. Document Trusted Publishing for shared configuration releases.

## 0.3.0

### Minor Changes

- [#8](https://github.com/maddec01/lar-web/pull/8) [`f0c75ba`](https://github.com/maddec01/lar-web/commit/f0c75bab97d991a83a999e95d44ecfc39ac273ea) Thanks [@maddec01](https://github.com/maddec01)! - Lar Factory's board now composes the design system and styles nothing itself, so its look moved here.
  
  A new **`board.css`** entry (`@lar-works/design-system/board.css`) is styles.css plus the board's role and status tokens
  (`--you`, `--thread`, `--sub`, `--build`, `--st-*`…), base styles (with the status glyphs' spin and pulse), title bar,
  loading screen, button kinds, item parts and rows; styles.css leaves the new `board/` category out, as it does the
  showcase. The **Board** category holds the board's own compositions:
  `BoardShell`, `BoardContent`, `ReadingLine`, `BoardTitleBar`, `BoardBrand`, `TitleBarDivider`, `RefreshIndicator`,
  `BoardCounters` and the counter parts, `LoadingScreen`, `BoardWarnings`, `BoardWarning`, `ToolMissing`, `DeskSection`,
  `DeskCard`, `DeskMergeState`, `DeskHint`, `UpdatePill`, `UpdateDownloading`, `ReleaseNotes`, the List's parts
  (`ListButton`, `ListGroupItem`, `ListHeader`, `ListItemRow`, `ListNote`), the filter bar's parts
  (`FilterBar`, `FilterMenu`, `FilterChoices`, `FilterChoice`, `FilterChip`), the archive's
  (`ActionStack`, `SettingConfirm`, `SettingLastRun`) and `buttonKind`, the board's five button kinds. Its
  work by stage is here too: `StatusGlyph` and `statusColor`, `StageTrack`, `SourceIcon`, the item parts (`ItemTitle`,
  `TitleLink`, `RepoTag`, `RepoIdentity`, `ItemFields`, `KindMarker`), slices
  (`SliceBar`, `SliceMark`, `SliceList`, `SliceRow`), `ActivityTrack`, `ActivityLabel`, pull requests (`PullRequestList`,
  `PullRequestRow`, `ChecksState`, `PullRequestRef`, `PullRequestReadiness`, `ReadinessDetails`), Start's surroundings
  (`StartGroup`, `StartNote`, `StartTag`, `StartLine`, `ActionError`), `NeedsYouNotice`, `DependencyList`, `EarlierThread`,
  `LossList`, the stage sections (`StageSections`, `StagePane`, `StageList`, `StagePaneEmpty`, `BuildLimit`,
  `HeaderSwitch`), the stage row's parts (`StageRowItem`, `RowOpen`, `RowSide`, `RowSecondLine`, `UsageFigures`…), the
  thread activity line (`ActivityLine`, `AgentList`, `WorkingAgents`), the item dialog's frame (`ItemSummary` and its
  `SummaryStatus`, `SummaryAge`, `SummaryBlocked`, `SummaryParent`, `SummaryPanel`; `ItemDialogBody`, `ItemDialogColumns`,
  `ItemDialogAside`, `WarningNote`, `AccessNotice`, `DialogActions`), its progress (`ItemProgressPanel`,
  `WorkflowSteps`, which draws the current step's status gradient, `PartsProgress`, `ProgressCount`, `ProgressActivity`,
  `SliceChips`, `SliceChip`) and its details (`DetailsHeading`, `DetailsSection`, `TextSection`, `MainSection`,
  `SectionHeader`, `HeaderStatus`, `DetailsText`, `MainColumnSlot`, `MetaArea`, `DetailFact`,
  `InlineList`, `FactList`, `EditorSlot`, `EditActions`, `SpecSync`, `TicketLinkList`,
  `TicketLink`, `AttachmentLink`, `SprintCount`, `WaitsOnList`, `ChipGroup`,
  `LabelEditorPanel`, `ChangeFailed`, `KindQuestion`, `OutgoingTicket`, `CheckRun`, `FocusPanel`; a concept's parts are the
  dossier's `PartRow`s), a project's icon (`ProjectIcon`, its initial on the colour of the
  repository's place with T3's emoji, monogram, favicon or lucide icon), Settings (`OpenSettingsButton`, the title bar's
  icon-only button; `SettingsNav`, the sections' sidebar with its search; the pages' `ReasonNote`,
  `SettingsNote`, `SettingDetails`, `SettingControl` and `ProjectValueList`), a project's kind vocabulary (`VocabularyRow`, `VocabularyMore`, `VocabularySuggestion`
  and the `LabelChooser` with its `LabelChooserList`, `LabelChooserOption`, `LabelChooserEmpty` and
  `LabelChooserFooter`) and tracker labels (`TrackerLabelList`, `TrackerLabelRow`,
  `TrackerLabelEditor`, `CreateLabelForm`), Add item (`AddItemButton`, the title bar's Main button; `DraftFields`, a
  draft's fields beside their details panel; `PanelField`, `DraftTicketPart`, `CreateIssueChoice`; `TicketSearchPane` and
  `TicketSearch`, a tracker's open tickets searched and picked), onboarding (`EmptyBoard`, `SetupCardList`, `SetupHeader`,
  `SetupStep`, `ProjectLine`, `AddFolderLine`, `ChoiceDetails`, `ProjectList`, `ProjectListItem`), the dock's dossiers (`DossierRow`, `DossierLine`,
  `DossierChips`, `PartsBar`, `PlanningNote`…), their attention list (`AttentionList`, `AttentionEntry`, `PartLink`…),
  parts list (`PartsList`, `PartRow`, `PartKindLabel`…) and Work map (`WorkMapFrame`, `MapBand`, `MapEdges`,
  `MapPartNode`, `MapCheckNode`, `HistoryRow`…).
  
  New generic components: `Progress` (determinate), `DismissButton`, `FormResult` and `LiveRegion` (feedback);
  `FormFieldset`, `FormUnit`, `LabelPicker`, `MarkdownEditor`, `ColorSwatches` and `HiddenField` (forms); `RichText`,
  `Diagram`, `LabelChip` (a label in its own colour, with a note, a lock or a ×), `Comment` and `CommentList`, and `Person`
  (display); `SortMenu` (navigation); `HelpTip` and `ModalExpandButton` (overlays); `ambientMotion` (foundations), which
  pauses repeating indicators out of view.
  
  Consolidated, so each look has one component:
  
  - `Loading` is the design system's own: ninna-ui's announced spinner as before, and with `presentation` (`inline`,
    `line`, `status`) a small spinner beside what loads, which `still` stops.
  - `Code` is the design system's own: ninna-ui's code chip as before, and with `wrap` (`anywhere`, `never`) a path or
    command in plain inline code.
  - `OptionSelect` takes an option's `icon` and `hue`, a `none` option, a form field `name` (with an input event on a
    pick), `writesOnPick`, `busy`, `presentation="setting"`, a `ref` and Select's own props; `label` may be left out
    when a label names it by its `id`.
  - `StatusIndicator` takes `labelColor`, a colour that comes with data, and `label`, a word after the dot in the
    tone's text colour.
  - `Text` takes `numeric`, `breaks`, `ownLine` and `only` (`narrow`, `wide`), for small notes.
  - `InlineLink` takes `onClick` (and `disabled`) in place of `href`, a button with its look.
  - `RadioChoice` takes data attributes, and `Disclosure` takes `onOpenChange`.
  
  Extended, with every default unchanged:
  
  - `Notifications` takes `presentation="stack"`, and `showNotification`, `clearNotification` and
    `useNotificationControls` show rich notifications one per slot, a success clearing itself five seconds after the
    pointer and focus leave it.
  - `CommandPalette` takes several `tokens`, `onBackspaceEmpty`, a `trailing` control, a `busyLabel`, and an `onSelect`
    that may name the next highlight; `CommandPaletteOption` is a one-line option with a hint, meta and tick. Its list
    announces its empty and busy text in a status region, an input method's Escape no longer closes it, and option ids
    no longer collide for values that differ only in punctuation.
  - `CommandPaletteTrigger` takes `tokens`, measuring its room to show them, count them or fold.
  - `Button` takes `compact` (28px, 12px text), `wrap`, the `tinted` recipe, `iconOnly` (square, its icon alone), `busy`
    (a spinner in its icon's place), `shrinks` with a trailing `mark`, and `pendingLook`; `ButtonLink` takes `compact`
    (the app Button's compact look as a link) and `iconOnly`; `ViewToggle` is CollectionViewToggle's segmented icon
    toggle for any views, `compact` for a row's line; `DropdownMenu.ItemText` gives an entry a detail line; the icons gain `AzureDevOpsIcon`, and `GitHubIcon` takes a `className`.
  - `Avatar` takes `compact` (24px); `Disclosure` takes `presentation="section"`, a section's own content behind a muted
    label; `FormFieldset` takes `hiddenLegend`; `Text` takes `variant="inherit"`, the surrounding size and colour;
    `IconButton` takes `variant="inline"`, a 20px control in a line of text.
  - `InsetPanel`'s `settings` panel takes a `footer` on the muted surface; `FormResult` takes a `list` under its text, such
    as the paths a call touched; `Badge` takes `muted`, for an entry listed but switched off; `Text` takes `nowrap`;
    `Input` takes `presentation="count"` (a small whole number); `Button`'s `pendingLook` takes `'disabled'`, the disabled
    look for a button `aria-disabled` holds; `RepoIdentity` takes `presentation="wrap"`, which wraps a longer line. The board's last `data-icon-only` marks leave
    board.css, as every icon-only button is now the Button's `iconOnly`.
  - `FormSection` takes `presentation="dense"`: a dense tool's group, its title with `help` and its description over the
    panels and notes it holds; `Input` takes `presentation` (`setting`, a settings row's 16rem field, or `short`);
    `Popover.Content` takes `width="md"` (22rem); `Button`'s `wrap` also breaks a long word and keeps the button inside its
    container. A new `@lar-works/design-system/icons/dynamic` entry gives lucide's `DynamicIcon`, which draws an icon by
    name, for apps to load lazily.
  - `Disclosure` takes `presentation="group"` (a form's optional group under its heading, with a `badge`) and
    `presentation="framed"` (a short list in a frame), `defaultOpen` and data attributes; `ViewToggle` takes
    `presentation="text"`, its options' labels as small text buttons, and each option's `attributes`; `Input` takes
    `presentation="title"`, a document's title typed in place; `Modal.Content` takes `fitsContent`, a paned dialog that
    takes its content's height; `CollectionState` takes an `action` of the caller's own and the `welcome` variant, an app's first-run welcome with its
    brand mark; `DetailsHeading` renders `as` a `label` or `span`.
  - `Badge` takes `labelColor`; `CopyButton` takes `presentation="text"`, `copyText` and `onCopied`; `FormRow` takes
    `layout="flow"` with `help`, `below` and `error`; `Modal.Content` takes `expanded`; `Switch` takes
    `busy`; `RichText` takes `renderDiagram`; `DesignSystemProvider`'s labels gain `editor` and `dialog` groups.

## 0.2.1

### Patch Changes

- [#6](https://github.com/maddec01/lar-web/pull/6) [`628b529`](https://github.com/maddec01/lar-web/commit/628b5291ece1641d03f9d6718624aa59dc553fe8) Thanks [@maddec01](https://github.com/maddec01)! - Generate ninna-ui's own component classes under pnpm too (such as the striped progress bar and the
  `[role="button"]` pointer-events rule), which ninna-ui's `@source` paths only find in npm's flat `node_modules`.

## 0.2.0

### Minor Changes

- [#4](https://github.com/maddec01/lar-web/pull/4) [`096e90a`](https://github.com/maddec01/lar-web/commit/096e90ae293b9a1d0f41f958ce9adbbf33b6d70b) Thanks [@maddec01](https://github.com/maddec01)! - The marketing showcase's styles move to `@lar-works/design-system/showcase.css`, so apps that import `styles.css` no
  longer ship them (about 58 KB less CSS). A website that uses the showcase components imports `showcase.css` instead
  of `styles.css`. `ActionModal`'s `children` is optional, for a confirmation with no body.

### Patch Changes

- [#4](https://github.com/maddec01/lar-web/pull/4) [`096e90a`](https://github.com/maddec01/lar-web/commit/096e90ae293b9a1d0f41f958ce9adbbf33b6d70b) Thanks [@maddec01](https://github.com/maddec01)! - `SiteHeader` gives its mobile menu a unique id, so two headers on one page no longer share `site-menu`.

## 0.1.1

### Patch Changes

- [`f5ee04d`](https://github.com/maddec01/lar-web/commit/f5ee04d060f99b9c590aac90a8741dd4125fa1ef) Thanks [@maddec01](https://github.com/maddec01)! - `createThemeController` returns `initialize` and `useTheme` as plain functions, so apps can destructure them.
