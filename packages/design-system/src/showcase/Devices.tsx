import type { CSSProperties, ReactNode } from 'react';

export interface ScreenshotProps {
    /** The screenshot shown with the dark theme, and with both when there is no light one. */
    dark: string;
    /** The screenshot shown with the light theme. */
    light?: string;
    /** What the screenshot shows. */
    alt: string;
    /** A stable close-up within the source capture. Keep the source composition on recapture; see the crop table. */
    detail?: 'album-shelf' | 'concept-dependencies' | 'build-slices' | 'item-create' | 'server-users';
    /** Loads at once, for the first screen of a page. */
    eager?: boolean;
    /** Natural pixel size, so the browser can reserve the space before the image arrives. */
    width?: number;
    /** Natural pixel height, with `width` reserving the space before the image arrives. */
    height?: number;
}

/** A product screenshot that follows the page's theme when it has a light and a dark capture. Until it decodes, its
 *  space (reserved by `width` and `height`) shows a tinted placeholder; pass `eager` for the first screen of a page. */
export function Screenshot({ dark, light, alt, eager, width, height, detail }: ScreenshotProps) {
    const image = {
        alt,
        loading: eager ? 'eager' : 'lazy',
        fetchPriority: eager ? 'high' : 'auto',
        width,
        height,
        decoding: 'async',
    } as const;

    const images = !light ? (
        <img {...image} src={dark} className="lar-screenshot" />
    ) : (
        <>
            <img {...image} src={light} className="lar-screenshot dark:hidden!" />
            <img {...image} src={dark} className="lar-screenshot hidden! dark:block!" />
        </>
    );

    if (!detail) return images;

    const crop = screenshotDetails[detail];

    return (
        <div
            className="lar-screenshot-detail"
            style={
                {
                    aspectRatio: `${crop.width} / ${crop.height}`,
                    '--lar-shot-width': `${(crop.sourceWidth / crop.width) * 100}%`,
                    '--lar-shot-height': `${(crop.sourceHeight / crop.height) * 100}%`,
                    '--lar-shot-left': `${(-crop.x / crop.width) * 100}%`,
                    '--lar-shot-top': `${(-crop.y / crop.height) * 100}%`,
                } as CSSProperties
            }
        >
            {images}
        </div>
    );
}

// Source-pixel contracts, independent of output size. Recapture these same regions at the same source aspect:
// shelf: five complete albums; map: the whole concept map, both lanes and the outcome check; mobile: an inset slice /
// the Add item action strip.
// Stack that strip with a complete desk card to preserve tracker and project identity.
// Factory close-ups retain a matching UI scale: the 494px action strip uses a 240px Callout;
// a 740px desk card a 330px Callout; a 434px slice a 330px Callout (the slice capture has a lower pixel density).
// Preserve these compositions and relative UI sizes on recapture; the percentages also support higher-resolution exports.
const screenshotDetails = {
    'album-shelf': { sourceWidth: 2400, sourceHeight: 833, x: 900, y: 202, width: 1490, height: 400 },
    'concept-dependencies': { sourceWidth: 2244, sourceHeight: 812, x: 0, y: 0, width: 2244, height: 812 },
    'build-slices': { sourceWidth: 1000, sourceHeight: 879, x: 0, y: 205, width: 434, height: 78 },
    'item-create': { sourceWidth: 2400, sourceHeight: 1500, x: 1890, y: 0, width: 494, height: 104 },
    // Three complete user identities and their access summaries, readable in a phone-width column.
    'server-users': { sourceWidth: 1400, sourceHeight: 689, x: 390, y: 233, width: 575, height: 363 },
} as const;

