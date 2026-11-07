/* oxlint-disable react/only-export-components -- Compound members are exported through DataRow. */
import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { LinkBox } from '../typography/Link';
import { Text } from '../typography/Typography';

function DataRowRoot({
    children,
    interactive,
    rowIndex,
}: {
    children: ReactNode;
    interactive?: boolean;
    rowIndex: number;
}) {
    return (
        <LinkBox
            role="row"
            aria-rowindex={rowIndex}
            className={`group group/media-item border-base-300/60 grid h-full min-w-0 grid-cols-(--lar-list-columns) items-center gap-4 border-b px-3 transition-colors motion-reduce:transition-none ${interactive ? 'hover:bg-base-100 focus-within:bg-base-100' : ''}`}
        >
            {children}
        </LinkBox>
    );
}

type DataRowPrimaryProps =
    | {
          artwork?: ReactNode;
          detail?: ReactNode;
          loading?: false;
          subtitle?: ReactNode;
          title: string;
      }
    | {
          artwork?: boolean;
          loading: true;
          subtitle?: boolean;
      };

function DataRowPrimary(props: DataRowPrimaryProps) {
    const artwork = props.loading
        ? props.artwork !== false && <SkeletonLoader.Shape presentation="artwork" />
        : props.artwork;
    const subtitle = props.loading ? props.subtitle !== false : Boolean(props.subtitle);

    return (
        <span className="flex min-w-0 items-center gap-3">
            {artwork ? <span className="size-10 shrink-0">{artwork}</span> : null}
            <span className="min-w-0 flex-1">
                <Text
                    as="span"
                    className="block"
                    truncate
                    variant="label"
                    loading={props.loading}
                    title={props.loading ? undefined : props.title}
                >
                    {!props.loading && props.title}
                </Text>
                {subtitle ? (
                    <Text as="span" className="block" truncate variant="caption" tone="muted" loading={props.loading}>
                        {!props.loading && props.subtitle}
                    </Text>
                ) : null}
            </span>
            {!props.loading && props.detail ? (
                <Text as="span" className="ml-auto shrink-0" variant="caption" tone="muted">
                    {props.detail}
                </Text>
            ) : null}
        </span>
    );
}

export const DataRow = Object.assign(DataRowRoot, {
    Primary: DataRowPrimary,
});
