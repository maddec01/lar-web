import type { ReactNode } from 'react';

import { StackBase } from '../layout/Flow';
import { Heading, Text } from '../typography/Typography';
import { Badge } from './Badge';

interface IdentityProps {
    /** The cover, poster or picture, framed small beside the title. */
    artwork: ReactNode;
    /** One line of facts under the title, such as "1977 · 12 tracks". */
    detail?: string;
    /** A short badge after the facts, such as a format. */
    tag?: string;
    /** What it is, such as an album's title. */
    title?: ReactNode;
    /** The artwork's frame: `square` (the default) for a cover or a logo, `poster` (2:3) for a portrait image. */
    presentation?: 'square' | 'poster';
    /** Heads its page: a larger poster, an overline naming what it belongs to, and the title as the page's h1. */
    overline?: string;
}

/** A compact "what is this" strip: small framed artwork beside a title, one line of facts, and an optional tag. */
export function Identity({ artwork, detail, tag, title, overline, presentation = 'square' }: IdentityProps) {
    const heading = overline !== undefined;

    return (
        <div className={`flex min-w-0 items-center ${heading ? 'gap-6' : 'gap-4'}`}>
            <div
                className={`${presentation === 'poster' ? `${heading ? 'w-24' : 'w-16'} aspect-[2/3]` : 'size-16'} ring-fg/10 shrink-0 overflow-hidden rounded-lg shadow-(--shadow-raised) ring-1`}
            >
                {artwork}
            </div>
            <StackBase space="tight" className="min-w-0 flex-1">
                {heading ? (
                    <Text variant="overline" tone="muted" truncate>
                        {overline}
                    </Text>
                ) : null}
                {title && heading ? (
                    <Heading as="h1" variant="page">
                        {title}
                    </Heading>
                ) : title ? (
                    <Text as="span" truncate variant="label">
                        {title}
                    </Text>
                ) : null}
                {detail ? (
                    <Text as="span" truncate title={detail} tone="muted">
                        {detail}
                    </Text>
                ) : null}
                {tag ? (
                    <div className="mt-1 flex">
                        <Badge tone="neutral">{tag}</Badge>
                    </div>
                ) : null}
            </StackBase>
        </div>
    );
}
