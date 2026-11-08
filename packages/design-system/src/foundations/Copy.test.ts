import { checkUiCopy } from '@lar-works/config';
import { expect, it } from 'vite-plus/test';

import { defaultDesignSystemLabels } from './DesignSystemProvider';

it('uses the shared copy checker for design-system defaults', () => {
    expect(checkUiCopy(defaultDesignSystemLabels)).toEqual([]);
});

it('keeps story UI literals in the same writing contract as app locales', () => {
    const sources = import.meta.glob<string>('../**/*.stories.tsx', { query: '?raw', import: 'default', eager: true });
    const violations: string[] = [];

    for (const [path, source] of Object.entries(sources)) {
        for (const match of source.matchAll(/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|>([^<>{}\n]+)</g)) {
            const value = (match[1] ?? match[0].slice(1, -1)).replaceAll("\\'", "'").trim();

            if (value && !/^(?:https?:|data:|\.\.?\/)/.test(value))
                for (const issue of checkUiCopy(value))
                    violations.push(
                        `${path}:${source.slice(0, match.index).split('\n').length} ${issue.rule}: ${value}`,
                    );
        }
    }

    expect(violations).toEqual([]);
});
