# @lar-works/design-system

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
