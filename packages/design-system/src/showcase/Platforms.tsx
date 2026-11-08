import type { ReactNode } from 'react';

import { type Readiness, ReadinessStatus } from './Status';

export interface Platform {
    name: string;
    detail: string;
    icon: ReactNode;
    status: Readiness;
    statusLabel: string;
}

/** Every screen Lar reaches, each with where it stands: compact rows on phones, cards on wider screens. */
export function PlatformGrid({
    platforms,
    label,
}: {
    /** Every platform, each with its icon and where it stands. */
    platforms: readonly Platform[];
    /** Names the list for screen readers. */
    label: string;
}) {
    return (
        <ul
            aria-label={label}
            className="divide-line/70 border-line/80 bg-surface-glass grid divide-y rounded-2xl border sm:grid-cols-2 sm:gap-3 sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent lg:grid-cols-4"
        >
            {platforms.map((platform) => (
                <li
                    key={platform.name}
                    data-status={platform.status}
                    className="sm:border-line/80 sm:bg-surface-glass flex items-start gap-3 p-4 sm:flex-col sm:items-stretch sm:gap-4 sm:rounded-2xl sm:border sm:p-5 sm:data-[status=planned]:border-dashed sm:data-[status=planned]:bg-transparent"
                >
                    <div className="flex shrink-0 items-start justify-between gap-3">
                        <span className="bg-fill-muted text-fg-soft ring-line/70 inline-flex size-9 items-center justify-center rounded-lg ring-1 ring-inset sm:size-10 [&>svg]:size-4.5 sm:[&>svg]:size-5">
                            {platform.icon}
                        </span>
                        <span className="hidden sm:inline-flex">
                            <ReadinessStatus status={platform.status}>{platform.statusLabel}</ReadinessStatus>
                        </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-fg text-md tracking-heading font-semibold">{platform.name}</span>
                            <span className="sm:hidden">
                                <ReadinessStatus status={platform.status}>{platform.statusLabel}</ReadinessStatus>
                            </span>
                        </span>
                        <span className="text-fg-muted text-sm leading-5">{platform.detail}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}
