import type { CSSProperties, ReactNode } from 'react';

import { Heading, Text } from '../typography/Typography';
import { Backdrop } from './Stage';

interface HeroProps {
    announcement?: ReactNode;
    title: ReactNode;
    lead: ReactNode;
    actions?: ReactNode;
    note?: ReactNode;
    visual?: ReactNode;
    /** Tints the glow behind the hero with a product hue. */
    hue?: number;
}

/** A page's opening: a centred statement over the brand glow, then the product on its devices. */
export function Hero({ announcement, title, lead, actions, note, visual, hue }: HeroProps) {
    return (
        <section className="relative isolate">
            <Backdrop hue={hue} />
            <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 pt-8 text-center sm:px-8 sm:pt-16 lg:pt-16">
                {announcement ? <Intro delay={0}>{announcement}</Intro> : null}
                <Intro delay={60}>
                    <Heading as="h1" variant="display" className="mx-auto mt-5 max-w-[920px] whitespace-pre-line">
                        {title}
                    </Heading>
                </Intro>
                <Intro delay={140}>
                    <Text variant="lead" tone="muted" className="mx-auto mt-5 max-w-[640px]">
                        {lead}
                    </Text>
                </Intro>
                {actions ? (
                    <Intro delay={220}>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap max-sm:[&>a]:w-full max-sm:[&>a]:max-w-[320px]">
                            {actions}
                        </div>
                    </Intro>
                ) : null}
                {note ? (
                    <Intro delay={280}>
                        <Text
                            variant="body"
                            tone="muted"
                            className="mx-auto mt-4 max-w-[560px] text-balance dark:text-[#96969f]"
                        >
                            {note}
                        </Text>
                    </Intro>
                ) : null}
            </div>
            {visual ? (
                <div className="mx-auto w-full max-w-[1200px] px-5 pt-7 pb-6 sm:px-8 sm:pt-12 sm:pb-28">
                    <Intro delay={320}>{visual}</Intro>
                </div>
            ) : (
                <div className="pb-16 sm:pb-24" />
            )}
        </section>
    );
}

function Intro({ children, delay }: { children: ReactNode; delay: number }) {
    return (
        <div className="lar-intro w-full" style={{ '--lar-intro-delay': `${delay}ms` } as CSSProperties}>
            {children}
        </div>
    );
}
