import type { ReactNode } from 'react';

import { BrandMark } from '../display/BrandMark';
import { TitleBar } from '../layout/TitleBar';
import { Tooltip, TooltipPopup, TooltipTrigger } from '../overlays/Tooltip';

/** The window drags from the bar, but never from a control in it. */
const drag = '[-webkit-app-region:drag] [&_:is(button,a,[tabindex])]:[-webkit-app-region:no-drag]';

interface BoardTitleBarProps {
    /** The lockup on the left, such as BoardBrand. */
    brand: ReactNode;
    /** The page's heading, for screen readers only, as the brand is hidden from them. A closing dialog whose opener
     *  went away can put the focus on it. */
    heading?: string;
    /** How the board is doing, in the status strip: the Refreshed time, then the counters after a divider. */
    refreshed?: ReactNode;
    counters?: ReactNode;
    /** The search field, up to 26rem wide beside the actions. */
    search?: ReactNode;
    actions: ReactNode;
    /** In the Mac app, where macOS draws the traffic lights; in a browser, grey stand-ins hold their place. */
    nativeWindow: boolean;
    /** Starts the bar past the traffic lights; off while full screen hides them. */
    pastLights: boolean;
}

/**
 * Lar Factory's title bar, laid out as lar-server's on the design system's TitleBar: the brand and how the board is
 * doing on the left, the search field and what you can do on the right. The bar drags the window, except on its
 * controls, and folds by its own width: below 48rem the actions take their own row and the status strip goes.
 */
export function BoardTitleBar({
    brand,
    heading,
    refreshed,
    counters,
    search,
    actions,
    nativeWindow,
    pastLights,
}: BoardTitleBarProps) {
    const status = refreshed || counters;

    return (
        <div
            data-native-window={nativeWindow || undefined}
            className={`title-bar border-base-300 shrink-0 border-b select-none ${pastLights ? 'pl-[74px]' : ''} ${drag}`}
        >
            {nativeWindow ? null : <TrafficLights />}
            {heading ? (
                <h1 className="sr-only" tabIndex={-1}>
                    {heading}
                </h1>
            ) : null}
            <TitleBar
                brand={brand}
                title={
                    status || search ? (
                        <>
                            {status ? (
                                <div className="status-strip border-base-300 bg-base-200/60 flex shrink-0 items-center gap-0.5 rounded-lg border pr-0.5 pl-1.5">
                                    {refreshed}
                                    {refreshed && counters ? (
                                        <span
                                            aria-hidden="true"
                                            className="bg-base-300 mx-0.5 h-4 w-px @max-[40rem]:hidden"
                                        />
                                    ) : null}
                                    {counters}
                                </div>
                            ) : null}
                            {search}
                        </>
                    ) : null
                }
                actions={actions}
            />
        </div>
    );
}

/** In a browser, the traffic lights' grey stand-ins, 16 px in and centred in the 52 px bar, where macOS draws them. */
function TrafficLights() {
    return (
        <div className="browser-window-controls pointer-events-none fixed top-0 left-0 z-50 flex h-13 items-center">
            <span className="traffic-lights absolute left-4 flex gap-2" aria-hidden="true">
                {['close', 'minimize', 'zoom'].map((light) => (
                    <span key={light} className="size-3 rounded-full bg-(--traffic-stand-in)" />
                ))}
            </span>
        </div>
    );
}

/** The product's lockup in the title bar: the Lar mark, "ar" and the product's name. Screen readers skip it: the
 *  page's heading names the page. */
export function BoardBrand({ product }: { product: string }) {
    return (
        <span className="brand inline-flex shrink-0" aria-hidden="true">
            <BrandMark label={`Lar ${product}`} product={product} />
        </span>
    );
}

/** A divider between groups of the title bar's actions. */
export function TitleBarDivider() {
    return <span aria-hidden="true" className="app-divider bg-base-300 mx-1 h-5 w-px shrink-0" />;
}

export type RefreshHealth = 'waiting' | 'live' | 'stale' | 'disconnected';

const dots: Record<RefreshHealth, string> = {
    waiting: 'bg-base-500',
    live: 'bg-success',
    stale: 'bg-amber-500',
    disconnected: 'bg-danger',
};

interface RefreshIndicatorProps {
    health: RefreshHealth;
    /** What the time says, such as "12s" or "Stale · 2m"; hidden on a narrow bar, where the dot speaks alone. */
    label: ReactNode;
    /** A count of reads landed while this page was open: each new one pings the dot once, while live. */
    landed: number;
    /** The tooltip's two lines: when the board last read, then how it reads or what went wrong. */
    detail: string;
    secondaryDetail: string;
}

/**
 * How fresh the board is, in the title bar's status strip: a dot in the health's colour (amber when stale, red while
 * the page has lost the board server) and the time since the last read, with more in a tooltip. A tab stop, so
 * keyboard users reach its tooltip.
 */
export function RefreshIndicator({ health, label, landed, detail, secondaryDetail }: RefreshIndicatorProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    tabIndex={0}
                    className="refreshed text-base-700 focus-visible:ring-primary inline-flex h-6 shrink-0 items-center gap-1.5 rounded-sm px-1 text-xs whitespace-nowrap tabular-nums outline-none focus-visible:ring-2 @max-[40rem]:hidden @min-[48rem]:min-w-30"
                >
                    <span className="relative grid size-2 place-items-center">
                        {landed > 0 && health === 'live' && (
                            <span
                                key={landed}
                                data-ping
                                className="bg-success absolute size-1.5 rounded-full motion-safe:animate-[refreshed-ping_1.2s_ease-out_forwards]"
                            />
                        )}
                        <span data-dot className={`size-1.5 rounded-full ${dots[health]}`} />
                    </span>
                    <span className="@max-[48rem]:sr-only">{label}</span>
                </span>
            </TooltipTrigger>
            <TooltipPopup side="bottom">
                <span className="flex flex-col gap-0.5">
                    <span data-line>{detail}</span>
                    <span data-line className="text-base-700">
                        {secondaryDetail}
                    </span>
                </span>
            </TooltipPopup>
        </Tooltip>
    );
}
