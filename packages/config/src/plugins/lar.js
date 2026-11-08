// Lar's own Oxlint rules. Oxlint loads this file as a JS plugin (`jsPlugins`), so it is plain JavaScript with no
// imports: it runs from whichever repository's node_modules holds it.
//
// lar/boundaries         keeps an app's layers (app, features, shared, services) and the design system apart.
// lar/no-visual-recipes  keeps every visual decision inside the design system: apps compose its components.

import path from 'node:path';

const sourcePath = (filename) => filename.replaceAll(path.sep, '/').split('/src/').slice(1).join('/src/');
const isTest = (filename) => /(?:\.test[.-]|\.stories\.|\/test\/|\/testing\/|-test[.-])/.test(filename);
const isPublicEntry = (rest) => ['', '/index', '/index.ts', '/index.tsx'].includes(rest);

/** Resolves aliases and relative imports, so moving a file cannot bypass the boundaries. */
function importedPath(filename, specifier) {
    if (specifier.startsWith('@/')) return specifier.slice(2);

    if (specifier.startsWith('.')) return sourcePath(path.resolve(path.dirname(filename), specifier));

    return undefined;
}

/** Packages only the design system may use: apps reach them through its public API. */
const designSystemOnly = /^(@ninna-ui\/|lucide-react(\/|$)|@radix-ui\/|@floating-ui\/|tailwind-merge$|clsx$)/;

/** Application state, routing and localization, which design-system components receive as props instead. */
const applicationState = /^(react-i18next|i18next|react-router|react-router-dom|@tanstack\/react-query|zustand)(\/|$)/;

const designSystemPackage = '@lar-works/design-system';

