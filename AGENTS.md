# lar-web agent instructions

Consumers of the published packages: lar-platform (`web/`, `account/web/`), lar-server (`web/`) and lar-factory
(`apps/web`). A change here reaches them only after a release and a version bump in each.

- Every component has a colocated `*.stories.tsx` with its meaningful states; a story's a11y exception carries its
  reason beside `parameters.a11y.config.rules`.
- Cross-app design and copy rules live in `packages/design-system/docs/` (Storybook): keep them in sync with the code.
- A change to a published package needs a changeset (`pnpm changeset`).
- Browser tests (`*.browser.test.tsx`) need `pnpm --filter @lar-works/design-system exec playwright install chromium`
  once, and again after a Playwright upgrade.
