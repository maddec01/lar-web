# @lar-works/config

## 0.2.0

### Minor Changes

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `lint({ apps })` treats each app's `src/ui` as its UI layer, where the app composes its own product components from the
  design system:

  - `lar/no-visual-recipes` is off in `src/ui`.
  - `lar/boundaries` has a `ui` role there: it may import the design system (`/primitives` included), its icons, React,
    other ui files and type-only shared modules, never app state, routing, services or features. Outside `src/ui`, code
    may not import `@lar-works/design-system/primitives`, and services may not import `src/ui`.
  - `lar/no-raw-colours` (new, on in `src/ui`): no hex, `rgb()` or `hsl()` colour in a class string or a style, such as
    `bg-[#0a0a0a]`; colour comes from the design system's tokens. Spacing and layout utilities are fine.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - `lar/no-visual-recipes` allows `size` on `Button`, `IconButton`, `Avatar`, `Loading`, `StatusIndicator` and `Alert`,
  the design system's named sizes; other look props stay in the design system.

- [#11](https://github.com/maddec01/lar-web/pull/11) [`a55e3b3`](https://github.com/maddec01/lar-web/commit/a55e3b3065d22e922a84b1cb79db1b77d68af202) Thanks [@maddec01](https://github.com/maddec01)! - New `@lar-works/config/copy` entry (also exported from the main entry): `checkUiCopy(strings, { locale, ignorePaths })`
  checks an app's locale strings against Lar's shared writing rules (apostrophes, contractions, retry wording, empty
  search and empty states, 404 headings) and returns the issues it finds.

## 0.1.2

### Patch Changes

- [#2](https://github.com/maddec01/lar-web/pull/2) [`8e3ae1f`](https://github.com/maddec01/lar-web/commit/8e3ae1fa66d0aaaf0227c2b54914b9fd7218f63c) Thanks [@dependabot](https://github.com/apps/dependabot)! - Upgrade ninna-ui to 0.7.0, retain accessible tooltips, and use LabelPicker for vocabulary labels. Block label edits while busy. Document Trusted Publishing for shared configuration releases.

## 0.1.1

### Patch Changes

- [`f5ee04d`](https://github.com/maddec01/lar-web/commit/f5ee04d060f99b9c590aac90a8741dd4125fa1ef) Thanks [@maddec01](https://github.com/maddec01)! - Treat `*.test.mjs` files as tests, and check look props only on the design-system components the old ESLint rule listed.
