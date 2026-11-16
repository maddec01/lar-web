---
'@lar-works/design-system': minor
---

Add `TickMeter`, the one meter every Lar app shows progress with: a row of small rounded ticks (4px wide, 3px apart), as many as its width holds. Its segments share the ticks in order and by weight, lit in their state's colour up to their `value`; the front tick of running work breathes (`pulse`), work of unknown size sends a light along the ticks (`sweep`), work ahead is the bare ticks, and neighbouring segments that look alike merge into one run. It takes a limit `marker` and three sizes (`sm` 8px, `md` 10px, `lg` 12px), and pauses out of view and for reduced motion.

Breaking: `SegmentedProgress` (and its `ProgressSegment` type) is removed; use `TickMeter`, whose `TickSegment` takes the same `label`, `state`, `color`, `value`, `pulse` and `sweep`. `StatTile`, which no app used, is removed too. `Progress` stays for a plain determinate bar.
