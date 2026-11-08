import type { CSSProperties, ReactNode } from 'react';

import { HeadingBase, TextBase } from '../typography/Typography';
import { Backdrop } from './Stage';

interface HeroProps {
    /** An Announcement pill above the title. */
    announcement?: ReactNode;
    /** The page's statement, as its h1. */
    title: ReactNode;
    /** A sentence under the title. */
    lead: ReactNode;
    /** The ways in, such as Download. */
    actions?: ReactNode;
    /** A small line under the actions. */
    note?: ReactNode;
    /** The product on its devices, under the statement. */
    visual?: ReactNode;
    /** Tints the glow behind the hero with a product hue. */
    hue?: number;
}

/** A page's opening: a centred statement over the brand glow, then the product on its devices. */
export function Hero({ announcement, title, lead, actions, note, visual, hue }: HeroProps) {
    return (
        <section className="relative isolate">
            <Backdrop hue={hue} />
            <div className="max-w-page mx-auto flex w-full flex-col items-center px-5 pt-8 text-center sm:px-8 sm:pt-16 lg:pt-16">
                {announcement ? <Intro delay={0}>{announcement}</Intro> : null}
                <Intro delay={60}>
                    <HeadingBase as="h1" variant="display" className="mx-auto mt-5 max-w-230 whitespace-pre-line">
                        {title}
                    </HeadingBase>
                </Intro>
                <Intro delay={140}>
                    <TextBase variant="lead" tone="muted" className="mx-auto mt-5 max-w-160">
                        {lead}
                    </TextBase>
                </Intro>
                {actions ? (
                    <Intro delay={220}>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap max-sm:[&>a]:w-full max-sm:[&>a]:max-w-80">
                            {actions}
                        </div>
                    </Intro>
                ) : null}
                {note ? (
                    <Intro delay={280}>
                        <TextBase variant="body" tone="lead" className="mx-auto mt-4 max-w-140 text-balance">
                            {note}
                        </TextBase>
                    </Intro>
                ) : null}
            </div>
            {visual ? (
                <div className="max-w-page mx-auto w-full px-5 pt-7 pb-6 sm:px-8 sm:pt-12 sm:pb-28">
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
