import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { InlineBase, StackBase } from '../layout/Flow';
import { Text } from '../typography/Typography';

interface ActivityCardProps {
    /** Draws the card as a skeleton while it loads. */
    loading?: boolean;
    /** Cover, poster, or icon; the card gives it a fixed square to fill. */
    artwork: ReactNode;
    /** Badges under the details, such as the stream's quality or "Transcoding". */
    badges?: ReactNode;
    /** `sm` is a dense row of artwork and title with one subtitle, without the card chrome, detail, or badges; `md`
     *  (the default) the full card. */
    size?: 'sm' | 'md';
    /** A muted line under the subtitle, such as the device and the progress. */
    detail?: string;
    /** Who has it or where it is from, such as the user or the artist. */
    subtitle?: string;
    /** What it is, such as the track or the film. */
    title: string;
}

/** One thing happening on the server, whatever the media type: what it is, who has it, and how. */
export function ActivityCard({
    artwork,
    badges,
    size = 'md',
    detail,
    subtitle,
    title,
    loading = false,
}: ActivityCardProps) {
    return (
        <article
            className={`flex min-w-0 items-center ${size === 'sm' ? 'gap-3 rounded-lg p-2' : 'surface-card gap-4 rounded-xl border p-3'}`}
        >
            <div className={`shrink-0 ${size === 'sm' ? 'size-10' : 'size-20'}`}>{artwork}</div>
            <StackBase space="tight" className="min-w-0 flex-1">
                <StackBase space="none" className="min-w-0">
                    <Text as="span" variant="label" truncate title={title} loading={loading}>
                        {title}
                    </Text>
                    {Object.entries(size === 'sm' ? { subtitle } : { subtitle, detail }).map(([key, line]) =>
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
                </StackBase>
                {size !== 'sm' && badges ? (
                    <InlineBase wrap space="tight">
                        {badges}
                    </InlineBase>
                ) : null}
            </StackBase>
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
