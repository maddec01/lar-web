/* oxlint-disable react/only-export-components -- The splash's view is shared with an app's own loading screen. */

import { useEffect, useState } from 'react';

import { MARK_BAR, MARK_CENTRE_LINE, MARK_L, MARK_S } from '../display/BrandMark';

/** A line of the splash's status text; a new `id` rolls it in. */
export interface SplashLine {
    id: number;
    text: string;
}

/** The Lar mark's paths on its viewBox, drawn in the order the splash animates them. */
export interface SplashMark {
    viewBox: string;
    /** The block, which springs in first, in the brand's block colour. */
    block: string;
    blockColor: string;
    /** The L's centre line, which a stroke `bar` wide traces around the block. */
    centreLine: string;
    bar: number;
    /** The filled L, which stands in for the trace once it is drawn. */
    l: string;
}

/** The design system's own Lar mark, as BrandMark draws it. */
export const LAR_SPLASH_MARK: SplashMark = {
    viewBox: '0 0 100 100',
    block: MARK_S,
    blockColor: 'var(--color-brand-mark)',
    centreLine: MARK_CENTRE_LINE,
    bar: MARK_BAR,
    l: MARK_L,
};

/** The splash's one status-line rule: the line says what is under way, so it ends in an ellipsis ("Loading
 *  projects…", "Connecting to your server…"); three full stops become one ellipsis, and a line that already ends in
 *  its own punctuation keeps it. Both apps' lines read alike whatever their copy passes. */
export function splashStatusText(text: string): string {
    const line = text.trim().replace(/\.{3}$/, '…');

    return !line || /[….!?:]$/.test(line) ? line : `${line}…`;
}

/** How long the status line's roll takes (app-splash.css). */
const ROLL_MS = 380;

interface SplashViewProps {
    mark: SplashMark;
    product: string;
    label?: string;
    drawn: boolean;
    leaving: boolean;
    line: SplashLine;
    leavingLine?: SplashLine | undefined;
    rolled: boolean;
    progress?: number | 'indeterminate' | undefined;
    progressLabel?: string | undefined;
    chrome?: SplashChrome | undefined;
}

/** Where the splash shows: `browser` (a web page, the default) or `desktop` (a desktop app's frameless window, whose
 *  splash leaves the title bar's height on top and moves the window when dragged). */
export type SplashChrome = 'browser' | 'desktop';

