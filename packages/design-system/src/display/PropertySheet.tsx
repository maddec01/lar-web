import { ChevronDownIcon } from 'lucide-react';
/* oxlint-disable react/only-export-components -- Compound members are exported through PropertySheet. */
import { type ReactNode, useId } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { SectionTitle } from '../layout/SectionTitle';
import { Text, TextBase } from '../typography/Typography';
import { BadgeList, type BadgeListItem } from './BadgeList';
import { InsetPanel } from './InsetPanel';

type PropertySheetProps = {
    /** The sheet's title, such as "File" or "Appears on". */
    title: string;
    /** The title's heading level: `h2` (the default) on a page, lower inside a section. */
    level?: 'h2' | 'h3' | 'h4';
    /** How many items the sheet lists, shown after the title in the shared quiet count. */
    count?: number;
    /** Says what `count` counts for screen readers, such as "3 titles". */
    countLabel?: string;
} & (
    | {
          /** The body: PropertySheet.Rows, .Tags, .Note or .Table. */
          children: ReactNode;
          loading?: false;
          loadingLabel?: never;
      }
    | {
          children?: never;
          /** Draws three skeleton rows while the facts load. */
          loading: true;
          /** Names what is loading for screen readers; without it the skeleton is hidden from them. */
          loadingLabel?: string;
      }
);

/** A titled sheet of facts about one thing; the body is label/value rows, a row of tags, or a short note. */
function PropertySheetRoot({
    children,
    loading = false,
    loadingLabel,
    title,
    level = 'h2',
    count,
    countLabel,
}: PropertySheetProps) {
    const id = useId();
    const content = (
        <section
            aria-labelledby={loading ? undefined : id}
            aria-hidden={(loading && !loadingLabel) || undefined}
            className="min-w-0"
        >
            <SectionTitle id={id} title={title} level={level} loading={loading} count={count} countLabel={countLabel} />
            <div className="mt-3">
                <InsetPanel presentation="settings">{loading ? <PropertySheetRows loading /> : children}</InsetPanel>
            </div>
        </section>
    );

    return loading && loadingLabel ? <SkeletonLoader label={loadingLabel}>{content}</SkeletonLoader> : content;
}

interface PropertySheetRow {
    /** The row's key in the list; its label by default. */
    key?: string;
    /** What the fact is, such as "Format". */
    label: string;
    /** The fact, such as "FLAC · 24-bit". */
    value: ReactNode;
}

type RowsProps = (
    | {
          /** Draws three skeleton rows while the facts load. */
          loading: true;
          items?: never;
      }
    | {
          loading?: false;
          /** The label/value rows, in order. */
          items: readonly PropertySheetRow[];
      }
) & {
    /** File/item lists lead with their names; facts lead with their values. */
    emphasis?: 'label' | 'value';
};

function PropertySheetRows({ items, loading = false, emphasis = 'value' }: RowsProps) {
    const rows: readonly PropertySheetRow[] = items ?? Array.from({ length: 3 }, () => ({ label: '', value: '' }));

    return (
        <dl className="divide-line divide-y">
            {rows.map(({ key, label, value }, index) => (
                <div
                    key={loading ? index : (key ?? label)}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] items-baseline gap-x-6 px-4 py-2.5 sm:px-5"
                >
                    <dt>
                        <Text
                            as="span"
                            tone={emphasis === 'label' ? 'default' : 'muted'}
                            variant={emphasis === 'label' ? 'label' : 'body'}
                            breaks
                            loading={loading}
                        >
                            {label}
                        </Text>
                    </dt>
                    <dd className="min-w-0 text-right">
                        <TextBase
                            as="span"
                            className="wrap-break-word tabular-nums"
                            variant={emphasis === 'label' ? 'body' : 'label'}
                            tone={emphasis === 'label' ? 'muted' : 'default'}
                            loading={loading}
                        >
                            {value}
                        </TextBase>
                    </dd>
                </div>
            ))}
        </dl>
    );
}

type PropertySheetTag = Omit<BadgeListItem, 'struck'>;

function PropertySheetTags({
    items,
}: {
    /** The tags, in order. */
    items: readonly PropertySheetTag[];
}) {
    return (
        <div className="px-4 py-3 sm:px-5">
            <BadgeList items={items} />
        </div>
    );
}

function PropertySheetNote({
    children,
}: {
    /** A short muted note, such as why a fact is missing. */
    children: ReactNode;
}) {
    return (
        <TextBase className="px-4 py-3 sm:px-5" tone="muted">
            {children}
        </TextBase>
    );
}

function PropertySheetCollapsible({
    children,
    title,
    summary,
}: {
    /** The body it folds away, such as PropertySheet.Rows. */
    children: ReactNode;
    /** The sheet's title, which opens it. */
    title: string;
    /** A muted line after the title while it is closed, such as "12 files". */
    summary?: string;
}) {
    const id = useId();

    return (
        <section aria-labelledby={id} className="min-w-0">
            <InsetPanel presentation="settings">
                <details className="group/sheet">
                    <summary className="hover:bg-surface-raised focus-ring-inset flex cursor-pointer list-none items-center gap-4 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 flex-1 wrap-anywhere">
                            <TextBase as="span" id={id} variant="label" className="block">
                                {title}
                            </TextBase>
                            {summary ? (
                                <TextBase as="span" tone="muted" variant="caption" className="mt-1 block">
                                    {summary}
                                </TextBase>
                            ) : null}
                        </span>
                        <span
                            aria-hidden="true"
                            className="shrink-0 transition-transform group-open/sheet:rotate-180 [&>svg]:size-4"
                        >
                            <ChevronDownIcon />
                        </span>
                    </summary>
                    <div className="border-line border-t p-4 sm:p-5">{children}</div>
                </details>
            </InsetPanel>
        </section>
    );
}

function PropertySheetTable({
    label,
    columns,
    rows,
}: {
    /** Names the table for screen readers. */
    label: string;
    /** The column headings, in order. */
    columns: readonly string[];
    /** The rows: each one's key and its cells, one per column. */
    rows: readonly { key: string; cells: readonly ReactNode[] }[];
}) {
    return (
        <div className="overflow-x-auto" tabIndex={0}>
            <table aria-label={label} className="w-full min-w-120 table-fixed border-collapse text-left text-sm">
                <thead className="border-line text-fg-muted border-b text-xs">
                    <tr>
                        {columns.map((column) => (
                            <th key={column} scope="col" className="px-4 py-3 font-medium sm:px-5">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-line divide-y">
                    {rows.map((row) => (
                        <tr key={row.key}>
                            {row.cells.map((cell, index) => (
                                <td key={index} className="px-4 py-3 align-top wrap-anywhere sm:px-5">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export const PropertySheet = Object.assign(PropertySheetRoot, {
    Collapsible: PropertySheetCollapsible,
    Note: PropertySheetNote,
    Rows: PropertySheetRows,
    Table: PropertySheetTable,
    Tags: PropertySheetTags,
});

export type { PropertySheetRow, PropertySheetTag };
