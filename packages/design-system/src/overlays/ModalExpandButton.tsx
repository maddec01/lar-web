import { Maximize2Icon, Minimize2Icon } from 'lucide-react';
import { useState } from 'react';

import { IconButton } from '../actions/IconButton';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Tooltip, TooltipPopup, TooltipTrigger } from './Tooltip';

interface ModalExpandButtonProps {
    expanded: boolean;
    onToggle: () => void;
    /** The shortcut that toggles it too, as shown (⌘⇧E) and as `aria-keyshortcuts` reads it (Meta+Shift+E). */
    shortcut?: { label: string; keys: string };
}

/**
 * The control a dialog's header shows (in Modal.Content's `headerActions`) to grow the dialog to the window and back,
 * with its shortcut in a tooltip. The tooltip opens on hover only: a dialog that opens with no field focuses this
 * button, and a tooltip opened by that focus would take the dialog's first Escape. `aria-keyshortcuts` still tells
 * assistive tech the shortcut.
 */
export function ModalExpandButton({ expanded, onToggle, shortcut }: ModalExpandButtonProps) {
    const labels = useDesignSystemLabels().dialog;
    const label = expanded ? labels.restoreSize : labels.expand;
    const [hint, setHint] = useState(false);

    return (
        <Tooltip
            open={hint}
            onOpenChange={(open) => setHint(open && document.querySelector('button[data-expand]:hover') !== null)}
        >
            <TooltipTrigger asChild>
                <IconButton
                    data-expand
                    variant="header"
                    aria-label={label}
                    aria-pressed={expanded}
                    aria-keyshortcuts={shortcut?.keys}
                    icon={expanded ? <Minimize2Icon /> : <Maximize2Icon />}
                    onClick={onToggle}
                />
            </TooltipTrigger>
            <TooltipPopup side="bottom">
                {label}
                {shortcut ? <span className="text-base-500 ms-2">{shortcut.label}</span> : null}
            </TooltipPopup>
        </Tooltip>
    );
}
