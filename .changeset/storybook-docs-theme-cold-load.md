---
'@lar-works/design-system': minor
---

Storybook docs resolve one theme before they paint: the toolbar's default is the stories' light theme, set on <html> from the URL before any render and in the docs container's first render, and the docs chrome derives from the same value, so a docs page cold-loaded under a dark system preference never pairs dark palette text with light docs chrome. The Writing page renders again (its {placeholders} were MDX expressions), and Markdown numbered lists keep their numbers.
