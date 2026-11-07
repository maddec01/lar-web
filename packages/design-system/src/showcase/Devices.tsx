import type { ReactNode } from 'react';

export interface ScreenshotProps {
    /** The screenshot shown with the dark theme, and with both when there is no light one. */
    dark: string;
    light?: string;
    alt: string;
    /** Loads at once, for the first screen of a page. */
    eager?: boolean;
    /** Natural pixel size, so the browser can reserve the space before the image arrives. */
    width?: number;
    height?: number;
}

/** A product screenshot that follows the page's theme when it has a light and a dark capture. */
export function Screenshot({ dark, light, alt, eager, width, height }: ScreenshotProps) {
    const loading = eager ? 'eager' : 'lazy';
    const priority = eager ? 'high' : 'auto';

    if (!light)
        return (
            <img
                src={dark}
                alt={alt}
                loading={loading}
                fetchPriority={priority}
                width={width}
                height={height}
                decoding="async"
            />
        );

    return (
        <>
            <img
                src={light}
                alt={alt}
                loading={loading}
                fetchPriority={priority}
                width={width}
                height={height}
                decoding="async"
                className="dark:hidden!"
            />
            <img
                src={dark}
                alt={alt}
                loading={loading}
                width={width}
                height={height}
                decoding="async"
                className="hidden! dark:block!"
            />
        </>
    );
}

interface FrameProps {
    children: ReactNode;
    /** A soft contact shadow under the device. */
    shadow?: boolean;
}

/** A MacBook Pro: a notched display with the macOS menu bar, on an aluminium base that follows the theme. */
export function LaptopFrame({
    children,
    shadow = true,
    app,
    menu = [],
    time,
}: FrameProps & { app: string; menu?: readonly string[]; time?: string }) {
    return (
        <div className="lar-device lar-laptop" data-shadow={shadow ? 'float' : undefined}>
            <div className="lar-laptop__lid">
                <div className="lar-laptop__screen">
                    <div className="lar-laptop__menubar" aria-hidden="true">
                        <LarMenuMark />
                        <span>{app}</span>
                        {menu.map((item) => (
                            <span key={item}>{item}</span>
                        ))}
                        {time ? <time>{time}</time> : null}
                    </div>
                    <div className="lar-laptop__notch" aria-hidden="true" />
                    <div className="lar-laptop__app">{children}</div>
                </div>
            </div>
            <div className="lar-laptop__base" aria-hidden="true" />
        </div>
    );
}

/** The menu bar's leading glyph: the Lar mark stands in for the Apple menu, so the frame claims no one's logo. */
function LarMenuMark() {
    return (
        <svg viewBox="0 0 100 100" className="size-[1.3cqi] shrink-0" aria-hidden="true">
            <path d="M0 0H27.52V72.48H100V100H3a3 3 0 0 1-3-3z" fill="currentColor" />
            <path
                d="M50.68 0H91.97a8.03 8.03 0 0 1 8.03 8.03V49.32a8.03 8.03 0 0 1-8.03 8.03H50.68a8.03 8.03 0 0 1-8.03-8.03V8.03a8.03 8.03 0 0 1 8.03-8.03z"
                fill="currentColor"
            />
        </svg>
    );
}

/** An iPhone Pro with its Dynamic Island and side buttons, for an iOS screenshot at 1206 × 2622. */
export function PhoneFrame({ children, shadow = true }: FrameProps) {
    return (
        <div className="lar-device" data-shadow={shadow ? 'float' : undefined}>
            <div className="lar-phone">
                <i className="lar-phone__button lar-phone__button--action" aria-hidden="true" />
                <i className="lar-phone__button lar-phone__button--volume-up" aria-hidden="true" />
                <i className="lar-phone__button lar-phone__button--volume-down" aria-hidden="true" />
                <i className="lar-phone__button lar-phone__button--side" aria-hidden="true" />
                <div className="lar-phone__screen">
                    <div className="lar-phone__island" aria-hidden="true" />
                    {children}
                </div>
            </div>
        </div>
    );
}

