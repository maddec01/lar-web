import { type ReactNode, useId } from 'react';

import { Heading, Text } from '../typography/Typography';

const widths = {
    narrow: 'max-w-[880px]',
    default: 'max-w-[1200px]',
} as const;

const spacing = {
    hero: 'pt-16 pb-20 sm:pt-24 sm:pb-28',
    default: 'py-12 sm:py-20',
    tight: 'py-12 sm:py-20',
    /** The last band before the footer, which follows a full section. */
    closing: 'pt-0 pb-14 sm:pb-20',
} as const;

interface PageSectionProps {
    children: ReactNode;
    id?: string;
    width?: keyof typeof widths;
    space?: keyof typeof spacing;
    /** A raised band separates a section from the ones around it. */
    tone?: 'plain' | 'raised';
    /** Names the section for assistive technology when it has no SectionHeading. */
    label?: string;
    background?: ReactNode;
    /** The section's SectionHeading, set above the content with room to breathe. */
    heading?: ReactNode;
}

/** One band of a marketing page, centred in the page column. */
export function PageSection({
    children,
    id,
    width = 'default',
    space = 'default',
    tone = 'plain',
    label,
    background,
    heading,
}: PageSectionProps) {
    return (
        <section
            id={id}
            aria-label={label}
            className={`relative isolate scroll-mt-16 ${tone === 'raised' ? 'border-base-300/80 bg-base-100/70 dark:bg-base-100/50 border-y' : ''}`}
        >
            {background}
            <div className={`mx-auto w-full px-5 sm:px-8 ${widths[width]} ${spacing[space]}`}>
                {heading ? <div className="lar-reveal mb-8 sm:mb-16">{heading}</div> : null}
                {children}
            </div>
        </section>
    );
}

interface SectionHeadingProps {
    eyebrow?: string;
    title: ReactNode;
    lead?: ReactNode;
    align?: 'center' | 'start';
    level?: 'h1' | 'h2';
    size?: 'display' | 'headline';
}

/** The eyebrow, title and lead that open a section. */
export function SectionHeading({
    eyebrow,
    title,
    lead,
    align = 'center',
    level = 'h2',
    size = 'headline',
}: SectionHeadingProps) {
    const id = useId();

    return (
        <header
            aria-labelledby={id}
            className={`flex flex-col gap-4 ${align === 'center' ? 'mx-auto max-w-[760px] items-center text-center' : 'max-w-[640px]'}`}
        >
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <Heading id={id} as={level} variant={size}>
                {title}
            </Heading>
            {lead ? (
                <Text variant="lead" tone="muted" className={align === 'center' ? 'max-w-[620px]' : ''}>
                    {lead}
                </Text>
            ) : null}
        </header>
    );
}

/** A short label above a title, in the brand navy. */
export function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <span className="text-primary text-[13px] font-semibold tracking-[-0.005em] dark:text-[color-mix(in_srgb,var(--color-primary)_50%,white)]">
            {children}
        </span>
    );
}
