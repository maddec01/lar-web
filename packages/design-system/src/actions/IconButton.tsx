import { IconButton as NinnaIconButton, type IconButtonProps as NinnaIconButtonProps } from '@ninna-ui/primitives';
import { forwardRef } from 'react';

import { StatusIndicator, type StatusTone } from '../feedback/StatusIndicator';
import { tabbable } from '../foundations/KeyboardFocus';

export type IconButtonProps = Omit<NinnaIconButtonProps, 'color' | 'radius' | 'size' | 'variant'> & {
    variant?: 'header' | 'quiet' | 'title-bar';
    tone?: StatusTone | 'accent';
    notification?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ variant = 'quiet', tone = 'neutral', className = '', notification, icon, ...props }, ref) => (
        <NinnaIconButton
            ref={ref}
            {...tabbable}
            aria-description={notification}
            {...props}
            icon={
                notification ? (
                    <span className="relative block size-full">
                        {icon}
                        <StatusIndicator
                            tone="warning"
                            size="sm"
                            className="ring-base-100 absolute -top-0.5 -right-0.5 ring-2"
                        />
                    </span>
                ) : (
                    icon
                )
            }
            variant="ghost"
            color={tone === 'accent' ? 'primary' : tone}
            size="sm"
            radius="lg"
            className={
                // T3 Code's ghost icon button: muted until hovered, on an accent fill.
                (variant === 'header'
                    ? 'text-base-700 hover:bg-base-200 hover:text-base-content data-[state=open]:bg-base-200 data-[state=open]:text-base-content size-8 rounded-md p-0 before:-inset-1 **:data-[slot=icon]:size-[18px] '
                    : variant === 'title-bar'
                      ? // The title bar's 28px row of controls, with 16px icons.
                        'text-base-700 hover:bg-base-200 hover:text-base-content data-[state=open]:bg-base-200 data-[state=open]:text-base-content size-7 rounded-md p-0 before:-inset-1.5 **:data-[slot=icon]:size-4 '
                      : tone === 'neutral'
                        ? 'text-base-700 hover:bg-base-200 hover:text-base-content data-[state=open]:bg-base-200 rounded-md '
                        : 'rounded-md ') +
                'transition-[background-color,color,scale] active:scale-[0.94] [&_svg]:size-full ' +
                className
            }
        />
    ),
);

IconButton.displayName = 'IconButton';