/** An iPad Pro with even, thin bezels; the screenshot sets the aspect ratio. */
export function TabletFrame({ children, shadow = true, aspect = '4 / 3' }: FrameProps & { aspect?: string }) {
    return (
        <div className="lar-device" data-shadow={shadow ? 'float' : undefined}>
            <div className="lar-tablet">
                <div className="lar-tablet__screen" style={{ aspectRatio: aspect }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

/** A slim television on a pedestal, for a 16:9 capture. */
export function TvFrame({ children, shadow = true, stand = true }: FrameProps & { stand?: boolean }) {
    return (
        <div className="lar-device lar-tv" data-shadow={shadow ? 'float' : undefined}>
            <div className="lar-tv__panel">
                <div className="lar-tv__screen">{children}</div>
            </div>
            {stand ? <div className="lar-tv__stand" aria-hidden="true" /> : null}
        </div>
    );
}

/** A Safari-style window with traffic lights and an address field. */
export function BrowserFrame({
    children,
    shadow = true,
    address,
    aspect = '16 / 10',
    fade,
    tone,
}: FrameProps & {
    address: string;
    aspect?: string;
    fade?: 'right' | 'bottom' | 'both' | 'under' | 'tail';
    tone?: 'dark';
}) {
    return (
        <div
            className={`lar-device ${tone === 'dark' ? 'dark lar-dark-palette' : ''}`}
            data-shadow={shadow ? 'float' : undefined}
        >
            <div className="lar-window" data-fade={fade === 'bottom' || fade === 'tail' ? fade : undefined}>
                <div className="lar-window__bar" aria-hidden="true">
                    <span className="lar-window__lights">
                        <i />
                        <i />
                        <i />
                    </span>
                    <span className="lar-window__address">{address}</span>
                </div>
                <div
                    className="lar-window__screen"
                    data-fade={fade === 'bottom' || fade === 'tail' ? undefined : fade}
                    style={{ aspectRatio: aspect }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

/** A Mac app window whose screenshot already carries its own title bar: corners, a hairline and depth only.
 *  A bezel sets a dark-only capture in a dark display edge, so it reads as a deliberate dark shot on a light page;
 *  a fade dissolves an edge where the capture is cropped. */
export function AppWindow({
    children,
    shadow = true,
    bezel,
    fade,
}: FrameProps & { bezel?: boolean; fade?: 'right' | 'bottom' | 'both' }) {
    return (
        <div className="lar-device" data-shadow={shadow ? 'float' : undefined}>
            <div className="lar-app-window" data-bezel={bezel || undefined} data-fade={fade}>
                <div className="lar-app-window__fade">{children}</div>
            </div>
        </div>
    );
}

/** A close-up cut from a screenshot, raised on glass above a device to point at one detail. */
export function Callout({ children, compact, fade }: { children: ReactNode; compact?: boolean; fade?: boolean }) {
    return (
        <div className={`lar-callout ${compact ? 'mx-auto max-w-[240px]' : ''}`} data-fade={fade || undefined}>
            <div className="lar-callout__fade">{children}</div>
        </div>
    );
}

/** A close-up with a smaller detail card overlapping its lower corner. */
export function CalloutPair({ base, detail }: { base: ReactNode; detail: ReactNode }) {
    return (
        <div className="relative pb-[18%]">
            {base}
            <div className="absolute right-[-2%] bottom-0 w-[62%] rotate-[1.5deg]">{detail}</div>
        </div>
    );
}

/** Close-ups one under another, for a phone-width column. */
export function CalloutStack({ children }: { children: ReactNode }) {
    return <div className="mx-auto flex max-w-[330px] flex-col gap-3">{children}</div>;
}

/** Media with a short, numbered reading guide floating over a quiet corner of it, on wide screens. */
export function GuidedMedia({
    children,
    guide,
    label,
}: {
    children: ReactNode;
    guide: readonly string[];
    label: string;
}) {
    return (
        <div className="relative flex flex-col gap-4">
            {children}
            <ol
                aria-label={label}
                className="text-base-content md:glass-menu flex flex-col gap-2 text-sm leading-5 md:absolute md:top-[8%] md:right-[4%] md:max-w-[260px] md:rounded-xl md:p-4"
            >
                {guide.map((step, index) => (
                    <li key={step} className="flex gap-2.5">
                        <span className="bg-primary text-primary-content inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums">
                            {index + 1}
                        </span>
                        {step}
                    </li>
                ))}
            </ol>
        </div>
    );
}
