import { Loading as NinnaLoading, type LoadingProps as NinnaLoadingProps } from '@ninna-ui/feedback';
import { LoaderCircleIcon, type LucideProps } from 'lucide-react';
import { forwardRef } from 'react';

import { ambientMotion } from '../foundations/AmbientMotion';

const motions = {
    spin: 'motion-safe:animate-spin',
    always: 'animate-spin',
    status: 'lar-status-spin',
    still: '',
} as const;

type SpinnerIconProps = LucideProps & {
    /** The spin: `spin` turns unless the user prefers reduced motion, `always` turns regardless, as a pending action's
     *  does, `status` is a status glyph's slower turn (theme.css's `lar-status-spin`, as StatusIndicator's `motion`),
     *  and `still` doesn't turn. */
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

/** A loader's look is its presentation, never a class, size or colour of the caller's. */
interface LoadingProps extends Omit<NinnaLoadingProps, 'title' | 'className' | 'style' | 'color' | 'size' | 'variant'> {
    /** What loads. Without a `presentation` it names ninna-ui's spinner for screen readers only; with one it shows
     *  beside the spinner. */
    label?: string;
    /** With no label, names the spinner alone, as a cue beside values already shown. */
    title?: string | undefined;
    /** Stops it spinning. */
    still?: boolean;
    /** Without it, ninna-ui's announced spinner. `inline` is a small spinner and what loads in a line of 12px text;
     *  `line` stands on its own line of body text; `status` is a step's own loading line, announced, muted body text
     *  with room above and below that keeps turning as a pending action's spinner does. */
    presentation?: 'inline' | 'line' | 'status';
}

/** What shows in place of something still loading: ninna-ui's announced spinner, or with a `presentation`, a small
 *  spinner, still under reduced motion, and what loads. */
export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
    ({ presentation, label, title, still = false, ...props }, ref) => {
        if (!presentation) return <NinnaLoading ref={ref} label={label} title={title} {...props} />;

        if (presentation === 'status')
            return (
                <p role="status" className="text-fg-muted m-0 flex items-center gap-2 py-4 text-sm">
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
    },
);

Loading.displayName = 'Loading';
