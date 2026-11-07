# lar-web agent instructions

lar-web holds `@lar-works/design-system`, `@lar-works/config` and the app template (see README.md). Three apps use the
published packages: lar-platform (`web/`), lar-server (`web/`) and lar-factory (`apps/web`).

- Every visual decision lives in the design system; apps only compose components. When an app needs a new look,
  add or extend a component here (with a story), never style in the app.
- Before adding a component, look for an existing one that does the job or can grow a variant: no near-duplicates.
- Inside the design system, import the owning module directly (not a category `index.ts`), take labels and
  callbacks as props (no i18n, routing or server state), and import icons from `lucide-react`.
- Every component has a colocated `*.stories.tsx` with its meaningful states; `src/stories.test.tsx` renders them all.
- A change to a published package needs a changeset (`pnpm changeset`) describing it for the apps.
- Before a PR: `pnpm exec vp check`, `pnpm test`, `pnpm build` (Node 24).
