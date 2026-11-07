import { XIcon } from 'lucide-react';
import type { MouseEvent } from 'react';

import { IconButton } from '../actions/IconButton';

/**
 * The close button every failure, warning and notification carries; `label` names what it closes, such as
 * "Dismiss: Moved #61". In the `corner` it floats to the top right of the text it closes; `inline` sits in a line of
 * text, after an error message.
 */
export function DismissButton({
    label,
    onClick,
    placement = 'corner',
}: {
    label: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    placement?: 'corner' | 'inline';
}) {
    return (
        <IconButton
            className={`dismiss ${placement === 'inline' ? 'float-none -my-1 ml-0.5 align-middle' : 'float-right -mt-0.75 -mr-1.5 ml-2'}`}
            aria-label={label}
            icon={<XIcon />}
            onClick={onClick}
        />
    );
}
