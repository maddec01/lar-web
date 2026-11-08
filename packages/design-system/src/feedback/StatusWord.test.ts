import { expect, it } from 'vite-plus/test';

import { statusWordViolations } from './StatusWordRule';

const sources = import.meta.glob<string>(['../**/*.tsx', '!../**/*.test.tsx'], {
    query: '?raw',
    import: 'default',
    eager: true,
});

it('draws every state as a light and a neutral word, in the design system and its stories', () => {
    expect(statusWordViolations(sources)).toEqual([]);
});

it('names each tinted state by file and line, and leaves verdicts and categories their tone', () => {
    expect(
        statusWordViolations({
            'Bad.tsx': [
                '<Badge tone="success">Merged</Badge>',
                '<Badge tone="warning">On, confirming</Badge>',
                '<span className="text-danger-fg font-medium">Failed</span>',
            ].join('\n'),
            'Good.tsx': [
                '<Badge tone="warning">Worth fixing</Badge>',
                '<Badge tone="danger">Serious</Badge>',
                '<Badge>Online</Badge>',
                '<StatusIndicator state="ready" label="Merged" />',
                '<Badge tone="success">Onboarding</Badge>',
            ].join('\n'),
        }),
    ).toEqual(['Bad.tsx:1', 'Bad.tsx:2', 'Bad.tsx:3']);
});
