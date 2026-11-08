import { CheckIcon } from 'lucide-react';

import { LinkBase } from '../typography/Link';
import { Text, TextBase } from '../typography/Typography';

/** The sources' own marks and colors, as the Apple apps draw them. Anything else reads by its name. */
function ratingMark(source: string) {
    switch (source.trim().toLowerCase()) {
        case 'trakt':
            return {
                name: 'Trakt',
                label: 'Trakt',
                mark: (
                    <span className="bg-brand-trakt text-brand-trakt-ink inline-flex size-5 items-center justify-center rounded-full [&>svg]:size-3 [&>svg]:stroke-[3]">
                        <CheckIcon />
                    </span>
                ),
            };
        case 'imdb':
            return {
                name: 'IMDb',
                mark: (
                    <span className="bg-brand-imdb text-brand-imdb-ink inline-flex h-5 items-center rounded-sm px-1 text-xs font-black">
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
    /** The rating's provider, such as `imdb` or `trakt`, which picks its mark. */
    source: string;
    /** The score as it reads, such as "6.5" or "57%". */
    value: string;
    /** The scale shown after the score, such as "/ 10"; none for percentages. */
    scale?: string;
    /** The provider's page for the rating. */
    href: string;
}) {
    const { name, label, mark } = ratingMark(source);

    return (
        // One link for the whole cluster: no underline at rest, so mark, score and scale read as one rating.
        <LinkBase href={href} external tone="default" className="max-w-full gap-1.5">
            {mark ? <span aria-hidden="true">{mark}</span> : null}
            {!label ? <span className="sr-only">{name} </span> : null}
            {label ? (
                <Text as="span" variant="caption">
                    {label}
                </Text>
            ) : null}{' '}
            <TextBase as="span" variant="label" className="tabular-nums">
                {value}
            </TextBase>{' '}
            {scale ? (
                <TextBase as="span" variant="caption" tone="muted" className="tabular-nums">
                    {scale}
                </TextBase>
            ) : null}
        </LinkBase>
    );
}
