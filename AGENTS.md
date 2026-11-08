# lar-web agent instructions

lar-web holds `@lar-works/design-system`, `@lar-works/config` and the app template (see README.md). Three apps use the
published packages: lar-platform (`web/`), lar-server (`web/`) and lar-factory (`apps/web`).

- The design system holds tokens, theme, foundations, generic components and patterns, and the rules (docs, lint); it
  names no product. Product compositions live in each app's own UI layer (`src/ui`), built from the design system's
  components, `@lar-works/design-system/primitives` and its tokens. Promote a composition here (with a story) only
  when a second product needs it; feature code outside `src/ui` never styles anything.
- Before adding a component, look for an existing one that does the job or can grow a variant: no near-duplicates.
- Inside the design system, import the owning module directly (not a category `index.ts`), take labels and
  callbacks as props (no i18n, routing or server state), and import icons from `lucide-react`.
- Every component has a colocated `*.stories.tsx` with its meaningful states. Tests cover logic and real behaviour (keyboard, focus, layout), not copy or markup.
- A change to a published package needs a changeset (`pnpm changeset`) describing it for the apps.
- Before a PR: `pnpm exec vp check`, `pnpm test`, `pnpm build` (Node 24).
