/* oxlint-disable react/only-export-components -- Compound members are exported through Popover. */

import { Popover as NinnaPopover, type PopoverContentProps } from '@ninna-ui/overlays';
import { type ComponentProps, forwardRef } from 'react';

interface PopoverContentPolicyProps extends Omit<PopoverContentProps, 'className'> {
    layout?: 'fill' | 'scroll';
    onOpenAutoFocus?: (event: Event) => void;
    onCloseAutoFocus?: (event: Event) => void;
    presentation?: 'default' | 'menu';
    /** `sm` is 16rem and `md` 22rem, such as a chooser with a list; either stays inside the window. */
    width?: 'content' | 'sm' | 'md' | 'trigger';
}

const popoverWidthClasses: Record<NonNullable<PopoverContentPolicyProps['width']>, string | undefined> = {
    content: undefined,
    sm: 'w-64',
    md: 'w-88',
    trigger: 'w-(--radix-popover-trigger-width)',
};

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentPolicyProps>(
    ({ layout = 'scroll', presentation = 'default', width = 'content', ...props }, ref) => (
        <NinnaPopover.Content
            ref={ref}
            {...props}
            data-layout={layout}
            className={`${popoverWidthClasses[width] ?? ''} ${presentation === 'menu' ? 'p-1' : ''}`}
        />
    ),
);

PopoverContent.displayName = 'Popover.Content';

function PopoverRoot(props: ComponentProps<typeof NinnaPopover>) {
    return <NinnaPopover {...props} />;
}

export const Popover = Object.assign(PopoverRoot, {
    ...NinnaPopover,
    Content: PopoverContent,
});
