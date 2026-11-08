import { type ReactNode, useId } from 'react';

import { Text } from '../typography/Typography';
import { Stack } from './Flow';
import { SectionTitle } from './SectionTitle';

interface SectionProps {
    /** The section's heading. */
    title: string;
    /** A line under the heading that says what the section holds. */
    description?: ReactNode;
    /** How many items the section holds, shown as a bare figure beside the title. */
    count?: number;
    /** Hide the count and skeleton the heading while loading. */
    loading?: boolean;
    /** Accessible context for the numeric count, for example “3 titles”. */
    countLabel?: string;
    /** Controls at the heading's end, such as an add button. */
    actions?: ReactNode;
    /** The section's content. */
    children: ReactNode;
    /** The heading's level under the page's h1; `h2` by default. */
    level?: 'h2' | 'h3' | 'h4';
}

export function Section({
    title,
    description,
    count,
    countLabel,
    loading,
    actions,
    children,
    level = 'h2',
}: SectionProps) {
    const id = useId();

    return (
        <Stack as="section" space="section" aria-labelledby={id}>
            <Stack space="tight">
                <SectionTitle
                    title={title}
                    id={id}
                    level={level}
                    loading={loading}
                    count={count}
                    countLabel={countLabel}
                    actions={actions}
                />
                {description ? <Text tone="muted">{description}</Text> : null}
            </Stack>
            {children}
        </Stack>
    );
}
