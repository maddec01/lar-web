import type { UserConfig } from 'vite-plus';

type LintConfig = NonNullable<UserConfig['lint']>;
type FmtConfig = NonNullable<UserConfig['fmt']>;
type TestConfig = NonNullable<UserConfig['test']>;

/** Oxfmt: Prettier's output with Lar's widths and quotes, imports sorted, Tailwind classes in Tailwind's order. */
export declare const fmt: FmtConfig;

export interface LintOptions {
    /** Each app's root, relative to the repository root (`web`, `apps/web`). */
    apps?: string[];
    /** The roots of design-system packages, which own every visual recipe. */
    designSystems?: string[];
    /** Extra paths to skip, such as generated API clients. */
    ignorePatterns?: string[];
}

/** Oxlint settings for a repository. */
export declare function lint(options?: LintOptions): LintConfig;

/** Test settings every package's `test` block spreads. */
export declare const test: TestConfig;

export { checkUiCopy, type UiCopyIssue } from './copy.js';
