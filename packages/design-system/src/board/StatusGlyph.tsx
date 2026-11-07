// One glyph per status of Lar Factory's work, the way T3 marks a thread working, waiting or done, in the status's
// colour (board/tokens.css's --st-* colours).

import {
    CheckIcon,
    CircleArrowRightIcon,
    CircleDashedIcon,
    CircleDotIcon,
    CircleIcon,
    Clock3Icon,
    EyeIcon,
    GitMergeIcon,
    ListIcon,
} from 'lucide-react';

import { SpinnerIcon } from '../feedback/Spinner';
import { ambientMotion } from '../foundations/AmbientMotion';
import { type BoardStatus, statusColor } from './StatusColors';

const sizes = { compact: 'size-3', default: 'size-3.5', title: 'size-4' } as const;

/** The statuses whose glyph pulses while their work runs; In progress spins instead. */
const pulses: BoardStatus[] = ['Shaping', 'Review', 'Verify', 'Ready to merge'];

/**
 * A status's glyph in its colour. `running` animates it while its work is known to run: In progress spins, and
 * Shaping, Review, Verify and Ready to merge pulse. `presentation` sizes it: 12px beside small text, 14px by default,
 * 16px beside a title.
 */
export function StatusGlyph({
    status,
    running = false,
    presentation = 'default',
}: {
    status: BoardStatus;
    running?: boolean;
    presentation?: keyof typeof sizes;
}) {
    const pulse = running && pulses.includes(status);
    const props = {
        ref: pulse ? ambientMotion : undefined,
        className: `shrink-0 ${sizes[presentation]}${pulse ? ' status-pulse' : ''}`,
        style: { color: statusColor[status] },
        strokeWidth: 2.25,
    };

    switch (status) {
        case 'List':
            return <ListIcon {...props} />;
        case 'Needs you':
        case 'Verify':
            return <CircleDotIcon {...props} />;
        case 'In progress':
            return running ? <SpinnerIcon motion="status" {...props} /> : <CircleIcon {...props} />;
        case 'Ready':
            return <CircleArrowRightIcon {...props} />;
        case 'Shaping':
            return <CircleDashedIcon {...props} />;
        case 'Review':
            return <EyeIcon {...props} />;
        case 'Ready to merge':
            return <GitMergeIcon {...props} />;
        case 'Done':
            return <CheckIcon {...props} />;
        case 'Queued':
            return <Clock3Icon {...props} />;
        default:
            return <CircleIcon {...props} />;
    }
}
