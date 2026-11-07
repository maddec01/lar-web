import type { ReactNode } from 'react';

import { Stack } from '../layout/Flow';
import { Heading, Text } from '../typography/Typography';
import { Badge } from './Badge';

interface IdentityProps {
    artwork: ReactNode;
    detail?: string;
    tag?: string;
    title?: ReactNode;
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
                className={`${presentation === 'poster' ? `${heading ? 'w-24' : 'w-16'} aspect-[2/3]` : 'size-16'} ring-base-900/10 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1`}
            >
                {artwork}
            </div>
            <Stack space="tight" className="min-w-0 flex-1">
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
            </Stack>
        </div>
    );
}