const boundaries = {
    meta: {
        type: 'problem',
        schema: [
            {
                type: 'object',
                properties: { role: { enum: ['app', 'design-system'] } },
                additionalProperties: false,
            },
        ],
        messages: { boundary: '{{reason}}' },
    },
    create(context) {
        const role = context.options[0]?.role ?? 'app';
        const filename = context.filename;
        const source = sourcePath(filename);

        if (!source || isTest(filename)) return {};

        const report = (node, reason) => context.report({ node, messageId: 'boundary', data: { reason } });

        function checkDesignSystem(node, specifier) {
            if (applicationState.test(specifier))
                report(
                    node,
                    'Design-system components receive labels, values and callbacks; they do not own application state, routing or localization.',
                );

            const target = importedPath(filename, specifier);

            if (
                target &&
                /^[^/]+(?:\/index(?:\.tsx?)?)?$/.test(target) &&
                !target.startsWith('index') &&
                ['ImportDeclaration', 'ImportExpression'].includes(node.type)
            )
                report(node, 'Inside the design system, import the owning module directly to avoid barrel cycles.');
        }

        function checkApp(node, specifier) {
            const sourceFeature = source.match(/^features\/([^/]+)\//)?.[1];
            const target = importedPath(filename, specifier);

            if (!target) {
                if (designSystemOnly.test(specifier))
                    report(
                        node,
                        `Use the ${designSystemPackage} public API; only the design system uses ${specifier}.`,
                    );

                if (specifier.startsWith(designSystemPackage) && source.startsWith('services/'))
                    report(node, 'Services own data access and server state, never UI.');

                return;
            }

            if (source.startsWith('shared/') && /^(app|features|services)\//.test(target))
                report(node, 'Shared foundations cannot depend on application, features or services.');

            if (source.startsWith('services/') && /^(app|features)\//.test(target))
                report(node, 'Services own data access and server state, never UI.');

            if (sourceFeature && target.startsWith('app/'))
                report(node, 'Features cannot depend on the application composition root.');

            const targetFeature = target.match(/^features\/([^/]+)(.*)$/);

            if (targetFeature && sourceFeature !== targetFeature[1] && !isPublicEntry(targetFeature[2]))
                report(node, 'Cross-feature consumers must use the feature public API.');

            if (targetFeature && sourceFeature === targetFeature[1] && isPublicEntry(targetFeature[2]))
                report(node, 'Inside a feature, import the owning module directly to avoid barrel cycles.');

            if (target.startsWith('test/') || /\.test[.-]|-test[.-]/.test(target))
                report(node, 'Test support must not enter the application dependency graph.');
        }

        function check(node) {
            const specifier = node.source?.value;

            if (typeof specifier !== 'string') return;

            if (role === 'design-system') checkDesignSystem(node, specifier);
            else checkApp(node, specifier);
        }

        return {
            ImportDeclaration: check,
            ImportExpression: check,
            ExportNamedDeclaration: check,
            ExportAllDeclaration: check,
        };
    },
};

const rawElements = /^(h1|h2|h3|h4|h5|h6|p|button|input|select|textarea|svg)$/;

/** Design-system components whose geometry and colour props are looks: apps pick a named recipe instead. */
const recipeComponents =
    /^(Text|Heading|Link|Button|IconButton|Badge|Stack|Inline|Grid|Avatar|Loading|StatusIndicator|Alert)$/;
const lookProps = /^(size|color|weight|gap|radius|minChildWidth|fontSize|lineHeight|letterSpacing)$/;

/** Form controls, whose styling and geometry the design system owns entirely. */
const formControls = /^(Input|Select|Field|FormField|Textarea)$/;
const formLookProps = /^(fullWidth|size|variant|color)$/;

const noVisualRecipes = {
    meta: {
        type: 'problem',
        schema: [],
        messages: {
            className:
                'Visual recipes belong in the design system, not application code. Use or add a component there.',
            style: 'Inline styles belong in the design system. Use or add a component there.',
            element:
                'Use the design-system component for <{{name}}> so typography, accessibility, styling and loading stay consistent.',
            lookProp:
                'Choose a semantic recipe instead of `{{prop}}`: typography, geometry, colour and spacing belong to the design system.',
        },
    },
    create(context) {
        if (isTest(context.filename)) return {};

        /** The local names this file imports from the design system; only their props are checked. */
        const designSystemNames = new Set();

        return {
            ImportDeclaration(node) {
                if (typeof node.source.value !== 'string' || !node.source.value.startsWith(designSystemPackage)) return;

                for (const specifier of node.specifiers) designSystemNames.add(specifier.local.name);
            },
            JSXAttribute(node) {
                const name = node.name?.name;
                const element = node.parent?.name;

                if (name === 'className') context.report({ node, messageId: 'className' });
                else if (name === 'style') context.report({ node, messageId: 'style' });
                else if (
                    element?.type === 'JSXIdentifier' &&
                    designSystemNames.has(element.name) &&
                    typeof name === 'string' &&
                    ((recipeComponents.test(element.name) &&
                        lookProps.test(name) &&
                        !(
                            name === 'size' &&
                            /^(Button|IconButton|Avatar|Loading|StatusIndicator|Alert)$/.test(element.name)
                        )) ||
                        (formControls.test(element.name) && formLookProps.test(name)))
                )
                    context.report({ node, messageId: 'lookProp', data: { prop: name } });
            },
            JSXOpeningElement(node) {
                if (node.name?.type === 'JSXIdentifier' && rawElements.test(node.name.name))
                    context.report({ node, messageId: 'element', data: { name: node.name.name } });
            },
        };
    },
};

const blocks = new Set(['ClassDeclaration', 'IfStatement', 'WhileStatement', 'SwitchStatement', 'TryStatement']);

/** The statement kinds ESLint's padding-line-between-statements names, for the ones Lar's rule uses. */
function kind(node) {
    if (node.type === 'ExpressionStatement' && typeof node.directive === 'string') return 'directive';

    if (node.type === 'ImportDeclaration') return 'import';

    if (node.type === 'VariableDeclaration') return 'variable';

    if (node.type === 'ReturnStatement') return 'return';

    if (node.type === 'FunctionDeclaration' || blocks.has(node.type)) return 'block';

    return 'other';
}

/** Whether a blank line must, may or need not separate two statements: the last matching row wins, as in ESLint. */
function padding(prev, next) {
    let result = 'any';

    if (prev === 'directive') result = next === 'directive' ? 'any' : 'always';

    if (prev === 'import') result = next === 'import' ? 'any' : 'always';

    if (next === 'variable' || prev === 'variable') result = 'always';

    if (prev === 'variable' && next === 'variable') result = 'any';

    if (next === 'block' || prev === 'block') result = 'always';

    if (next === 'return') result = 'always';

    return result;
}

const range = (node) => node.range ?? [node.start, node.end];

/**
 * Lar's blank lines between statements, which Prettier and Oxfmt leave alone: after directives and imports, around
 * variable declarations, around blocks (class, function, if, while, switch, try) and before a return.
 */
const paddingLines = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        messages: { expected: 'Expected a blank line before this statement.' },
    },
    create(context) {
        const text = context.sourceCode.text;

        function checkList(statements) {
            for (let index = 1; index < statements.length; index += 1) {
                const prev = statements[index - 1];
                const next = statements[index];

                if (padding(kind(prev), kind(next)) !== 'always') continue;

                const between = text.slice(range(prev)[1], range(next)[0]);

                if (/\n[ \t]*\r?\n/.test(between)) continue;

                context.report({
                    node: next,
                    messageId: 'expected',
                    fix(fixer) {
                        const lineEnd = text.indexOf('\n', range(prev)[1]);

                        if (lineEnd === -1 || lineEnd > range(next)[0]) return null;

                        return fixer.insertTextAfterRange([lineEnd, lineEnd], '\n');
                    },
                });
            }
        }

        return {
            Program: (node) => checkList(node.body),
            BlockStatement: (node) => checkList(node.body),
            StaticBlock: (node) => checkList(node.body),
            SwitchCase: (node) => checkList(node.consequent),
        };
    },
};

export default {
    meta: { name: 'lar' },
    rules: { boundaries, 'no-visual-recipes': noVisualRecipes, 'padding-lines': paddingLines },
};
