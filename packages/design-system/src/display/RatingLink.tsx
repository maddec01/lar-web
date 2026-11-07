import { CheckIcon } from 'lucide-react';

import { Link } from '../typography/Link';
import { Text } from '../typography/Typography';

/** The sources' own marks and colors, as the Apple apps draw them. Anything else reads by its name. */
function ratingMark(source: string) {
    switch (source.trim().toLowerCase()) {
        case 'trakt':
            return {
                name: 'Trakt',
                label: 'Trakt',
                mark: (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#ed1c24] text-white [&>svg]:size-3 [&>svg]:stroke-[3]">
                        <CheckIcon />
                    </span>
                ),
            };
        case 'imdb':
            return {
                name: 'IMDb',
                mark: (
                    <span className="inline-flex h-5 items-center rounded-sm bg-[#f5c518] px-1 text-xs font-black text-black">
                        IMDb
                    </span>
                ),
            };
        case 'rotten tomatoes critics':
            return { name: 'Tomatometer', mark: <span>🍅</span> };
        case 'rotten tomatoes audience':
            return { name: 'Popcornmeter', mark: <span>🍿</span> };
        default:
            return { name: source, label: source, mark: null };
    }
}

/** A provider's mark and its score, linked to the original rating. */
export function RatingLink({
    source,
    value,
    scale,
    href,
}: {
    source: string;
    /** The score as it reads, such as "6.5" or "57%". */
    value: string;
    /** The scale shown after the score, such as "/ 10"; none for percentages. */
    scale?: string;
    href: string;
}) {
    const { name, label, mark } = ratingMark(source);

    return (
        <Link
            href={href}
            external
            aria-label={[name, value, scale].filter(Boolean).join(' ')}
            className="max-w-full gap-1.5"
        >
            {mark ? <span aria-hidden="true">{mark}</span> : null}
            {label ? (
                <Text as="span" variant="caption" aria-hidden="true">
                    {label}
                </Text>
            ) : null}
            <Text as="span" variant="label" className="tabular-nums">
                {value}
            </Text>
            {scale ? (
                <Text as="span" variant="caption" tone="muted" className="tabular-nums">
                    {scale}
                </Text>
            ) : null}
        </Link>
    );
}
