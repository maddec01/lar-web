import { Code } from '@ninna-ui/primitives';

/** File paths as truncated code, one per line. */
export function PathList({ label, paths }: { label: string; paths: readonly { key: string; path: string }[] }) {
    return (
        <ul aria-label={label} className="space-y-1">
            {paths.map(({ key, path }) => (
                <li key={key} className="min-w-0">
                    <Code title={path} className="block max-w-full truncate text-xs">
                        {path}
                    </Code>
                </li>
            ))}
        </ul>
    );
}
