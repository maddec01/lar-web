import { SettingsIcon } from 'lucide-react';

import { IconButtonBase } from '../../actions/IconButton';

interface TitleBarSettingsButtonProps {
    /** Its accessible name and tooltip, such as "Settings". */
    label: string;
    /** Called as the reader opens Settings. */
    onOpen: () => void;
    /** What waits in Settings, as the button's accessible description, such as "2 sign-in requests". */
    description?: string;
}

/** Settings in a title bar, the same in every app: the bar's 28px icon button with a 16px gear in the header's icon
 *  colour, one of the bar's tools at its end (TitleBar spaces them evenly; no divider sets it apart). */
export function TitleBarSettingsButton({ label, onOpen, description }: TitleBarSettingsButtonProps) {
    return (
        <IconButtonBase
            variant="title-bar"
            icon={<SettingsIcon />}
            aria-label={label}
            title={label}
            aria-description={description}
            onClick={onOpen}
            className="open-settings"
        />
    );
}
