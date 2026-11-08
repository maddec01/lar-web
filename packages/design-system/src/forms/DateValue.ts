function isoParts(value: string) {
    if (!/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return undefined;

    const [year = 0, month, day] = value.split('-').map(Number);
    const date = new Date(0);

    date.setUTCFullYear(year, (month ?? 1) - 1, day ?? 1);
    date.setUTCHours(12, 0, 0, 0);

    return year >= 1 &&
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === (month ?? 1) - 1 &&
        date.getUTCDate() === (day ?? 1)
        ? { date, month, day }
        : undefined;
}

/** Display a partial ISO date without inventing a month or day, in UTC to avoid date shifts. */
export function formatDateField(value: string, locale?: string): string {
    const parts = isoParts(value);

    if (!parts) return value;

    if (!parts.month) return value;

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        ...(parts.day ? { day: '2-digit' } : {}),
        timeZone: 'UTC',
    })
        .formatToParts(parts.date)
        .map((part) => (part.type === 'year' ? value.slice(0, 4) : part.value))
        .join('');
}

/** An ISO date at its known precision as the long date pages show, in the locale's words: "January 10, 2021",
 *  "January 2021" or "2021" (en-US); never inventing a month or day, in UTC to avoid date shifts. Anything that isn't
 *  such a date comes back as given. */
export function formatDateLong(value: string, locale?: string): string {
    const parts = isoParts(value);

    if (!parts?.month) return value;

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        ...(parts.day ? { day: 'numeric' } : {}),
        timeZone: 'UTC',
    })
        .formatToParts(parts.date)
        .map((part) => (part.type === 'year' ? value.slice(0, 4).replace(/^0+(?=\d{2})/, '') : part.value))
        .join('');
}

/** Accept ISO dates and numeric dates in the locale’s order, preserving their precision. */
export function parseDateField(value: string, locale?: string): string | undefined {
    const trimmed = value.trim();

    if (!trimmed) return '';

    if (isoParts(trimmed)) return trimmed;

    const numbers = trimmed.match(/\d+/g);

    if (!numbers || numbers.length < 2 || numbers.length > 3 || /[^\d\s./-]/.test(trimmed)) return undefined;

    const order = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        ...(numbers.length === 3 ? { day: '2-digit' } : {}),
        timeZone: 'UTC',
    })
        .formatToParts(new Date(Date.UTC(2006, 10, 22)))
        .filter(({ type }) => ['year', 'month', 'day'].includes(type));
    const fields = Object.fromEntries(order.map(({ type }, index) => [type, numbers[index]]));

    if (fields.year?.length !== 4) return undefined;

    const iso = [fields.year, fields.month?.padStart(2, '0'), fields.day?.padStart(2, '0')].filter(Boolean).join('-');

    return isoParts(iso) ? iso : undefined;
}
