/* oxlint-disable react/only-export-components -- Compound members are exported through DataRow. */
import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { LinkBoxBase } from '../typography/Link';
import { TextBase } from '../typography/Typography';

function DataRowRoot({
    children,
    interactive,
    rowIndex,
}: {
    /** The row's cells. */
    children: ReactNode;
    /** The row opens something: it highlights under the pointer and with focus inside. */
    interactive?: boolean;
    /** The row's 1-based position in the whole table, for screen readers in a virtual list. */
    rowIndex: number;
}) {
    return (
        <LinkBoxBase
            role="row"
            aria-rowindex={rowIndex}
            className={`group group/media-item border-line/60 grid h-full min-w-0 grid-cols-(--lar-list-columns) items-center gap-4 border-b px-3 transition-colors motion-reduce:transition-none ${interactive ? 'hover:bg-surface-raised focus-within:bg-surface-raised' : ''}`}
        >
            {children}
        </LinkBoxBase>
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
            {artwork ? (
                <span className="size-10 shrink-0 group-data-[density=compact]/list:size-7">{artwork}</span>
            ) : null}
            <span className="min-w-0 flex-1">
                <TextBase
                    as="span"
                    className="block"
                    truncate
                    variant="label"
                    loading={props.loading}
                    title={props.loading ? undefined : props.title}
                >
                    {!props.loading && props.title}
                </TextBase>
                {subtitle ? (
                    <TextBase
                        as="span"
                        className="block"
                        truncate
                        variant="caption"
                        tone="muted"
                        loading={props.loading}
                    >
                        {!props.loading && props.subtitle}
                    </TextBase>
                ) : null}
            </span>
            {!props.loading && props.detail ? (
                <TextBase as="span" className="ml-auto shrink-0" variant="caption" tone="muted">
                    {props.detail}
                </TextBase>
            ) : null}
        </span>
    );
}

export const DataRow = Object.assign(DataRowRoot, {
    Primary: DataRowPrimary,
});
