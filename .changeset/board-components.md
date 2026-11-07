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
thread activity line (`ActivityLine`, `AgentList`, `WorkingAgents`), the dock's dossiers (`DossierRow`, `DossierLine`,
`DossierChips`, `PartsBar`, `PlanningNote`…), their attention list (`AttentionList`, `AttentionEntry`, `PartLink`…),
parts list (`PartsList`, `PartRow`, `PartKindLabel`…) and Work map (`WorkMapFrame`, `MapBand`, `MapEdges`,
`MapPartNode`, `MapCheckNode`, `HistoryRow`…).

New generic components: `Progress` (determinate), `Spinner` and `SpinnerIcon`, `StatusText`, `DismissButton`,
`FormResult` and `LiveRegion` (feedback); `FormSelect`, `FormFieldset`, `FormUnit`, `LabelPicker` and `MarkdownEditor`
(forms); `RichText`, `Diagram` and `ColorDot` (display); `HelpTip` and `ModalExpandButton` (overlays); `ambientMotion`
(foundations), which pauses repeating indicators out of view.

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
- `Badge` takes `labelColor`; `CopyButton` takes `presentation="text"`, `copyText` and `onCopied`; `FormRow` takes
  `layout="flow"` with `help`, `below` and `error`; `Modal.Content` takes `expanded`; `Switch` and `FormSelect` take
  `busy`; `RichText` takes `renderDiagram`; `DesignSystemProvider`'s labels gain `editor` and `dialog` groups.
