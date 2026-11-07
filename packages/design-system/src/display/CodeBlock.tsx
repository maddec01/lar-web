/** Readable examples and configuration values, contained even in narrow drawers. */
export function CodeBlock({ value, preserveLines = false }: { value: string; preserveLines?: boolean }) {
    return (
        <pre
            className={`border-base-300 bg-base-100/70 text-base-800 min-w-0 rounded-lg border p-4 font-mono text-xs leading-6 ${
                preserveLines ? 'overflow-x-auto' : 'wrap-anywhere whitespace-pre-wrap'
            }`}
        >
            <code>{value}</code>
        </pre>
    );
}
