# Changesets

Each PR that changes a published package (`@lar-works/design-system`, `@lar-works/config`) adds a changeset:
run `pnpm changeset`, pick the packages and the bump, and describe the change for the apps that update.
The Release workflow turns pending changesets into a "Version packages" PR; merging it creates a GitHub Release per
new package version with the tarball attached, which apps install by URL.
