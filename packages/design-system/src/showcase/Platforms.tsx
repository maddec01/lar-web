import type { ReactNode } from 'react';

import { type Readiness, StatusPill } from './Status';

export interface Platform {
    name: string;
    detail: string;
    icon: ReactNode;
    status: Readiness;
    statusLabel: string;
}

/** Every screen Lar reaches, each with where it stands: compact rows on phones, cards on wider screens. */
export function PlatformGrid({ platforms, label }: { platforms: readonly Platform[]; label: string }) {
    return (
        <ul
            aria-label={label}
            className="divide-base-300/70 border-base-300/80 bg-base-100/60 dark:bg-base-100/40 grid divide-y rounded-2xl border sm:grid-cols-2 sm:gap-3 sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent lg:grid-cols-4 sm:dark:bg-transparent"
        >
            {platforms.map((platform) => (
                <li
                    key={platform.name}
                    data-status={platform.status}
                    className="sm:border-base-300/80 sm:bg-base-100/60 sm:dark:bg-base-100/40 flex items-start gap-3 p-4 sm:flex-col sm:items-stretch sm:gap-4 sm:rounded-2xl sm:border sm:p-5 sm:data-[status=planned]:border-dashed sm:data-[status=planned]:bg-transparent"
                >
                    <div className="flex shrink-0 items-start justify-between gap-3">
                        <span className="bg-base-200 text-base-800 ring-base-300/70 dark:bg-base-300/60 inline-flex size-9 items-center justify-center rounded-[0.65rem] ring-1 ring-inset sm:size-10 [&>svg]:size-[18px] sm:[&>svg]:size-5">
                            {platform.icon}
                        </span>
                        <span className="hidden sm:inline-flex">
                            <StatusPill status={platform.status}>{platform.statusLabel}</StatusPill>
                        </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-base-content text-[15px] font-semibold tracking-[-0.01em]">
                                {platform.name}
                            </span>
                            <span className="sm:hidden">
                                <StatusPill status={platform.status}>{platform.statusLabel}</StatusPill>
                            </span>
                        </span>
                        <span className="text-base-700 text-sm leading-5">{platform.detail}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}
