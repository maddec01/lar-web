import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { StatusIndicator, type StatusTone } from './StatusIndicator';

interface ProgressStatusRowProps {
    active: boolean;
    detail?: string;
    secondaryDetail?: string;
    issue?: string;
    label: string;
    progress?: { max: number; value: number };
    tone?: StatusTone;
    trailing?: ReactNode;
    onDetails?: () => void;
    detailsLabel?: string;
    progressLabel?: string;
    compact?: boolean;
}

/** Ledger rows reserve the count line and track so updates never displace controls. */
export function ProgressStatusRow({
    active,
    detail,
    secondaryDetail,
    issue,
    label,
    progress,
    tone = 'info',
    trailing,
    onDetails,
    detailsLabel,
    progressLabel,
    compact = false,
}: ProgressStatusRowProps) {
    const known = progress && progress.max > 0 ? progress : undefined;
    const colors = {
        info: 'bg-primary',
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning',
        neutral: 'bg-base-400',
    };
    const heading = (
        <>
            <StatusIndicator tone={tone} />
            <span className="text-base-content min-w-0 flex-1 truncate" title={label}>
                {label}
            </span>
        </>
    );

    return (
        <div className="w-full min-w-0">
            <div className="grid min-h-12 min-w-0 grid-cols-[minmax(0,1fr)_auto] content-center items-center gap-x-3 gap-y-1">
                {onDetails ? (
                    <Button
                        variant="status"
                        className="w-full"
                        onClick={onDetails}
                        aria-label={detailsLabel}
                        aria-haspopup="dialog"
                    >
                        {heading}
                        <ChevronRightIcon />
                    </Button>
                ) : (
                    <div className="flex h-4 min-w-0 items-center gap-1.5 text-xs">{heading}</div>
                )}
                {trailing ? <div className="col-start-2 row-span-3 row-start-1 shrink-0">{trailing}</div> : null}
                <div
                    className={`text-2xs text-base-700 col-start-1 tabular-nums ${compact ? 'truncate' : 'break-words'}`}
                    title={detail}
                >
                    {detail || '\u00a0'}
                </div>
                <div
                    className="bg-base-300/70 col-start-1 h-1.5 overflow-hidden rounded-full"
                    role={active ? 'progressbar' : undefined}
                    aria-label={active ? progressLabel || detail || label : undefined}
                    aria-valuenow={active && known ? known.value : undefined}
                    aria-valuemin={active && known ? 0 : undefined}
                    aria-valuemax={active && known ? known.max : undefined}
                >
                    {active ? (
                        <div
                            className={`h-full rounded-full ${colors[tone]} ${known ? '' : 'lar-progress-indeterminate'}`}
                            style={
                                known
                                    ? { width: `${Math.min(100, Math.max(0, (known.value / known.max) * 100))}%` }
                                    : undefined
                            }
                        />
                    ) : null}
                </div>
            </div>
            {issue ? <div className="text-2xs break-words text-(--lar-danger-text) tabular-nums">{issue}</div> : null}
            {secondaryDetail ? (
                <div className="text-2xs text-base-700 break-words tabular-nums">{secondaryDetail}</div>
            ) : null}
        </div>
    );
}