/** The splash's markup, shared by AppSplash and an app's own loading screen (SplashView, which drives the line itself). */
export function SplashView({
    mark,
    product,
    label,
    drawn,
    leaving,
    line,
    leavingLine,
    rolled,
    progress = 'indeterminate',
    progressLabel,
    chrome = 'browser',
}: SplashViewProps) {
    // While it waits it shows the calm indeterminate track (or a fraction); fading out, it reports progress to no one.
    const track = leaving ? undefined : progress;

    return (
        <div
            data-chrome={chrome}
            className={`loading-screen ${drawn ? 'is-drawn' : ''} ${leaving ? 'is-leaving' : ''}`}
        >
            <div className="loading-lockup">
                <div className="loading-wordmark" role={label ? 'img' : undefined} aria-label={label}>
                    <svg className="loading-mark" viewBox={mark.viewBox} aria-hidden>
                        <path className="loading-mark-block" d={mark.block} fill={mark.blockColor} />
                        <path
                            className="loading-mark-trace"
                            d={mark.centreLine}
                            pathLength={1}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={mark.bar}
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                        />
                        <path className="loading-mark-fill" d={mark.l} fill="currentColor" />
                    </svg>
                    <span className="loading-lar">
                        <span className="loading-lar-slide">ar</span>
                    </span>
                    <span className="loading-factory">{product}</span>
                </div>
                <div className="loading-status">
                    <p className="loading-line" role="status">
                        <span className="loading-line-slot">
                            {leavingLine && (
                                <span key={leavingLine.id} className="loading-roll-out" aria-hidden>
                                    {splashStatusText(leavingLine.text)}
                                </span>
                            )}
                            <span key={line.id} className={rolled ? 'loading-roll-in' : undefined}>
                                {splashStatusText(line.text)}
                            </span>
                        </span>
                    </p>
                    {track === undefined ? null : (
                        <div
                            className="loading-progress"
                            role="progressbar"
                            aria-label={progressLabel ?? splashStatusText(line.text)}
                            aria-valuemin={track === 'indeterminate' ? undefined : 0}
                            aria-valuemax={track === 'indeterminate' ? undefined : 100}
                            aria-valuenow={track === 'indeterminate' ? undefined : Math.round(track * 100)}
                        >
                            <span
                                className="loading-progress-bar"
                                style={track === 'indeterminate' ? undefined : { width: `${track * 100}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The status line: the current text, and for a moment after a change the old one rolling out. The first text, and
 *  every text under reduced motion, just shows; a text arriving mid-roll takes the incoming line's place. */
function useRolledLine(text: string): { line: SplashLine; leaving?: SplashLine; rolled: boolean } {
    const [lines, setLines] = useState<{ line: SplashLine; leaving?: SplashLine; rolled: boolean }>({
        line: { id: 0, text },
        rolled: false,
    });

    // A change of text shows in the same render, so the old line never paints beside the new one.
    if (lines.line.text !== text) {
        if (lines.leaving) setLines({ ...lines, line: { id: lines.line.id, text } });
        else {
            const roll = !reducedMotion();

            setLines({ line: { id: lines.line.id + 1, text }, ...(roll && { leaving: lines.line }), rolled: roll });
        }
    }

    const leaving = lines.leaving;

    useEffect(() => {
        if (!leaving) return;

        const timer = setTimeout(() => setLines((now) => ({ line: now.line, rolled: now.rolled })), ROLL_MS);

        return () => clearTimeout(timer);
    }, [leaving]);

    return lines;
}

export interface AppSplashProps {
    /** The lockup's accessible name, such as the app's name. */
    label: string;
    /** The product's name after the lockup's "ar", in grey, such as "Server" or "Factory". */
    product: string;
    /** What is happening, in a few words, such as "Connecting to your server"; it always reads with a closing
     *  ellipsis (splashStatusText adds it), and a new text rolls in. */
    status: string;
    /** Whether the mark is already drawn, such as when a native starting page drew it; otherwise it plays its draw,
     *  unless the reader prefers reduced motion. */
    drawn?: boolean;
    /** Fades the splash out, once; unmount it when the fade ends (600ms). */
    leaving?: boolean;
    /** The calm progress track under the status: `indeterminate` (the default) while how far is unknown, or a fraction
     *  from 0 to 1. Every app's splash shows it while it waits; it goes as the splash fades out. */
    progress?: number | 'indeterminate';
    /** `browser` (the default) for a web page; `desktop` in a desktop app's frameless window, which leaves the title
     *  bar's height on top and lets the window move by dragging the splash. */
    chrome?: SplashChrome;
}

/** The app's boot screen, the same in every Lar app: the Lar lockup, whose L draws itself around the block, over one
 *  status line (ending in an ellipsis) and the calm indeterminate progress track. It covers the window above everything until the app is ready,
 *  then fades out once. Render it beside the app's root, and keep the root inert while it shows. */
export function AppSplash({
    label,
    product,
    status,
    drawn = false,
    leaving = false,
    progress,
    chrome = 'browser',
}: AppSplashProps) {
    const { line, leaving: leavingLine, rolled } = useRolledLine(status);

    return (
        <SplashView
            mark={LAR_SPLASH_MARK}
            product={product}
            label={label}
            drawn={drawn}
            leaving={leaving}
            line={line}
            leavingLine={leavingLine}
            rolled={rolled}
            progress={progress}
            chrome={chrome}
        />
    );
}
