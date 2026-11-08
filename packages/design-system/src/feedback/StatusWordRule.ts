/** Words that name a state: a thing's condition, which StatusIndicator shows as its light and a neutral word. */
const STATE_WORDS = [
    'active',
    'available',
    'blocked',
    'checking',
    'closed',
    'confirming',
    'connected',
    'degraded',
    'disabled',
    'disconnected',
    'done',
    'enabled',
    'error',
    'failed',
    'healthy',
    'inactive',
    'installed',
    'live',
    'may have started',
    'merged',
    'missing',
    'off',
    'offline',
    'on',
    'online',
    'paused',
    'pending',
    'problem',
    'queued',
    'ready',
    'reachable',
    'running',
    'source missing',
    'started',
    'stopped',
    'unavailable',
    'unknown',
    'unreachable',
    'up to date',
    'waiting',
];

const stateWord = new RegExp(`^(?:${STATE_WORDS.join('|')})(?![\\w-])`, 'i');

/**
 * The status-word rule: a state (Merged, Failed, Unavailable, On, Problem…) is StatusIndicator's light and a neutral
 * word, never a tinted Badge or a word in a tone's text colour; a tone badge is for a verdict or a category ("Worth
 * fixing", "Serious", "Probably this one"). Finds, in the given sources (path → source text), each Badge (or
 * BadgeBase) with a status `tone` and each element with a tone's `text-…-fg` class whose literal text starts with a
 * state word, as `path:line`. Words that come from translations aren't seen: the rule in docs/Introduction.mdx holds
 * for them too.
 *
 * Apps run it over their own sources in a test, beside problemBodyViolations:
 *
 *     expect(statusWordViolations(sources)).toEqual([]);
 */
export function statusWordViolations(sources: Record<string, string>): string[] {
    const violations: string[] = [];

    for (const [path, source] of Object.entries(sources)) {
        // An opening tag through its attributes (including JSX expressions), then its literal text up to the next tag.
        for (const match of source.matchAll(/<([A-Za-z]+)\b((?:[^>]|=>)*?)>([^<{]*)/g)) {
            const [, tag = '', attributes = '', text = ''] = match;
            const tinted =
                ((tag === 'Badge' || tag === 'BadgeBase') &&
                    /tone=['"](?:danger|warning|success|info|accent)['"]/.test(attributes)) ||
                /(?:^|[\s'"`])text-(?:danger|warning|success|info)-fg\b/.test(attributes);

            if (tinted && stateWord.test(text.trim()))
                violations.push(`${path}:${source.slice(0, match.index).split('\n').length}`);
        }
    }

    return violations;
}
