import { type ReactNode, useId } from 'react';

import { Badge } from '../display/Badge';
import { Heading, Text } from '../typography/Typography';
import { Inline, Stack } from './Flow';

interface SectionProps {
    title: string;
    description?: ReactNode;
    count?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
    level?: 'h2' | 'h3' | 'h4';
}

export function Section({ title, description, count, actions, children, level = 'h2' }: SectionProps) {
    const id = useId();

    return (
        <Stack as="section" space="section" aria-labelledby={id}>
            <Stack space="tight">
                <Inline justify="between" align="center">
                    <Inline align="center">
                        <Heading id={id} as={level} variant={level === 'h2' ? 'section' : 'subsection'}>
                            {title}
                        </Heading>
                        {count != null ? <Badge>{count}</Badge> : null}
                    </Inline>
                    {actions}
                </Inline>
                {description ? <Text tone="muted">{description}</Text> : null}
            </Stack>
            {children}
        </Stack>
    );
}
