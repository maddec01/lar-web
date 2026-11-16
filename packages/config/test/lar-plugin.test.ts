import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vite-plus/test';

import plugin from '../src/plugins/lar.js';

/** The plugin is plain JavaScript, so its rules' literal types widen; they match Oxlint's rule shape at runtime. */
const rules = plugin.rules as unknown as Record<keyof typeof plugin.rules, Parameters<RuleTester['run']>[1]>;

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester();
const app = (file: string) => `/repo/web/src/${file}`;

tester.run('boundaries', rules.boundaries, {
    valid: [{ code: "import { Button } from '@lar-works/design-system';", filename: app('features/home/Home.tsx') }],
    invalid: [
        {
            code: "import { Player } from '@/features/music/Player';",
            filename: app('features/home/Home.tsx'),
            errors: [{ message: 'Cross-feature consumers must use the feature public API.' }],
        },
    ],
});

tester.run('no-visual-recipes', rules['no-visual-recipes'], {
    valid: [
        {
            code: 'import { Button } from \'@lar-works/design-system\'; export const A = () => <Button size="sm" />;',
            filename: app('features/home/A.tsx'),
        },
    ],
    invalid: [
        {
            code: 'export const A = () => <Row className="flex" />;',
            filename: app('features/home/A.tsx'),
            errors: [{ messageId: 'className' }],
        },
    ],
});

tester.run('no-raw-colours', rules['no-raw-colours'], {
    valid: ['export const a = "bg-surface text-fg-muted gap-2 px-[calc(--spacing(3)+1px)]";'],
    invalid: [{ code: 'export const a = "bg-[#0a0a0a] p-2";', errors: 1 }],
});

tester.run('padding-lines', rules['padding-lines'], {
    valid: ['function f() {\n    const a = 1;\n\n    return a;\n}'],
    invalid: [
        {
            code: 'function f() {\n    const a = 1;\n    return a;\n}',
            output: 'function f() {\n    const a = 1;\n\n    return a;\n}',
            errors: 1,
        },
    ],
});
