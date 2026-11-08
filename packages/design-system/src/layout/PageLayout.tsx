import type { ReactNode } from 'react';

import { Heading, Text } from '../typography/Typography';
import { ContentContainerBase } from './ContentContainer';
import { Stack } from './Flow';

interface PageLayoutProps {
    /** Names the main landmark when the page has no visible `title`. */
    label?: string;
    /** The page's sections. */
    children?: ReactNode;
    /** A bar above the content, such as WorkspaceActionsHeader. */
    header?: ReactNode;
    /** The page's h1. */
    title?: string;
    /** A line under the title that says what the page is for. */
    description?: ReactNode;
    /** Quiet controls at the title row's end, such as a "Technical details" icon button. */
    actions?: ReactNode;
    /** `detail` spaces a detail page's larger blocks further apart; `default` suits a list or settings page. */
    variant?: 'default' | 'detail';
}

export function PageLayout({
    children,
    header,
    title,
    description,
    actions,
    label,
    variant = 'default',
}: PageLayoutProps) {
    return (
        <main aria-label={label} className="flex min-w-0 flex-1 flex-col [--lar-page-gutter:--spacing(4)]">
            {header}
            <ContentContainerBase className="pt-(--lar-page-gutter) pb-10 md:pb-12">
                <Stack space={variant === 'detail' ? 'page' : 'section'}>
                    {title ? (
                        <Stack space="related">
                            <div className="flex min-w-0 items-center justify-between gap-3">
                                <Heading as="h1" variant="page">
                                    {title}
                                </Heading>
                                {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
                            </div>
                            {description ? <Text tone="muted">{description}</Text> : null}
                        </Stack>
                    ) : null}
                    {children}
                </Stack>
            </ContentContainerBase>
        </main>
    );
}
