import type { ReactNode } from 'react';

interface InlineFieldsProps {
    /** Buttons after the fields, for example Cancel and Save. */
    actions: ReactNode;
    /** The fields, side by side. */
    children: ReactNode;
}

/**
 * Fields side by side with their actions at the end. Sized by its container, not the window: in a
 * narrow card the fields stack and the actions sit below them.
 */
export function InlineFields({ actions, children }: InlineFieldsProps) {
    return (
        <div className="@container min-w-0">
            <div className="flex flex-col gap-3 @lg:flex-row @lg:items-end">
                <div className="grid min-w-0 flex-1 gap-3 @lg:auto-cols-fr @lg:grid-flow-col">{children}</div>
                <div className="flex shrink-0 justify-end gap-2">{actions}</div>
            </div>
        </div>
    );
}
