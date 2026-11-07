const cellSpacing = 'px-4 py-2.5 sm:first:pl-5 sm:last:pr-5';

const tones = {
    default: 'text-base-content',
    muted: 'text-base-700',
    warning: 'text-warning',
} as const;

export interface DataTableCell {
    id: string;
    text: string;
    /** A smaller second line under the text. */
    detail?: string;
    /** Shown on hover. */
    title?: string;
    tone?: keyof typeof tones;
}

export interface DataTableRow {
    id: string;
    label: string;
    /** One per column, in column order. */
    cells: readonly DataTableCell[];
}

interface DataTableProps {
    columns: readonly { id: string; label: string }[];
    /** Names the table for assistive technology. */
    label: string;
    /** Heads the first column, which labels each row. */
    rowHeader: string;
    rows: readonly DataTableRow[];
}

/** A compact read-only grid of values: one labelled row per item and one column per subject. */
export function DataTable({ columns, label, rowHeader, rows }: DataTableProps) {
    return (
        <div className="overflow-x-auto">
            <table aria-label={label} className="w-full text-left text-sm leading-5 tabular-nums">
                <thead className="text-base-700 text-xs leading-4">
                    <tr className="border-base-300 border-b">
                        <th scope="col" className={`${cellSpacing} font-medium`}>
                            {rowHeader}
                        </th>
                        {columns.map((column) => (
                            <th key={column.id} scope="col" className={`${cellSpacing} font-medium`}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-base-300 divide-y">
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <th scope="row" className={`${cellSpacing} text-base-content font-normal`}>
                                {row.label}
                            </th>
                            {row.cells.map((cell) => (
                                <td
                                    key={cell.id}
                                    title={cell.title}
                                    className={`${cellSpacing} text-xs leading-4 ${tones[cell.tone ?? 'default']}`}
                                >
                                    {cell.detail ? (
                                        <>
                                            <span className="block">{cell.text}</span>
                                            <span className="text-base-700 mt-0.5 block">{cell.detail}</span>
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
