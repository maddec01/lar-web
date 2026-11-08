---
'@lar-works/design-system': minor
---

The status-word rule, in docs/Introduction.mdx: a state is StatusIndicator's light and a neutral word; a tone Badge is only for a verdict or a category. `statusWordViolations` in `@lar-works/design-system/testing` finds tinted state words in an app's sources. `ProgressStatusRow`'s status word is neutral; the board's `StartTag`, `RowBlocked`, `SummaryBlocked` and `ActivityLine` words follow the rule; new board `PullRequestState` (merged or closed) takes a pull request's checks' place; DeviceCard, FormSection and PageLayout stories show states as StatusIndicators.
