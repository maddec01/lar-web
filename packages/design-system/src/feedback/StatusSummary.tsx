import { StatusIndicatorBase } from './StatusIndicator';
import { resolveStatusTone, type StatusColour } from './StatusState';

/** One part of a mixed summary, such as "5 active" or "3 failed": its words and what they mean. */
export type StatusSummaryPart = StatusColour & {
    /** The part's words, count first, such as "3 failed". */
    label: string;
};

export interface StatusSummaryProps {
    /** The parts in reading order, the main state first, such as `[{ state: 'active', label: '5 active' }, { state:
     *  'failed', label: '3 failed' }]`. Leave out a part with nothing to count. */
    parts: readonly StatusSummaryPart[];
}

/** A status that is more than one thing at once, such as "5 active · 3 failed": each part keeps its own light and
 *  colour, so a failure never hides in the main state's tone. One part reads as a lone StatusIndicator. */
export function StatusSummary({ parts }: StatusSummaryProps) {
    return (
        <span data-slot="status-summary" className="inline-flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            {parts.map((part, index) => (
                <span key={`${index}:${part.label}`} className="inline-flex">
                    <StatusIndicatorBase tone={resolveStatusTone(part)} size="sm" label={part.label} />
                    {/* Screen readers hear the parts as one list: "5 active, 3 failed". */}
                    {index < parts.length - 1 ? <span className="sr-only">, </span> : null}
                </span>
            ))}
        </span>
    );
}
