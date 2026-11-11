import { SettingsIcon } from 'lucide-react';

import { IconButtonBase } from '../../actions/IconButton';
import { Tooltip, TooltipPopup, TooltipTrigger } from '../../overlays/Tooltip';

interface TitleBarSettingsButtonProps {
    /** Its accessible name and tooltip, such as "Settings". */
    label: string;
    /** Called as the reader opens Settings. */
    onOpen: () => void;
    /** What waits in Settings, as the button's accessible description and the tooltip's second line, such as
     *  "2 sign-in requests". */
    description?: string;
}

/** Settings in a title bar, the same in every app: the bar's 28px icon button with a 16px gear in the header's icon
 *  colour and a glass tooltip, in the TitleBar's `settings` slot (after the app's actions, before identity). */
export function TitleBarSettingsButton({ label, onOpen, description }: TitleBarSettingsButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <IconButtonBase
                    variant="title-bar"
                    icon={<SettingsIcon />}
                    aria-label={label}
                    aria-description={description}
                    onClick={onOpen}
                    className="open-settings"
                />
            </TooltipTrigger>
            <TooltipPopup side="bottom">
                {label}
                {description ? <span className="text-fg-muted ms-2">{description}</span> : null}
            </TooltipPopup>
        </Tooltip>
    );
}
