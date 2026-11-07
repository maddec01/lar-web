---
'@lar-works/design-system': minor
---

Lar Factory's board now composes the design system and styles nothing itself, so its look moved here.

A new **`board.css`** entry (`@lar-works/design-system/board.css`) is styles.css plus the board's role and status tokens
(`--you`, `--thread`, `--sub`, `--build`, `--st-*`…), base styles (with the status glyphs' spin and pulse), title bar,
loading screen, button kinds, item parts and rows; styles.css leaves the new `board/` category out, as it does the
showcase. The **Board** category holds the board's own compositions:
`BoardShell`, `BoardContent`, `ReadingLine`, `BoardTitleBar`, `BoardBrand`, `TitleBarDivider`, `RefreshIndicator`,
`BoardCounters` and the counter parts, `LoadingScreen`, `BoardWarnings`, `BoardWarning`, `ToolMissing`, `DeskSection`,
`DeskCard`, `DeskMergeState`, `DeskHint`, `UpdatePill`, `UpdateDownloading`, `ReleaseNotes`, the List's parts
(`ListButton`, `ListGroupItem`, `ListHeader`, `ListItemRow`, `ListNote`, `ListSortMenu`), the filter bar's parts
(`FilterBar`, `FilterMenu`, `FilterChoices`, `FilterChoice`, `FilterChip`, `FilterLabelBadge`), the archive's
(`ActionStack`, `BoardNote`, `SettingConfirm`, `SettingLastRun`) and `buttonKind`, the board's five button kinds. Its
work by stage is here too: `StatusGlyph` and `statusColor`, `StageTrack`, `SourceIcon`, the item parts (`ItemTitle`,
`TitleLink`, `RepoTag`, `RepoIdentity`, `ItemFields`, `KindMarker`, `LabelChip`, `ItemBadges`, `ItemNote`), slices
(`SliceBar`, `SliceMark`, `SliceList`, `SliceRow`), `ActivityTrack`, `ActivityLabel`, pull requests (`PullRequestList`,
`PullRequestRow`, `ChecksState`, `PullRequestRef`, `PullRequestReadiness`, `ReadinessDetails`), Start's surroundings
(`StartGroup`, `StartNote`, `StartTag`, `StartLine`, `ActionError`), `NeedsYouNotice`, `DependencyList`, `EarlierThread`,
`LossList`, the stage sections (`StageSections`, `StagePane`, `StageList`, `StagePaneEmpty`, `BuildLimit`,
`HeaderSwitch`), the stage row's parts (`StageRowItem`, `RowOpen`, `RowSide`, `RowSecondLine`, `UsageFigures`…), the
thread activity line (`ActivityLine`, `AgentList`, `WorkingAgents`), the item dialog's frame (`ItemSummary` and its
`SummaryStatus`, `SummaryAge`, `SummaryBlocked`, `SummaryParent`, `SummaryPanel`; `ItemDialogBody`, `ItemDialogColumns`,
`ItemDialogAside`, `WarningNote`, `AccessNotice`, `DialogActions`, `ButtonRow`), its progress (`ItemProgressPanel`,
`WorkflowSteps`, which draws the current step's status gradient, `PartsProgress`, `ProgressCount`, `ProgressActivity`,
`SliceChips`, `SliceChip`) and its details (`DetailsHeading`, `DetailsSection`, `TextSection`, `MainSection`,
`SectionHeader`, `HeaderStatus`, `DetailsText`, `MainColumnSlot`, `MetaArea`, `DetailFact`, `Person`, `PeopleList`,
`InlineList`, `FactList`, `EditorSlot`, `EditActions`, `SpecSync`, `CommentList`, `Comment`, `TicketLinkList`,
`TicketLink`, `AttachmentLink`, `SprintCount`, `WaitsOnList`, `LockedLabel`, `LabelsValue`, `ChipGroup`,
`LabelEditorPanel`, `ChangeFailed`, `KindQuestion`, `ConceptPartList`, `ConceptPart`, `OutgoingTicket`,
`ChecksDisclosure`, `CheckRun`, `FocusPanel`), a project's icon (`ProjectIcon`, its initial on the colour of the
repository's place with T3's emoji, monogram, favicon or lucide icon), Settings (`OpenSettingsButton`, the title bar's
icon-only button; `SettingsNav`, the sections' sidebar with its search; the pages' `SettingsGroups`, `ReasonNote`,
`SettingsNote`, `SettingDetails`, `SettingControl`, `ProjectValueList` and `SourceLink`), a project's kind vocabulary (`VocabularyRow`, `VocabularyChip`, `VocabularyMore`, `VocabularySuggestion`
and the `LabelChooser` with its `LabelChooserList`, `LabelChooserOption`, `LabelChooserEmpty` and
`LabelChooserFooter`) and tracker labels (`TrackerLabelList`, `TrackerLabelRow`, `TrackerLabelChip`,
`TrackerLabelEditor`, `CreateLabelForm`), Add item (`AddItemButton`, the title bar's Main button; `DraftFields`, a
draft's fields beside their details panel; `PanelField`, `DraftTicketPart`, `CreateIssueChoice`; `TicketSearchPane` and
`TicketSearch`, a tracker's open tickets searched and picked), onboarding (`EmptyBoard`, `SetupCardList`, `SetupHeader`,
`SetupStep`, `ProjectLine`, `AddFolderLine`, `ChoiceDetails`, `ProjectList`, `ProjectListItem`), the dock's dossiers (`DossierRow`, `DossierLine`,
`DossierChips`, `PartsBar`, `PlanningNote`…), their attention list (`AttentionList`, `AttentionEntry`, `PartLink`…),
parts list (`PartsList`, `PartRow`, `PartKindLabel`…) and Work map (`WorkMapFrame`, `MapBand`, `MapEdges`,
`MapPartNode`, `MapCheckNode`, `HistoryRow`…).

