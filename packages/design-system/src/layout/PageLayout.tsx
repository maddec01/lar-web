import type { ReactNode } from 'react';

import { Heading, Text } from '../typography/Typography';
import { ContentContainer } from './ContentContainer';
import { Stack } from './Flow';

interface PageLayoutProps {
    label?: string;
    children?: ReactNode;
    header?: ReactNode;
    title?: string;
    description?: ReactNode;
    variant?: 'default' | 'detail';
}

export function PageLayout({ children, header, title, description, label, variant = 'default' }: PageLayoutProps) {
    return (
        <main aria-label={label} className="flex min-w-0 flex-1 flex-col [--lar-page-gutter:--spacing(4)]">
            {header}
            <ContentContainer className="pt-(--lar-page-gutter) pb-10 md:pb-12">
                <Stack space={variant === 'detail' ? 'page' : 'section'}>
                    {title ? (
                        <Stack space="related">
                            <Heading as="h1" variant="page">
                                {title}
                            </Heading>
                            {description ? <Text tone="muted">{description}</Text> : null}
                        </Stack>
                    ) : null}
                    {children}
                </Stack>
            </ContentContainer>
        </main>
    );
}
