import { Code } from '@ninna-ui/primitives';

/** File paths as truncated code, one per line. */
export function PathList({
    label,
    paths,
}: {
    /** Names the list for screen readers, such as "Folders scanned". */
    label: string;
    /** The paths, in order: each one's key and the path. */
    paths: readonly { key: string; path: string }[];
}) {
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
