export { checkUiCopy } from './copy.js';

// The settings every Lar web repository spreads into its root vite.config.ts, so all of them format, lint and test
// the same way. Plain JavaScript: Vite+ loads config dependencies from node_modules, where Node strips no types.

/** Oxfmt: Prettier's output with Lar's widths and quotes, imports sorted, Tailwind classes in Tailwind's order. */
export const fmt = {
    printWidth: 120,
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'all',
    sortImports: {
        groups: [
            'side_effect_style',
            'side_effect',
            ['builtin', 'external', 'type-builtin', 'type-external'],
            ['internal', 'type-internal', 'parent', 'type-parent', 'sibling', 'type-sibling', 'index', 'type-index'],
            'unknown',
        ],
        internalPattern: ['@/'],
    },
    sortTailwindcss: {
        functions: ['clsx', 'cn', 'tv'],
    },
    sortPackageJson: false,
    ignorePatterns: ['**/generated/**', '**/CHANGELOG.md', 'pnpm-lock.yaml'],
};

const baseRules = {
    'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
    'no-unused-expressions': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-unused-vars': [
        'error',
        {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
        },
    ],
    'typescript/no-explicit-any': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-empty-object-type': 'error',
    'react/rules-of-hooks': 'error',
    'react/exhaustive-deps': 'warn',
    'react/only-export-components': ['warn', { allowConstantExport: true }],
    // Lar apps don't run the React Compiler, so libraries it can't memoize (TanStack Virtual) are fine.
    'react/incompatible-library': 'off',
    'lar/padding-lines': 'error',
};

/** Globs under an app's root; `.` is the repository root itself. */
const under = (root, glob) => (root === '.' ? glob : `${root}/${glob}`);
const sourceFiles = (root) => [under(root, 'src/**/*.ts'), under(root, 'src/**/*.tsx')];

/**
 * Oxlint settings for a repository.
 *
 * @param {object} options
 * @param {string[]} [options.apps] Each app's root, relative to the repository root (`.`, `web`, `apps/web`).
 *   Its `src` follows Lar's layers (app, features, shared, services) and holds no visual recipes.
 * @param {string[]} [options.designSystems] The roots of design-system packages, which own every visual recipe.
 * @param {string[]} [options.ignorePatterns] Extra paths to skip, such as generated API clients.
 */
export function lint({ apps = [], designSystems = [], ignorePatterns = [] } = {}) {
    return {
        plugins: ['typescript', 'react', 'unicorn', 'oxc', 'import', 'vitest'],
        jsPlugins: ['@lar-works/config/lint-plugin'],
        categories: { correctness: 'error' },
        env: { browser: true, es2024: true },
        ignorePatterns: ['**/dist/**', '**/storybook-static/**', '**/coverage/**', ...ignorePatterns],
        options: { typeAware: true, typeCheck: true },
        rules: baseRules,
        overrides: [
            ...apps.map((app) => ({
                files: sourceFiles(app),
                rules: {
                    'lar/boundaries': ['error', { role: 'app' }],
                    'lar/no-visual-recipes': 'error',
                },
            })),
            ...apps.map((app) => ({
                files: [under(app, 'src/app/**/*.tsx'), under(app, 'src/features/**/*.tsx')],
                rules: { 'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }] },
            })),
            ...designSystems.map((designSystem) => ({
                files: sourceFiles(designSystem),
                rules: { 'lar/boundaries': ['error', { role: 'design-system' }] },
            })),
            {
                files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.mjs', '**/test/**', '**/*.stories.tsx'],
                rules: {
                    'max-lines': 'off',
                    'react/only-export-components': 'off',
                    'vitest/require-mock-type-parameters': 'off',
                    'vitest/no-conditional-expect': 'off',
                },
            },
        ],
    };
}

/** Test settings every package's `test` block spreads: logs only from failing tests, no performance hints. */
export const test = {
    silent: 'passed-only',
    experimental: { diagnostics: false },
};
