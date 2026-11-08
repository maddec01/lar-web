import { CircleHelpIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { Popover } from './Popover';

/** A small help button after a setting's name that opens what the setting does in a popover. `label` is what it
 *  explains; the button reads "About {label}". It opens above the "?" by default, so it never covers the setting's
 *  description under the name it explains (it flips below only when the window has no room above). */
export function HelpTip({
    label,
    side = 'top',
    children,
}: {
    /** What the tip explains, such as a setting's name; the button reads "About {label}". */
    label: string;
    /** Where it opens from the "?": `top` (the default) clears the description under the name; `right` or `left` for a
     *  "?" with text above it too, such as inside a dense table. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** What the setting does, in the popover. */
    children: ReactNode;
}) {
    return (
        <Popover>
            <Popover.Trigger asChild>
                <button
                    {...tabbable}
                    type="button"
                    aria-label={`About ${label}`}
                    className="text-fg-muted hover:text-fg inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full"
                >
                    <CircleHelpIcon className="size-3.5" />
                </button>
            </Popover.Trigger>
            <Popover.Content width="sm" side={side} align={side === 'top' || side === 'bottom' ? 'start' : 'center'}>
                <div className="max-w-full text-xs leading-5 wrap-anywhere" data-help-text>
                    {children}
                </div>
            </Popover.Content>
        </Popover>
    );
}
