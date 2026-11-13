# @lar-works/design-system

## 0.7.0

### Minor Changes

- [#19](https://github.com/maddec01/lar-web/pull/19) [`68592a2`](https://github.com/maddec01/lar-web/commit/68592a263ad7f9f62c296d03f2d02be6868f2952) Thanks [@maddec01](https://github.com/maddec01)! - Let workspace and paned dialog titles wrap beside their icon controls instead of truncating in a fixed-height bar. Add `Modal.Content.headerDetails` for supporting information on a separate row, and keep text actions from squeezing the title. Long identifiers wrap only when they cannot fit on one line.

### Patch Changes

- [#18](https://github.com/maddec01/lar-web/pull/18) [`93798f9`](https://github.com/maddec01/lar-web/commit/93798f9f6ef47f82c662879016d5105a4ae51d66) Thanks [@maddec01](https://github.com/maddec01)! - Keep confirmation actions together in a full-width stack on narrow dialogs, preserving safe-answer focus order. Wrap long identifiers in confirmation content without overflowing.

## 0.6.1

### Patch Changes

- [#16](https://github.com/maddec01/lar-web/pull/16) [`3ceba90`](https://github.com/maddec01/lar-web/commit/3ceba908706359a7feb2eee652ce81f4103da141) Thanks [@maddec01](https://github.com/maddec01)! - Settings dialog and menu fixes, mostly for Safari:
  
  - The settings dialog's reading zone no longer shows vertical stripes in Safari: its tint is one colour sized to the
    zone, not a hard-stop gradient (which Safari dithers over the blurred page).
  - A switch that is on no longer flashes off when the pointer enters its row in Safari: the thumb moves by a plain
    `translate` instead of Tailwind's translate variables, whose transition Safari restarted from 0 on every restyle.
  - Menu rows and select options show a visible highlight in dark (white 10%; black 6% in light), where ninna-ui's
    accent fill was darker than the menu glass.
  - A `paned` dialog (settings) grows from 896×704 to 1024×768 on a window from 1280px.

## 0.6.0

### Minor Changes

- [#14](https://github.com/maddec01/lar-web/pull/14) [`83918dc`](https://github.com/maddec01/lar-web/commit/83918dcaa2f376f05305603e0abb39aa41fcfd8a) Thanks [@maddec01](https://github.com/maddec01)! - One look for every Lar app, calibrated against T3 Code: a pure black page in dark (`#fafafa` in light, both pure grey)
  with surfaces as alpha steps (panels bordered on black, cards a faint fill), one glass ladder (bar, menu, and two-zone
  dialogs: an ink body with a glass sidebar and footer), subtler fields, a categorical palette, and the `current`,
  `segment-chosen` and `attention-*` recipes. Density follows the surface, never the app: 28px and 32px controls share a
  13px label, and radii are 6/8/12/16/20.
  
  New: `Card`, `Panel`, `SettingsDialog` (search, links, dirty guard) with the draft save model (`useSettingsDraft`,
  `SettingsFooter`), `SettingsGroup`, `SettingsPage`, `SettingsChildPane` and `SettingsSectionPane`, the settings parts
  (`SettingsReason`, `SettingsNote`, `SettingsDetails`, `SettingsControl`, `SettingsValueList`), `AppearanceSetting`,
  `ToolbarCounter`, `SegmentedProgress`, `ResultGroups`, `Alert presentation="inline"`, `EmptyState` hero and inline
  scales with a product halo, and brand marks (`GoogleLogoIcon`, `AppleLogoIcon`). `TitleBar` takes a `product` lockup
  and ordered `search`, `status`, `actions`, `settings` and `identity` slots; `AppShell` has a contained, desktop scroll;
  `AuthLayout` and `SiteHeader` are product-aware; `ButtonLink` has an app `look` and the tinted variant. Notifications
  use one presentation. `AsyncState` says "Still trying…" after three seconds. Also new: `TitleBarLabel` (an action's word
  that folds last), `SettingsChildPane` `title` (a third breadcrumb; Escape goes Back), `SettingsRow` `controlWidth`,
  `AuthLayout` `footer`, `Avatar` `hueKey` (one hue per person in every app) with `bar` and `lg` sizes,
  `GoogleLogoIcon colour="brand"`, `ProgressStatusRow` `hideChevron`, `ButtonLink` `arrow` in the app look, `Modal.Content` `back` (a dialog that navigates
  within itself goes back from an arrow before its title, as a settings child pane now does) and `TitleBar`
  `statusPlacement` (status buttons at the end, beside search). Alerts
  use the attention recipe at a lower strength, the third data series is magenta (orange read as a warning), and status
  popovers stop at 40rem. `brand`, `secondaryActions` and the Notifications `presentation` are deprecated but still
  accepted, as are `SettingsSection`, `FormRow` and `SettingsRow` `layout` (each now draws the one settings group or row).

## 0.5.0

Every change in this release comes from [#11](https://github.com/maddec01/lar-web/pull/11). The design system no longer
names a product: it keeps the tokens and theme, the foundations, the generic components and patterns, and the rules.
Product compositions live in each app's own UI layer (`src/ui`).

### Breaking changes

- **Removed entries:** `@lar-works/design-system/board`, `/board.css`, `/showcase` and `/showcase.css`.
- **Moved into the apps' `src/ui`:**
  - Lar Factory (`src/ui/board`): the board's compositions, `buttonKind`, its status colours and glyphs, `KindBadge`,
    the board's sheets and `--spacing-gutter-board`.
  - The website (lar-platform, `src/ui/showcase`): the marketing sections, device frames, stage, server unit and their
    tokens.
  - Lar Server (`src/ui`): `Artwork`, `BookCover`, `DeviceCard`, `ImagePicker`, `PairingList`, `PeoplePreview`,
    `PhotoStage`, `RatingLink`, `RemedyList`, `LibraryCard`, `DeviceUsage`, `DetailHero`, `KindIcon`, `ResourceCard`,
    `ActivityCard`, `ImageCard`, and the media tokens (rating brands, book covers, the transparency stage).
- **`conceptIcons`** keeps only the shared glossary (`activity`, `diagnostics`, `updates`, `refresh`, `settings`,
  `users`, `logs`, `archive`, `search`). An app adds its own concepts (`{ ...conceptIcons, scans: ScanLineIcon }`).
- **Public props are closed:** components that own their look no longer take `className`, `style` or ninna-ui's look
  props. The raw `Box` and `Divider` re-exports are gone; `Input` takes `presentation` only, and `Switch` drops `size`,
  `variant`, `thumbIcon`, `trackLabels` and `description`.
- **Renames (no aliases):**
  - `ConfirmDialog tone` → `intent="destructive" | "default"`; `FormResult tone="error"` → `tone="danger"`.
  - `PageSection tone` → `variant`; `SectionHeading size="display" | "headline"` → `variant`.
  - A boolean `compact` → `size="sm"` on Button, ButtonLink, Alert, StatusRow, ProgressStatusRow, ViewToggle,
    CollectionViewToggle, ScrollRow, ScrollRowArrows and Avatar; `DetailList compact` → `variant="inline"`.
  - `ResultList density="comfortable"` → `density="default"`.
  - StackedMeter, MeterLegend and LegendSwatch colour a series by `series: 1 | 2 | 3` (`MeterSeries`), replacing
    `MeterTone` and `tone`.
  - `--lar-shadow-*` → `--shadow-raised`, `--shadow-popup` and `--shadow-dialog`.
- **Removed APIs:** `CollectionState` and `ResultEmpty` (use `EmptyState` or `PageError`), Badge's `hue` (`BadgeBase` in `/primitives` keeps it), ScrollRow's
  `canScrollBack`/`canScrollForward`, `scrollEdgeFade`, and CommandPalette's `footer` (it renders its own key hints).

### Migration

1. Move the code of any removed component the app uses into its `src/ui`, building it from
   `@lar-works/design-system`, `@lar-works/design-system/primitives` and `@lar-works/design-system/icons`.
2. `@lar-works/design-system/styles.css` is the one stylesheet. In the app's CSS entry, import it with `source(none)`,
   then the UI layer's own sheets, then `@source './ui'`.
3. Upgrade `@lar-works/config` to 0.2.0. Its `lint({ apps })` lets `src/ui/**` style with the design system's tokens
   and `/primitives`, never with raw colours (`lar/no-raw-colours`); outside `src/ui`, code may not import
   `/primitives`.

New entry: **`@lar-works/design-system/primitives`**, for an app's UI layer only. It holds the styleable bases behind
the components (`ButtonBase`, `BadgeBase`, `TextBase`, `HeadingBase`, `StackBase`, `InlineBase`, `InputBase`,
`FormFieldsetBase`, `GlassBarBase`, `LinkBase`, `LinkBoxBase`, `LinkOverlayBase`, `StatusIndicatorBase`,
`TooltipPopupBase`, `TooltipTriggerBase`, `ScrollFadeRegion`) and the hooks and recipes they share (`useScrollFade`,
`scrollFadeClassName`, `useScrolled`, `useVisibleBounds`, `linkRecipe`, `softBreaks`, `SpinnerIcon`, `SplashView`).

### Changes by area

#### Foundations and tokens

- A semantic colour layer over the palette, light and dark and checked for WCAG AA: surfaces, text (`fg`, `fg-soft`,
  `fg-muted`, `fg-lead`, `fg-inverse`), edges, brand, controls and each status's `-fill`, `-on-fill`, `-fg`, `-surface`,
  `-edge` and `-ring`. Components use only this layer, and a test keeps it that way.
- One twelve-step neutral ramp per theme, a `brand-mark` colour, and `series-1` to `series-3` data colours that stay
  apart for every colour vision.
- Card depth: `surface-card` with `--color-surface-card`, `--color-line-card` and `--shadow-card`.
- Scales: named type steps (`text-3xs` to `text-display`), container sizes (`@pane`, `@split`, `max-w-page`,
  `max-w-reading`), radii (now with `xs` and `3xl`), four tracking steps, elevation roles (plus `--shadow-highlight`,
  `--shadow-pressed`, `--shadow-logo`) and motion tokens with a reduced-motion policy.
- One focus ring (`focus-ring`, `focus-ring-inset`, `focus-ring-within`, `focus-ring-stretched`, `focus-field`) on
  every element; native controls take the primary `accent-color`.
- `glass-menu` (menus, popovers, selects, tooltips, toasts) is nearly opaque (`--lar-menu-opacity`, 94%).
- One prop vocabulary, checked at the type level: `tone` is a status colour, a look is a `variant`, and a scale is
  `size` on one `xs`–`xl` ladder.
- One scroll fade: every scroller fades the edges its content runs past, and a browser test checks every story
  (`data-scroll-fade="exempt"` opts a page-level scroller out).
- `DesignSystemProvider` shares one tooltip provider, so apps no longer mount `TooltipProvider` themselves.

#### Layout

- `GlassBar` is the one header surface (AppShell and SiteShell sit on it).
- `PageLayout` takes an `actions` slot at the end of its title row; `SectionTitle` is public, with `size="sm"`.
- New `TitleBarSettingsButton`. `TitleBar` spaces its tools by one 8px step, and its icon buttons use the header's icon
  colour.
- `CommandPaletteTrigger` has one look in every app, with or without `tokens`, and folds to an icon button by the title
  bar's measured width. `ToolbarStatusItem`'s `state` and `tone` are optional.
- `SidebarPane` takes a `header` outside its scroller (SettingsNav puts its search there) and fades as a phone's row of
  sections.
- `SiteHeader`'s phone menu is a named modal dialog (`menuTitle`): focus stays inside, the page behind is inert and
  holds still, and Escape hands focus back.
- `Grid variant="posters"` columns are at least 9.5rem wide.

#### Forms and actions

- New `SegmentedControl` (a radio group of two to four short choices) and `PasswordField` (show/hide and an optional
  requirement).
- `DateField` takes locale-aware partial dates, shows the long date at rest and selects its text when editing starts.
  `onDraftChange` (`DateFieldDraft`) and `formatDateLong` are new.
- `FormField` labels top their control, FormFields in a `FormStack` sit flush and full width, and `FormUnit` passes a
  Field's label, error and state to its control.
- A Field's error is in the danger text colour. Text fields, selects and textareas have a 3:1 edge on
  `surface-control`, and checkboxes and radios a 3:1 edge.
- `Select` shows eight rows at most, is as wide as its trigger or its longest option, and marks the chosen one with a trailing tick.
- `OptionSelect` takes `presentation="inline"` (edits in place in a row of facts) and `presentation="badge"`.
- `Switch` `busy` blocks the toggle itself, keeps focus and sets `aria-busy`. Textareas honour `rows`.
- New `SettingsSection`, with a heading action slot.
- `Disclosure`'s `group` and `framed` presentations lead with the same turning chevron as the others.
- `ThemeSwitch` is the one theme control: `placement="menu"` makes it a menu row. It shares one tab stop and arrow-key
  selection with SegmentedControl.
- One quiet-destructive rule: `Button variant="destructive-quiet"`, `IconButton tone="danger"` and destructive menu items
  show danger text at rest and the danger surface on hover. A wrapping `Button` keeps its size's height as a minimum.

#### Overlays

- `Modal` takes `dirty` (and `discardLabels`): closing a dialog with unsaved changes asks "Discard changes?".
  `useModalClose()` returns the guarded `requestClose(next?)`.
- Dialogs take their content's height by default (`fitsContent` is tri-state) and their frame never scrolls; bodies fade
  under the header and at the bottom edge. `Modal` adds `sidebarSections`.
- Confirmation dialogs (`ConfirmDialog`, `Modal.Content presentation="confirm"`) have no close button and focus the safe
  answer. `ConfirmDialog` takes a consequence, an optional `reassurance` and a busy state.
- Dialogs with read-only content focus it on opening, and `Drawer` focuses itself when it has no field.
- New `PopoverHeader`. `Popover.Content` takes `layout="scroll"` and `height="capped"`. `StatusPopoverContent` takes
  `count`, `action` and `width="lg"`, and the new `StatusPopoverSection` groups its rows.
- New `DropdownMenu.Status` heads a menu with its subject's state. Chosen radio and checkbox items carry a trailing tick,
  `RadioGroup` and `Group` take a `label`, and `DropdownMenu.ControlRow` is new.
- Menus and popovers keep a 16px gutter from the window's edges.
- `CommandPalette` renders its own key hints (translated via `labels.commandPalette` or `hints`) and is one width
  (40rem); `CommandPaletteOption` takes `current`.
- `HelpTip` takes `side`. `ImageViewer` shows its caption on a dark stage, with the image's loaded dimensions.

#### Feedback

- `Alert` has one recipe per tone: the tone's surface, edge and icon, with neutral words. A `title` alone reads as the
  message, alerts in overlays are compact by default (`size="sm" | "md"`), and an empty `action` is ignored.
- New `EmptyState` and `PageError`, one grammar for empty, not-found and failed states. Sizes run from `hero` and
  `start` to `inline`.
- `showNotification` takes `tone`, `title`, `description`, `body` and `action`. Toasts have a neutral body; warnings and
  failures stay until closed.
- `AttentionList` is redesigned: a card with a tinted header, one row and action per problem, `collapsible`, and
  `onDismiss` and `singleLine` items.
- One status contract: `StatusState`, `statusStateTones`, `statusTone()`, `StatusSummary` for mixed states, and the
  `progressStateStatus`/`statusStateProgress` mappings. Status words are neutral beside their coloured light.
- `StatusIndicator` is a glowing light with an `accent` tone, `pulse`, `srLabel` and `overlay`.
- `ProgressStatusRow` has one anatomy: the light, the label, one meta line with the percent, then the bar or the reason.
  It adds `layout="line"`, `children` and `onDetails`.
- `StatusRow` takes an `action` (`StatusRowAction`); its label wraps, and its end moves under the label when it can't
  fit.
- New `AppSplash`, the shared boot screen, with `chrome` and `splashStatusText`. NoticeCard's description keeps a
  reading measure.

#### Display

- `Badge` is a pill with `size: 'sm' | 'md'`. `Person` is a generic display component, and `ItemActionProps` is
  exported.
- `TimeSeriesChart` reads its scale like an axis and lets keyboard users step through samples. It adds `timeLabel`,
  `keyboardHint` and `formatTime`, and draws both series solid.
- `StackedMeter` takes `size` and a limit marker. New `LegendSwatch` keys a series in `MeterLegend`.
- `ChangeList` changes take `kind` (`text` or `code`). `PropertySheet` takes `emphasis` and stable row `key`s.
- `RichText` keeps a 75ch reading measure and shows an image link as a named attachment row without loading the image.
  Its task lists, `<details>` and tables use the design system's controls and tokens.
- `DetailList wrapValues` breaks a long value after its separators. `ItemAction` without an action renders a plain
  spinner, never a button inside a button.
- InsetPanel, RowList and StatTile sit on the card surface. Kbd, chart timestamps and list headers meet AA contrast.

#### Collections

- `ResultList` takes `presentation="card"` and `presentation="choice"` (with the new `ResultChoice` radio rows).
- `VirtualList` and `DataTable` take `density`; DataTable fades when it scrolls sideways.
- `ScrollRow` fades its own edges and takes a `placeholder` card for its loading row. `VirtualGrid` rows grow to their
  tallest card.
- Counts read the same across headings, selectors and tabs, and are hidden while loading.

#### Navigation

- `CollectionBrowseSelector` and `CollectionBrowseTrigger` take `presentation="inline"`, and browse selectors offer a
  clear-search action.
- `Breadcrumbs` draws chevrons only between items and fades when it scrolls. `ViewTabs` keeps the selected tab in view
  with edge fades.

#### Typography

- One link recipe: `Link` takes `tone` (`accent`, `inherit`, `muted`, `default`) and `arrow`, shared by InlineLink,
  RichText and the Markdown editor.
- `Text` takes `measure="reading"` (75ch) and the `lead` tone (`fg-lead`).

#### Storybook, docs and testing

- Chromium accessibility checks (including colour contrast) run on every story in both themes. Docs resolve one theme
  before they paint and render GitHub-flavoured Markdown.
- Every public prop has a description, and controls are off for props that hold functions or React nodes.
- The Introduction, Foundations, Writing and Icons pages state the status-word, quiet-destructive, confirmation-focus
  and writing rules.
- `@lar-works/design-system/testing` adds `problemBodyViolations`, `statusWordViolations` and
  `iconConcept(element, glossary)`.

#### Moved components

- The board, showcase and media compositions were polished in this release before they moved into the apps.

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
