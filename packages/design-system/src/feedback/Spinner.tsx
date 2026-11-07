import { LoaderCircleIcon, type LucideProps } from 'lucide-react';

import { ambientMotion } from '../foundations/AmbientMotion';

const motions = {
    spin: 'motion-safe:animate-spin',
    always: 'animate-spin',
    status: 'status-spin',
    still: '',
} as const;

type SpinnerIconProps = LucideProps & {
    /** The spin: `spin` turns unless the user prefers reduced motion, `always` turns regardless, as a pending action's
     *  does, `status` is a status glyph's own spin (its page defines `status-spin`), and `still` doesn't turn. */
    motion?: keyof typeof motions;
};

/**
 * The loader icon, spinning on a box around it: above a device scale of 1 Chromium can't run a root svg's transform on
 * the compositor, so the page would render every frame. It pauses while out of view or in a hidden window.
 */
export function SpinnerIcon({ motion = 'spin', ...icon }: SpinnerIconProps) {
    const spin = motions[motion];

    return (
        <span ref={spin ? ambientMotion : undefined} className={`flex w-fit shrink-0 ${spin}`}>
            <LoaderCircleIcon {...icon} />
        </span>
    );
}

interface SpinnerProps {
    /** What loads, beside the spinner. */
    label?: string;
    /** With no label, names the spinner alone, as a cue beside values already shown. */
    title?: string;
    /** Stops it spinning. */
    still?: boolean;
    /** `inline` sits in a line of 12px text; `line` stands on its own line of body text; `status` is a step's own
     *  loading line, announced, muted body text with room above and below that keeps turning as a pending action's
     *  spinner does. */
    presentation?: 'inline' | 'line' | 'status';
}

/** What shows in place of something still loading: a small spinner, still under reduced motion, and what loads. */
export function Spinner({ label, title, still = false, presentation = 'inline' }: SpinnerProps) {
    if (presentation === 'status')
        return (
            <p role="status" className="text-base-700 m-0 flex items-center gap-2 py-4 text-sm">
                <SpinnerIcon motion={still ? 'still' : 'always'} aria-hidden="true" className="size-4" />
                {label}
            </p>
        );

    return (
        <span data-loader className="inline-flex min-w-0 items-center gap-1.5" title={title}>
            <SpinnerIcon
                motion={still ? 'still' : 'spin'}
                aria-hidden="true"
                className={presentation === 'line' ? 'size-4' : 'size-3'}
            />
            {label ? <span className="truncate">{label}</span> : title && <span className="sr-only">{title}</span>}
        </span>
    );
}
