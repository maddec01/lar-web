import type { ComponentPropsWithoutRef } from 'react';

export type ScrollAreaProps = Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'style'>;

export function ScrollArea(props: ScrollAreaProps) {
    return <div {...props} className="max-h-64 min-h-0 overflow-y-auto overscroll-contain pr-1" />;
}
