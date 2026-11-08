import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vite-plus/test';

import plugin from '../src/plugins/lar.js';

/** The plugin is plain JavaScript, so its rules' literal types widen; they match Oxlint's rule shape at runtime. */
const rules = plugin.rules as unknown as Record<keyof typeof plugin.rules, Parameters<RuleTester['run']>[1]>;

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester();
const app = (file: string) => `/repo/web/src/${file}`;
const designSystem = (file: string) => `/repo/packages/design-system/src/${file}`;

tester.run('boundaries', rules.boundaries, {
    valid: [
        { code: "import { Button } from '@lar-works/design-system';", filename: app('features/home/Home.tsx') },
        { code: "import { HomePage } from '@/features/home';", filename: app('app/AppRoutes.tsx') },
        { code: "import { routes } from '@/shared/routing/routes';", filename: app('features/home/Home.tsx') },
        {
            code: "import { Button } from '@ninna-ui/primitives';",
            filename: designSystem('actions/Button.tsx'),
            options: [{ role: 'design-system' }],
        },
        {
            code: "import { XIcon } from 'lucide-react';",
            filename: designSystem('overlays/Modal.tsx'),
            options: [{ role: 'design-system' }],
        },
        {
            code: "import { Input } from '../forms/Input';",
            filename: designSystem('overlays/Modal.tsx'),
            options: [{ role: 'design-system' }],
        },
        { code: "import { useQuery } from '@tanstack/react-query';", filename: app('services/music/music.hooks.ts') },
        { code: "import { XIcon } from 'lucide-react';", filename: app('features/home/Home.test.tsx') },
    ],
    invalid: [
        {
            code: "import { XIcon } from 'lucide-react';",
            filename: app('features/home/Home.tsx'),
            errors: [{ message: /Use the @lar-works\/design-system public API/ }],
        },
        {
            code: "import { Button } from '@ninna-ui/primitives';",
            filename: app('features/home/Home.tsx'),
            errors: 1,
        },
        {
            code: "import { Button } from '@lar-works/design-system';",
            filename: app('services/music/music.service.ts'),
            errors: [{ message: 'Services own data access and server state, never UI.' }],
        },
        {
            code: "import { AppLayout } from '@/app/shell/AppLayout';",
            filename: app('features/home/Home.tsx'),
            errors: [{ message: 'Features cannot depend on the application composition root.' }],
        },
        {
            code: "import { Player } from '@/features/music/Player';",
            filename: app('features/home/Home.tsx'),
            errors: [{ message: 'Cross-feature consumers must use the feature public API.' }],
        },
        {
            code: "import { Home } from '.';",
            filename: app('features/home/HomePage.tsx'),
            errors: [{ message: 'Inside a feature, import the owning module directly to avoid barrel cycles.' }],
        },
        {
            code: "import { session } from '@/services/auth';",
            filename: app('shared/routing/routes.ts'),
            errors: [{ message: 'Shared foundations cannot depend on application, features or services.' }],
        },
        {
            code: "import { useTranslation } from 'react-i18next';",
            filename: designSystem('overlays/Modal.tsx'),
            options: [{ role: 'design-system' }],
            errors: 1,
        },
        {
            code: "import { Input } from '../forms';",
            filename: designSystem('overlays/Modal.tsx'),
            options: [{ role: 'design-system' }],
            errors: [
                { message: 'Inside the design system, import the owning module directly to avoid barrel cycles.' },
            ],
        },
    ],
});

tester.run('no-visual-recipes', rules['no-visual-recipes'], {
    valid: [
        {
            code: 'import { Button } from \'@lar-works/design-system\'; export const A = () => <Button size="sm" />;',
            filename: app('features/home/A.tsx'),
        },
        {
            code: 'import { Alert } from \'@lar-works/design-system\'; export const A = () => <Alert size="sm" message="Try again." />;',
            filename: app('features/home/A.tsx'),
        },
        {
            code: 'import { Text } from \'@lar-works/design-system\';\nexport const A = () => <Text variant="lead">Hi</Text>;',
            filename: app('features/home/A.tsx'),
        },
        { code: 'export const A = ({ size }) => <Row size={size} />;', filename: app('features/home/A.tsx') },
        { code: 'export const A = () => <p className="x" />;', filename: app('features/home/A.test.tsx') },
    ],
    invalid: [
        {
            code: 'export const A = () => <Row className="flex" />;',
            filename: app('features/home/A.tsx'),
            errors: [{ messageId: 'className' }],
        },
        {
            code: 'export const A = () => <Row style={{}} />;',
            filename: app('features/home/A.tsx'),
            errors: [{ messageId: 'style' }],
        },
        {
            code: 'export const A = () => <button />;',
            filename: app('features/home/A.tsx'),
            errors: [{ messageId: 'element' }],
        },
        {
            code: 'import { Text } from \'@lar-works/design-system\';\nexport const A = () => <Text size="sm" />;',
            filename: app('features/home/A.tsx'),
            errors: [{ messageId: 'lookProp' }],
        },
        {
            code: 'import { Input } from \'@lar-works/design-system\';\nexport const A = () => <Input variant="filled" />;',
            filename: app('features/home/A.tsx'),
            errors: [{ messageId: 'lookProp' }],
        },
    ],
});

tester.run('padding-lines', rules['padding-lines'], {
    valid: [
        "import a from 'a';\nimport b from 'b';\n\nconst c = a;\nconst d = b;\n\nexport { c, d };",
        'function f() {\n    const a = 1;\n\n    return a;\n}',
        'function f(a) {\n    if (a) return 1;\n\n    return 2;\n}',
    ],
    invalid: [
        {
            code: "import a from 'a';\nconst c = a;",
            output: "import a from 'a';\n\nconst c = a;",
            errors: 1,
        },
        {
            code: 'function f() {\n    const a = 1;\n    return a;\n}',
            output: 'function f() {\n    const a = 1;\n\n    return a;\n}',
            errors: 1,
        },
        {
            code: 'function f(a) {\n    g();\n    if (a) g();\n}',
            output: 'function f(a) {\n    g();\n\n    if (a) g();\n}',
            errors: 1,
        },
    ],
});