interface FrameProps {
    /** The screenshot on the display. */
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
}: FrameProps & {
    /** The app's name in the menu bar. */
    app: string;
    /** The app's menus in the menu bar. */
    menu?: readonly string[];
    /** The clock at the menu bar's end. */
    time?: string;
}) {
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
export function TabletFrame({
    children,
    shadow = true,
    aspect = '4 / 3',
}: FrameProps & {
    /** The display's aspect ratio: `4 / 3` by default. */
    aspect?: string;
}) {
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
export function TvFrame({
    children,
    shadow = true,
    stand = true,
}: FrameProps & {
    /** Draws the pedestal under the screen; on by default. */
    stand?: boolean;
}) {
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
    scheme,
}: FrameProps & {
    /** The address shown in the field. */
    address: string;
    /** The display's aspect ratio, such as `4 / 3`, when the screenshot doesn't set it. */
    aspect?: string;
    /** Dissolves the edges where the capture is cropped: `right`, `bottom`, `both`, `under` or `tail`. */
    fade?: 'right' | 'bottom' | 'both' | 'under' | 'tail';
    /** `dark` dresses the window dark in both themes, for a dark-only capture. */
    scheme?: 'dark';
}) {
    return (
        <div
            className={`lar-device ${scheme === 'dark' ? 'dark lar-dark-palette' : ''}`}
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
 *  A bezel follows the page’s light or dark metal tokens;
 *  a fade dissolves an edge where the capture is cropped. */
export function AppWindow({
    children,
    shadow = true,
    bezel,
    fade,
}: FrameProps & {
    /** Sets the capture in a theme-aware display edge. */
    bezel?: boolean;
    /** Dissolves the edges where the capture is cropped. */
    fade?: 'right' | 'bottom' | 'both';
}) {
    return (
        <div className="lar-device" data-shadow={shadow ? 'float' : undefined}>
            <div className="lar-app-window" data-bezel={bezel || undefined} data-fade={fade}>
                <div className="lar-app-window__fade">{children}</div>
            </div>
        </div>
    );
}

/** A close-up cut from a screenshot, raised on glass above a device to point at one detail. */
export function Callout({
    children,
    size = 'md',
    fade,
}: {
    /** The close-up cut from the screenshot. */
    children: ReactNode;
    /** `sm` is a narrower close-up, centred, for a phone-width column; `md` (the default) the full width. */
    size?: 'sm' | 'md';
    /** Dissolves the close-up's edges into the glass. */
    fade?: boolean;
}) {
    return (
        <div className={`lar-callout ${size === 'sm' ? 'mx-auto w-full max-w-60' : ''}`} data-fade={fade || undefined}>
            <div className="lar-callout__fade">{children}</div>
        </div>
    );
}

/** A close-up with a smaller detail card overlapping its lower corner. */
export function CalloutPair({
    base,
    detail,
}: {
    /** The main close-up. */
    base: ReactNode;
    /** The smaller card over its lower corner. */
    detail: ReactNode;
}) {
    return (
        <div className="relative pb-[18%]">
            {base}
            <div className="absolute right-[-2%] bottom-0 w-[62%] rotate-[1.5deg]">{detail}</div>
        </div>
    );
}

/** Close-ups one under another, for a phone-width column. */
export function CalloutStack({
    children,
}: {
    /** The close-ups, one under another. */
    children: ReactNode;
}) {
    return <div className="mx-auto flex max-w-82.5 flex-col gap-3">{children}</div>;
}

/** Media with a short numbered guide below it, so every part of the product remains visible. */
export function GuidedMedia({
    children,
    guide,
    label,
}: {
    /** The media the guide reads over. */
    children: ReactNode;
    /** The guide's short numbered steps. */
    guide: readonly string[];
    /** Names the guide for screen readers. */
    label: string;
}) {
    return (
        <div className="relative flex flex-col gap-4">
            {children}
            <ol aria-label={label} className="text-fg grid gap-3 text-sm leading-5 md:grid-cols-3 md:gap-6">
                {guide.map((step, index) => (
                    <li key={step} className="flex gap-2.5">
                        <span className="bg-primary text-primary-content text-2xs inline-flex size-5 shrink-0 items-center justify-center rounded-full font-semibold tabular-nums">
                            {index + 1}
                        </span>
                        {step}
                    </li>
                ))}
            </ol>
        </div>
    );
}
