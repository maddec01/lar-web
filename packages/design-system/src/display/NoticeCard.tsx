import { type ReactNode, useId } from 'react';

import type { StatusTone } from '../feedback/StatusIndicator';
import { Heading, TextBase } from '../typography/Typography';
import { toneTileClasses } from './ToneTile';

interface NoticeCardProps {
    /** Buttons for what can be done, primary first. */
    actions?: ReactNode;
    /** A short status such as a severity, beside the title. */
    badge?: ReactNode;
    /** Details under the description, such as a list of what is affected. */
    children?: ReactNode;
    /** What the matter is and what it means, in a sentence or two, set at a reading measure (about 75 characters). */
    description: ReactNode;
    /** Quiet content under the actions, such as a disclosure of technical details. */
    footer?: ReactNode;
    /** An icon for the matter, in a tile of its tone. */
    icon: ReactNode;
    /** The title's heading level; one below the section the card sits in. */
    level?: 'h2' | 'h3' | 'h4';
    /** The matter in a few words. */
    title: string;
    /** The matter's tone: its icon tile and edge. */
    tone: StatusTone;
}

/**
 * A persistent, substantial item that needs examination or a decision, with optional details and
 * actions. Use Alert for current status, InfoBox for optional guidance, and InsetPanel for grouping.
 */
export function NoticeCard({
    actions,
    badge,
    children,
    description,
    footer,
    icon,
    level = 'h2',
    title,
    tone,
}: NoticeCardProps) {
    const id = useId();

    return (
        <article aria-labelledby={id} className={`border-line bg-surface-raised rounded-lg border p-4 sm:p-5`}>
            <div className="flex min-w-0 gap-3 sm:gap-4">
                <span
                    aria-hidden="true"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg [&>svg]:size-5 ${toneTileClasses[tone]}`}
                >
                    {icon}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                            <Heading id={id} as={level} variant="title">
                                {title}
                            </Heading>
                            {badge}
                        </div>
                        {/* A reading measure, so a long explanation never runs the width of a wide page. */}
                        <TextBase tone="muted" className="max-w-[75ch] text-pretty">
                            {description}
                        </TextBase>
                    </div>
                    {children}
                    {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
                    {footer}
                </div>
            </div>
        </article>
    );
}
