# @lar-works/design-system

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
