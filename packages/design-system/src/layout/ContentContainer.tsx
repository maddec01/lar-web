import { Container } from '@ninna-ui/layout';
import type { ReactNode } from 'react';

interface ContentContainerProps {
    /** The element it renders: `main` when it is the page's main content. */
    as?: 'div' | 'main';
    /** The page content it holds at the app's gutter. */
    children: ReactNode;
}

interface ContentContainerBaseProps extends ContentContainerProps {
    /** The design system's own layout inside the gutter, such as a page's top padding. */
    className?: string;
}

/** The container for the design system's own compositions, which may fit it to their layout with a class. */
export function ContentContainerBase({ as = 'div', children, className }: ContentContainerBaseProps) {
    return (
        <Container
            as={as}
            maxWidth="full"
            padding={false}
            className={className ? `px-gutter-app ${className}` : 'px-gutter-app'}
        >
            {children}
        </Container>
    );
}

/** An app page's content, full width inside the app shell's 16px gutter. */
export function ContentContainer(props: ContentContainerProps) {
    return <ContentContainerBase {...props} />;
}
