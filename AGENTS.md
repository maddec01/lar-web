# lar-web agent instructions

Consumers of the published packages: lar-platform (`web/`, `account/web/`), lar-server (`web/`) and lar-factory
(`apps/web`). A change here reaches them only after a release and a version bump in each.

- The design system names no product. App compositions live in each app's `src/ui`; promote one here (with a story)
  only when a second product needs it. Before adding a component, extend an existing one (a variant, a slot) rather
  than add a near-duplicate.
- Inside the design system: import the owning module directly (not a category `index.ts`), take labels and callbacks
  as props (no i18n, routing or server state), and import icons from `lucide-react`.
- Every component has a colocated `*.stories.tsx` with its meaningful states; a story's a11y exception carries its
  reason beside `parameters.a11y.config.rules`. Tests cover logic and behaviour, not copy or markup.
- Cross-app design and copy rules live in `packages/design-system/docs/` (Storybook): keep them in sync with the code.
- A change to a published package needs a changeset (`pnpm changeset`).
- Verify with `pnpm exec vp check`, `pnpm test`, `pnpm build`. Browser tests (`*.browser.test.tsx`) need
  `pnpm --filter @lar-works/design-system exec playwright install chromium` once, and again after a Playwright upgrade.
