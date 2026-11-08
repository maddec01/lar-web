import { useScrollFade } from '../overlays/useScrollFade';

const cellSpacing = {
    default: 'px-4 py-2.5 sm:first:pl-5 sm:last:pr-5',
    compact: 'px-3 py-1.5 sm:first:pl-4 sm:last:pr-4',
} as const;

const tones = {
    default: 'text-fg',
    muted: 'text-fg-muted',
    warning: 'text-warning-fg',
} as const;

export interface DataTableCell {
    /** The cell's key in its row. */
    id: string;
    /** The cell's value. */
    text: string;
    /** A smaller second line under the text. */
    detail?: string;
    /** Shown on hover. */
    title?: string;
    /** The value's colour: `default`, `muted`, or `warning` for one that needs a look. */
    tone?: keyof typeof tones;
}

export interface DataTableRow {
    /** The row's key in the table. */
    id: string;
    /** The row's header: the item it is about. */
    label: string;
    /** One per column, in column order. */
    cells: readonly DataTableCell[];
}

interface DataTableProps {
    /** The value columns after the row header: each one's key and heading. */
    columns: readonly { id: string; label: string }[];
    /** Names the table for assistive technology. */
    label: string;
    /** Heads the first column, which labels each row. */
    rowHeader: string;
    /** The rows, in order. */
    rows: readonly DataTableRow[];
    /** `compact` rows are about 32px instead of 40px, for long tables read line by line. */
    density?: keyof typeof cellSpacing;
}

/** A compact read-only grid of values: one labelled row per item and one column per subject. */
export function DataTable({ columns, label, rowHeader, rows, density = 'default' }: DataTableProps) {
    const spacing = cellSpacing[density];
    const { setViewport, className: fade } = useScrollFade({ axis: 'horizontal' });

    return (
        <div
            ref={setViewport}
            tabIndex={0}
            role="region"
            aria-label={label}
            className={`focus-ring overflow-x-auto ${fade}`}
        >
            <table aria-label={label} className="w-full text-left text-sm leading-5 tabular-nums">
                <thead className="text-fg-muted text-xs leading-4">
                    <tr className="border-line border-b">
                        <th scope="col" className={`${spacing} font-medium`}>
                            {rowHeader}
                        </th>
                        {columns.map((column) => (
                            <th key={column.id} scope="col" className={`${spacing} font-medium`}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-line divide-y">
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <th scope="row" className={`${spacing} text-fg font-normal`}>
                                {row.label}
                            </th>
                            {row.cells.map((cell) => (
                                <td
                                    key={cell.id}
                                    title={cell.title}
                                    className={`${spacing} text-xs leading-4 ${tones[cell.tone ?? 'default']}`}
                                >
                                    {cell.detail ? (
                                        <>
                                            <span className="block">{cell.text}</span>
                                            <span className="text-fg-muted mt-0.5 block">{cell.detail}</span>
                                        </>
                                    ) : (
                                        cell.text
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
