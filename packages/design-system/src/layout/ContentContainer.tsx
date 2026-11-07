import { Container } from '@ninna-ui/layout';
import type { ReactNode } from 'react';

interface ContentContainerProps {
    as?: 'div' | 'main';
    children: ReactNode;
    className?: string;
}

export function ContentContainer({ as = 'div', children, className }: ContentContainerProps) {
    return (
        <Container as={as} maxWidth="full" padding={false} className={className ? `px-4 ${className}` : 'px-4'}>
            {children}
        </Container>
    );
}
