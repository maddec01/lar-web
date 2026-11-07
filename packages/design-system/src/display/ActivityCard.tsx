import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Inline, Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';

interface ActivityCardProps {
    loading?: boolean;
    /** Cover, poster, or icon; the card gives it a fixed square to fill. */
    artwork: ReactNode;
    badges?: ReactNode;
    /** A dense row of artwork and title with one subtitle, without the card chrome, detail, or badges. */
    compact?: boolean;
    detail?: string;
    subtitle?: string;
    title: string;
}

/** One thing happening on the server, whatever the media type: what it is, who has it, and how. */
export function ActivityCard({
    artwork,
    badges,
    compact = false,
    detail,
    subtitle,
    title,
    loading = false,
}: ActivityCardProps) {
    return (
        <article
            className={`flex min-w-0 items-center ${compact ? 'gap-3 rounded-lg p-2' : 'border-base-300 bg-base-100 gap-4 rounded-xl border p-3 shadow-xs'}`}
        >
            <div className={`shrink-0 ${compact ? 'size-10' : 'size-20'}`}>{artwork}</div>
            <Stack space="tight" className="min-w-0 flex-1">
                <Stack space="none" className="min-w-0">
                    <Text as="span" variant="label" truncate title={title} loading={loading}>
                        {title}
                    </Text>
                    {Object.entries(compact ? { subtitle } : { subtitle, detail }).map(([key, line]) =>
                        line ? (
                            <Text
                                key={key}
                                as="span"
                                variant="caption"
                                tone="muted"
                                truncate
                                title={line}
                                loading={loading}
                            >
                                {line}
                            </Text>
                        ) : null,
                    )}
                </Stack>
                {!compact && badges ? (
                    <Inline wrap space="tight">
                        {badges}
                    </Inline>
                ) : null}
            </Stack>
        </article>
    );
}

export function ActivityCardSkeleton() {
    return (
        <ActivityCard
            loading
            artwork={<SkeletonLoader.Shape presentation="artwork" />}
            title=""
            subtitle=" "
            detail=" "
            badges={<SkeletonLoader.Shape width="wide" />}
        />
    );
}
