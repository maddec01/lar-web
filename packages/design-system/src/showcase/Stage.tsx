import { type CSSProperties, type PointerEvent, type ReactNode, useRef } from 'react';

/** The navy glow and fading grid behind a hero. A hue tints the glow with a product's colour. */
export function Backdrop({ hue }: { hue?: number }) {
    return (
        <div
            aria-hidden="true"
            className="lar-backdrop"
            data-hue={hue === undefined ? undefined : ''}
            style={hue === undefined ? undefined : ({ '--lar-backdrop-hue': hue } as CSSProperties)}
        />
    );
}

interface DeviceStageProps {
    /** The large device in the middle. */
    main: ReactNode;
    /** A device in front, at the lower right. */
    end?: ReactNode;
    /** A device in front, at the lower left; hidden on narrow screens. */
    start?: ReactNode;
    /** How far the scene leans back, in degrees. */
    pitch?: number;
    /** The start device's width: a tablet or TV at 'wide', a phone at 'narrow'. */
    startSize?: 'wide' | 'narrow';
    /** A close-up that floats in front, across the lower left; hidden on narrow screens. */
    callout?: ReactNode;
    /** How big the end device is: 'small' beside a hero laptop, 'large' when the phone is the point. */
    endSize?: 'small' | 'large';
    /** What a phone-width screen shows, where a laptop's text would be too small to read: the end device or the
     *  callout alone, or a readable close-up with the end device overlapping its corner. */
    narrow?: 'stage' | 'end' | 'callout' | 'pair';
    /** The close-up that 'pair' shows on phones. */
    narrowMain?: ReactNode;
    /** Which side a large end device stands on. */
    endSide?: 'left' | 'right';
}

const MAX_TILT = 2.5;

/** A group of devices in perspective that leans gently toward the pointer. */
export function DeviceStage({
    main,
    end,
    start,
    callout,
    pitch = 0,
    startSize = 'wide',
    endSize = 'small',
    narrow = 'stage',
    narrowMain,
    endSide = 'right',
}: DeviceStageProps) {
    const scene = useRef<HTMLDivElement>(null);

    function lean(event: PointerEvent<HTMLDivElement>) {
        const element = scene.current;

        if (!element || event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        element.style.setProperty('--lar-tilt-x', `${(-y * MAX_TILT).toFixed(2)}deg`);
        element.style.setProperty('--lar-tilt-y', `${(x * MAX_TILT * 1.6).toFixed(2)}deg`);
    }

    function settle() {
        scene.current?.style.removeProperty('--lar-tilt-x');
        scene.current?.style.removeProperty('--lar-tilt-y');
    }

    const alone = narrow === 'end' ? end : narrow === 'callout' ? callout : undefined;
    const pair = narrow === 'pair' && narrowMain;

    return (
        <>
            {alone ? <div className="mx-auto w-[min(60%,220px)] sm:hidden">{alone}</div> : null}
            {pair ? (
                <div className={`relative sm:hidden ${end ? 'mr-6 mb-10' : ''}`}>
                    {narrowMain}
                    {end ? (
                        <div className="absolute -right-6 -bottom-10 w-[30%] max-w-[120px] rotate-[3deg]">{end}</div>
                    ) : null}
                </div>
            ) : null}
            <div
                className={`lar-stage ${alone || pair ? 'hidden sm:block' : ''}`}
                onPointerMove={lean}
                onPointerLeave={settle}
            >
                <div
                    ref={scene}
                    className={`lar-stage__scene ${endSize === 'large' ? 'grid grid-cols-1' : ''}`}
                    style={{ '--lar-stage-pitch': `${pitch}deg` } as CSSProperties}
                >
                    <div
                        className={`lar-stage__slot relative ${endSize === 'large' ? `col-start-1 row-start-1 w-[92%] self-start sm:mt-[8%] sm:w-[84%] ${endSide === 'left' ? 'justify-self-end' : ''}` : ''}`}
                    >
                        {main}
                    </div>
                    {start ? (
                        <div
                            className={`lar-stage__slot absolute bottom-[-7%] left-[-2%] hidden [transform:translateZ(60px)_rotateY(9deg)] sm:block ${startSize === 'wide' ? 'w-[34%]' : 'w-[17%]'}`}
                        >
                            {start}
                        </div>
                    ) : null}
                    {callout ? (
                        <div className="lar-stage__slot absolute bottom-[-5%] left-[1%] hidden w-[30%] [transform:translateZ(120px)_rotateY(6deg)_rotateZ(-1.5deg)] md:block">
                            {callout}
                        </div>
                    ) : null}
                    {end ? (
                        <div
                            className={`lar-stage__slot ${endSize === 'large' ? `relative col-start-1 row-start-1 mt-[24%] w-[36%] self-start sm:mt-0 sm:w-[30%] ${endSide === 'left' ? 'justify-self-start sm:[transform:translateZ(90px)_rotateY(9deg)_rotateZ(-1deg)]' : 'justify-self-end sm:[transform:translateZ(90px)_rotateY(-9deg)_rotateZ(1deg)]'}` : 'absolute right-[-1%] bottom-[2%] w-[30%] [transform:translateZ(90px)_rotateY(-11deg)_rotateZ(1deg)] sm:w-[18%]'}`}
                        >
                            {end}
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}

/** One device turned in space, for a feature row. */
export function AngledDevice({
    children,
    angle = 'left',
}: {
    children: ReactNode;
    angle?: 'left' | 'right' | 'flat' | 'lean' | 'tilt';
}) {
    const angles = {
        left: 'sm:[transform:perspective(2400px)_rotateY(3deg)]',
        right: 'sm:[transform:perspective(2400px)_rotateY(-3deg)]',
        lean: 'sm:[transform:perspective(2600px)_rotateX(4deg)]',
        tilt: 'sm:[transform:perspective(1600px)_rotateY(-6deg)_rotateX(3deg)]',
        flat: '',
    } as const;

    return <div className={`transition-transform duration-700 ${angles[angle]}`}>{children}</div>;
}

/** Fades and lifts its content into place as it scrolls into view. */
export function Reveal({ children }: { children: ReactNode }) {
    return <div className="lar-reveal">{children}</div>;
}

/** Shows the full composition on wider screens and a readable close-up on phones. */
export function ResponsiveMedia({ wide, narrow }: { wide: ReactNode; narrow: ReactNode }) {
    return (
        <>
            <div className="hidden sm:block">{wide}</div>
            <div className="sm:hidden">{narrow}</div>
        </>
    );
}