New generic components: `Progress` (determinate), `Spinner` and `SpinnerIcon`, `StatusText`, `DismissButton`,
`FormResult` and `LiveRegion` (feedback); `FormSelect`, `FormFieldset`, `FormUnit`, `LabelPicker`, `MarkdownEditor`,
`ColorSwatches`, `HiddenField` and `RadioGroupChoice`, a radio group's choice in a bordered row whose label truncates
(forms); `RichText`, `Diagram` and `ColorDot` (display); `CodeText`, a path or command in plain inline
code that breaks anywhere or never (typography); `HelpTip` and `ModalExpandButton` (overlays);
`ambientMotion` (foundations), which pauses repeating indicators out of view.

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
  toggle for any views, `compact` for a row's line; `DropdownMenu.ItemText` gives an entry a detail line; `BoardNote`
  takes `numeric`, `only` and data attributes; the icons gain `AzureDevOpsIcon`, and `GitHubIcon` takes a `className`.
- `Avatar` takes `compact` (24px); `Disclosure` takes `presentation="section"`, a section's own content behind a muted
  label; `FormFieldset` takes `hiddenLegend`; `Text` takes `variant="inherit"`, the surrounding size and colour;
  `IconButton` takes `variant="inline"`, a 20px control in a line of text; `InlineButton` is a button with
  InlineLink's look, and can be disabled; `BoardNote` takes `ownLine`, `breaks` and an `id`.
- `InsetPanel`'s `settings` panel takes a `footer` on the muted surface; `FormResult` takes a `list` under its text, such
  as the paths a call touched; `Badge` takes `muted`, for an entry listed but switched off; `Text` takes `nowrap`;
  `Input` takes `presentation="count"` (a small whole number); `Button`'s `pendingLook` takes `'disabled'`, the disabled
  look for a button `aria-disabled` holds; `RepoIdentity` takes `presentation="wrap"`, which wraps a longer line;
  `LabelsValue` takes a `label` for any wrapping row of badges. The board's last `data-icon-only` marks leave
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
  takes its content's height; `FormSelect`'s choices take a `hue` for their icon; `RadioGroup` takes
  `presentation="choices"`; `Spinner` takes `presentation="status"`, a step's announced loading line;
  `CollectionState` takes an `action` of the caller's own and the `welcome` variant, an app's first-run welcome with its
  brand mark; `LabelChip` takes a `note`, such as "new"; `DetailsHeading` renders `as` a `label` or `span`.
- `Badge` takes `labelColor`; `CopyButton` takes `presentation="text"`, `copyText` and `onCopied`; `FormRow` takes
  `layout="flow"` with `help`, `below` and `error`; `Modal.Content` takes `expanded`; `Switch` and `FormSelect` take
  `busy`; `RichText` takes `renderDiagram`; `DesignSystemProvider`'s labels gain `editor` and `dialog` groups.
