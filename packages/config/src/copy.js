/** Check nested UI locale strings. Pass English copy; non-English locales only check typography.
 * Exceptions are explicit paths for quotations or third-party names, never broad regular expressions. */
export function checkUiCopy(strings, { locale = 'en', ignorePaths = [] } = {}) {
    const issues = [];
    const english = /^en(?:-|$)/i.test(locale);
    const contractions =
        /\b(could not|can not|is not|are not|was not|were not|does not|do not|did not|will not|would not|has not|have not|must not|should not|unable to)\b|\bcannot\b(?! be undone)/i;
    const visit = (value, path) => {
        if (ignorePaths.includes(path)) return;

        if (typeof value === 'string') {
            const add = (rule, message) => issues.push({ path, rule, message, value });

            if (/[\p{L}\p{N}]'[\p{L}\p{N}]|\b'(?=\d{2}\b)/u.test(value))
                add('apostrophe', 'Use the curly apostrophe ’ in UI copy.');

            if (!english) return;

            if (contractions.test(value)) add('contraction', 'Use a contraction in product copy.');

            if (/^Retry[.!]?$/i.test(value)) add('retry', 'Use “Try again”.');

            if (/^(?:No .+ found[.!]?|Nothing (?:here )?matches[.!]|No .+ match(?:es)?[.!]?)$/i.test(value))
                add('empty-search', 'Use “Nothing matches”, with a “Clear search” action.');

            if (/^No (?!.+ yet[.!]?$).+ (?:available|exist)[.!]?$/i.test(value))
                add('empty-state', 'Use “No {things} yet” when nothing exists.');

            if (/^(?:This page (?:isn’t|isn't) here|Page not found|404)\.$/i.test(value))
                add('404-heading', '404 headings have no trailing full stop.');

            return;
        }

        if (Array.isArray(value)) value.forEach((entry, index) => visit(entry, `${path}[${index}]`));
        else if (value && typeof value === 'object')
            Object.entries(value).forEach(([key, entry]) => visit(entry, path ? `${path}.${key}` : key));
    };

    visit(strings, '');

    return issues;
}
