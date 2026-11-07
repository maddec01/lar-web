import { ChevronDownIcon } from 'lucide-react';
/* oxlint-disable react/only-export-components -- Compound members are exported through PropertySheet. */
import { type ReactNode, useId } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Heading, Text } from '../typography/Typography';
import { BadgeList, type BadgeListItem } from './BadgeList';
import { InsetPanel } from './InsetPanel';

type PropertySheetProps = { title: string } & (
    | { children: ReactNode; loading?: false; loadingLabel?: never }
    | { children?: never; loading: true; loadingLabel?: string }
);

/** A titled sheet of facts about one thing; the body is label/value rows, a row of tags, or a short note. */
function PropertySheetRoot({ children, loading = false, loadingLabel, title }: PropertySheetProps) {
    const id = useId();
    const content = (
        <section
            aria-labelledby={loading ? undefined : id}
            aria-hidden={(loading && !loadingLabel) || undefined}
            className="min-w-0"
        >
            <Heading
                id={id}
                as="h3"
                variant="label"
                tone="muted"
                className="px-1"
                loading={loading}
                aria-hidden={loading || undefined}
            >
                {title}
            </Heading>
            <div className="mt-3">
                <InsetPanel presentation="settings">{loading ? <PropertySheetRows loading /> : children}</InsetPanel>
            </div>
        </section>
    );

    return loading && loadingLabel ? <SkeletonLoader label={loadingLabel}>{content}</SkeletonLoader> : content;
}

interface PropertySheetRow {
    label: string;
    value: ReactNode;
}

type RowsProps = { loading: true; items?: never } | { loading?: false; items: readonly PropertySheetRow[] };

function PropertySheetRows({ items, loading = false }: RowsProps) {
    const rows = items ?? Array.from({ length: 3 }, () => ({ label: '', value: '' }));

    return (
        <dl className="divide-base-300 divide-y">
            {rows.map(({ label, value }, index) => (
                <div
                    key={loading ? index : label}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] items-baseline gap-x-6 px-4 py-2.5 sm:px-5"
                >
                    <dt>
                        <Text as="span" tone="muted" loading={loading}>
                            {label}
                        </Text>
                    </dt>
                    <dd className="min-w-0 text-right">
                        <Text as="span" className="wrap-break-word tabular-nums" variant="label" loading={loading}>
                            {value}
                        </Text>
                    </dd>
                </div>
            ))}
        </dl>
    );
}

type PropertySheetTag = Omit<BadgeListItem, 'struck'>;

function PropertySheetTags({ items }: { items: readonly PropertySheetTag[] }) {
    return (
        <div className="px-4 py-3 sm:px-5">
            <BadgeList items={items} />
        </div>
    );
}

function PropertySheetNote({ children }: { children: ReactNode }) {
    return (
        <Text className="px-4 py-3 sm:px-5" tone="muted">
            {children}
        </Text>
    );
}

function PropertySheetCollapsible({
    children,
    title,
    summary,
}: {
    children: ReactNode;
    title: string;
    summary?: string;
}) {
    const id = useId();

    return (
        <section aria-labelledby={id} className="min-w-0">
            <InsetPanel presentation="settings">
                <details className="group/sheet">
                    <summary className="hover:bg-base-100 focus-visible:outline-primary flex cursor-pointer list-none items-center gap-4 px-4 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 sm:px-5 [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 flex-1 wrap-anywhere">
                            <Text as="span" id={id} variant="label" className="block">
                                {title}
                            </Text>
                            {summary ? (
                                <Text as="span" tone="muted" variant="caption" className="mt-1 block">
                                    {summary}
                                </Text>
                            ) : null}
                        </span>
                        <span
                            aria-hidden="true"
                            className="shrink-0 transition-transform group-open/sheet:rotate-180 [&>svg]:size-4"
                        >
                            <ChevronDownIcon />
                        </span>
                    </summary>
                    <div className="border-base-300 border-t p-4 sm:p-5">{children}</div>
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
    label: string;
    columns: readonly string[];
    rows: readonly { key: string; cells: readonly ReactNode[] }[];
}) {
    return (
        <div className="overflow-x-auto" tabIndex={0}>
            <table aria-label={label} className="w-full min-w-[30rem] table-fixed border-collapse text-left text-sm">
                <thead className="border-base-300 text-base-700 border-b text-xs">
                    <tr>
                        {columns.map((column) => (
                            <th key={column} scope="col" className="px-4 py-3 font-medium sm:px-5">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-base-300 divide-y">
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
