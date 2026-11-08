/** Readable examples and configuration values, contained even in narrow drawers. */
export function CodeBlock({
    value,
    preserveLines = false,
}: {
    /** The code or configuration, as text. */
    value: string;
    /** Keeps its line breaks and indentation, scrolling sideways, where wrapping would change its meaning. */
    preserveLines?: boolean;
}) {
    return (
        <pre
            tabIndex={preserveLines ? 0 : undefined}
            className={`border-line bg-surface-raised/70 text-fg-soft min-w-0 rounded-lg border p-4 font-mono text-xs leading-6 ${
                preserveLines ? 'overflow-x-auto' : 'wrap-anywhere whitespace-pre-wrap'
            }`}
        >
            <code>{value}</code>
        </pre>
    );
}
