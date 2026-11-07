import { CircleHelpIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { Popover } from './Popover';

/** A small help button after a setting's name that opens what the setting does in a popover. `label` is what it
 *  explains; the button reads "About {label}". */
export function HelpTip({ label, children }: { label: string; children: ReactNode }) {
    return (
        <Popover>
            <Popover.Trigger asChild>
                <button
                    {...tabbable}
                    type="button"
                    aria-label={`About ${label}`}
                    className="text-base-700 hover:text-base-content inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full"
                >
                    <CircleHelpIcon className="size-3.5" />
                </button>
            </Popover.Trigger>
            <Popover.Content width="sm">
                <div className="max-w-full text-xs leading-5 wrap-anywhere" data-help-text>
                    {children}
                </div>
            </Popover.Content>
        </Popover>
    );
}
