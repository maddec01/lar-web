/**
 * The problem-body rule: explanatory sentences stay neutral; a problem's tone belongs to its icon, its edge and its
 * short status label. Finds each `<p>` with a tone's text colour and each `Text`/`TextBase` body or caption with a
 * status `tone` in the given sources (path → source text), as `path:line`. Short status labels (`variant="label"`,
 * `overline` or `metric`) keep their tone.
 *
 * Apps run it over their own sources in a test:
 *
 *     const sources = import.meta.glob<string>(['./**\/*.tsx', '!./**\/*.test.tsx'], { query: '?raw', import: 'default', eager: true });
 *     expect(problemBodyViolations(sources)).toEqual([]);
 */
export function problemBodyViolations(sources: Record<string, string>): string[] {
    const violations: string[] = [];

    for (const [path, source] of Object.entries(sources)) {
        // Match the opening tag through its attributes (including JSX expressions), without crossing its closing tag.
        for (const match of source.matchAll(/<(p|Text|TextBase)\b((?:[^>]|=>)*?)>/g)) {
            const [, tag, attributes = ''] = match;
            const statusLabel = /variant=['"](?:label|overline|metric)['"]/.test(attributes);
            const coloured =
                tag === 'p'
                    ? /(?:^|[\s'"`])text-(?:danger|warning|success|info)(?:-fg)?\b/.test(attributes)
                    : !statusLabel && /tone=['"](?:danger|warning|success|info)['"]/.test(attributes);

            if (coloured) violations.push(`${path}:${source.slice(0, match.index).split('\n').length}`);
        }
    }

    return violations;
}
