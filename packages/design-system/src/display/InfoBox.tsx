import { Alert } from '@ninna-ui/feedback';
import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Heading, Text } from '../typography/Typography';

interface InfoBoxProps {
    /** What the guidance is about, in a sentence. */
    description: string;
    /** An icon for the subject, at the box's start. */
    icon: ReactNode;
    /** Opens the guidance, such as a guide in a drawer. */
    onClick: () => void;
    /** The guidance's title, such as "Setting up remote access". */
    title: string;
}

/**
 * A prominent, actionable introduction that opens optional guidance.
 * Use for a short teaser leading to a guide or other explanatory surface. Use Alert for current
 * status, NoticeCard for content that needs examination or a decision, and InsetPanel for grouping.
 */
export function InfoBox({ description, icon, onClick, title }: InfoBoxProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group border-primary-ring border-l-primary bg-primary-surface hover:border-primary-edge focus-ring relative w-full cursor-pointer rounded-lg border border-l-4 text-left transition-colors motion-reduce:transition-none"
        >
            <Alert
                role="presentation"
                aria-live="off"
                color="primary"
                size="md"
                icon={icon}
                title={
                    <Heading as="h3" variant="label">
                        {title}
                    </Heading>
                }
                description={<Text tone="muted">{description}</Text>}
                className="text-primary-fg [&_[data-slot=icon]]:bg-primary-surface-hover bg-transparent pr-12 [&_[data-slot=description]]:opacity-100 [&_[data-slot=icon]]:mt-0 [&_[data-slot=icon]]:flex [&_[data-slot=icon]]:size-9 [&_[data-slot=icon]]:items-center [&_[data-slot=icon]]:justify-center [&_[data-slot=icon]]:rounded-lg [&_[data-slot=icon]>svg]:size-5"
            />
            <span
                aria-hidden="true"
                className="text-primary-fg absolute inset-y-0 right-4 flex items-center transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none [&>svg]:size-5"
            >
                <ChevronRightIcon />
            </span>
        </button>
    );
}
