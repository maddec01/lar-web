/** The Lar mark's paths on its viewBox, drawn in the order the screen animates them. */
export interface LoadingMark {
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

/** A line of the screen's step text; a new `id` rolls it in. */
export interface LoadingLine {
    id: number;
    text: string;
}

interface LoadingScreenProps {
    mark: LoadingMark;
    /** The product's name after the lockup's "ar", such as "Factory". */
    product: string;
    /** Whether the mark is already drawn, as by the desktop's starting page; otherwise it plays its draw. */
    drawn: boolean;
    /** Fades the screen out, once. */
    leaving: boolean;
    /** The step line, and for a moment after a change the old one rolling out. */
    line: LoadingLine;
    leavingLine?: LoadingLine;
    /** Whether the line rolled in; the first line and every line under reduced motion just show. */
    rolled: boolean;
}

/**
 * The board's loading screen: the Lar lockup, whose L draws itself around the block, over one line naming the first
 * read's step. It covers the window, drags it, and fades out once.
 */
export function LoadingScreen({ mark, product, drawn, leaving, line, leavingLine, rolled }: LoadingScreenProps) {
    return (
        <div className={`loading-screen ${drawn ? 'is-drawn' : ''} ${leaving ? 'is-leaving' : ''}`}>
            <div className="loading-lockup">
                <div className="loading-wordmark">
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
                <p className="loading-line" role="status">
                    <span className="loading-line-slot">
                        {leavingLine && (
                            <span key={leavingLine.id} className="loading-roll-out" aria-hidden>
                                {leavingLine.text}
                            </span>
                        )}
                        <span key={line.id} className={rolled ? 'loading-roll-in' : undefined}>
                            {line.text}
                        </span>
                    </span>
                </p>
            </div>
        </div>
    );
}
