import { Switch as NinnaSwitch, type SwitchProps } from '@ninna-ui/forms';
import { forwardRef } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

type Props = SwitchProps & {
    /** Busy rather than disabled while a change it started saves: it keeps the focus and ignores presses. */
    busy?: boolean;
};

export const Switch = forwardRef<HTMLButtonElement, Props>(({ busy = false, onCheckedChange, ...props }, ref) => (
    <NinnaSwitch
        ref={ref}
        {...tabbable}
        size="sm"
        aria-busy={props.loading || undefined}
        {...props}
        {...(busy && { 'aria-disabled': true })}
        className={`aria-disabled:cursor-progress ${props.className ?? ''}`}
        onCheckedChange={(checked) => !busy && onCheckedChange?.(checked)}
    />
));

Switch.displayName = 'Switch';
