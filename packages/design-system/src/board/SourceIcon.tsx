import { LaptopIcon } from 'lucide-react';

import { AzureDevOpsIcon, GitHubIcon } from '../icons/BrandIcons';

/** Where a piece of work's ticket is saved: a GitHub issue, an Azure DevOps work item, or only on this machine. */
export type ItemSource = 'github' | 'azure' | 'local';

/**
 * Where an item's ticket is saved, as a small muted mark named by `label`: a bordered square in rows and details, or
 * with `corner` a tab in a card's top right corner, which lets clicks through to the card.
 */
export function SourceIcon({ source, label, corner = false }: { source: ItemSource; label: string; corner?: boolean }) {
    const shape = corner
        ? 'absolute right-0 top-0 z-10 size-6 rounded-bl-lg rounded-tr-[inherit] border-b border-l pointer-events-none'
        : 'size-5 shrink-0 rounded-md border';

    return (
        <span
            role="img"
            aria-label={label}
            title={label}
            className={`grid place-items-center border-(--border) bg-(--soft) text-(--muted-foreground) ${shape}`}
        >
            {source === 'local' ? (
                <LaptopIcon className="size-3" strokeWidth={1.75} aria-hidden="true" />
            ) : source === 'github' ? (
                <GitHubIcon className="size-3" />
            ) : (
                <AzureDevOpsIcon className="size-3" />
            )}
        </span>
    );
}
