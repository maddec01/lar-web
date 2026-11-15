# Contributing

Node 24.15+ and pnpm, from the repository root:

```sh
pnpm install
pnpm storybook   # the design system's Storybook
pnpm test
pnpm check
```

## Release

Changes ship through [changesets](.changeset/README.md): a PR that changes a published package adds one with
`pnpm changeset`. Merging the Release workflow's "Version packages" PR publishes to npm; then bump the packages
in each app (`pnpm update @lar-works/design-system @lar-works/config`).
