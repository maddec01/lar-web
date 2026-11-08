import { expect, it } from 'vite-plus/test';

import { problemBodyViolations } from './ProblemBodyRule';

const sources = import.meta.glob<string>(['../**/*.tsx', '!../**/*.test.tsx', '!../**/*.stories.tsx'], {
    query: '?raw',
    import: 'default',
    eager: true,
});

it('keeps explanatory paragraphs and Text body/captions neutral; tone belongs to icons, edges and status labels', () => {
    expect(problemBodyViolations(sources)).toEqual([]);
});

it('names each coloured explanation by file and line, and leaves status labels their tone', () => {
    expect(
        problemBodyViolations({
            'Bad.tsx':
                'const a = 1;\n<Text tone="danger">The folder is gone.</Text>\n<p className="text-warning-fg">x</p>',
            'Good.tsx': '<Text variant="label" tone="danger">Failed</Text>\n<Text tone="muted">Fine.</Text>',
        }),
    ).toEqual(['Bad.tsx:2', 'Bad.tsx:3']);
});
