import { type ReactNode, useId } from 'react';

import { Heading, TextBase } from '../typography/Typography';

const widths = {
    narrow: 'max-w-220',
    default: 'max-w-page',
} as const;

const spacing = {
    hero: 'pt-16 pb-20 sm:pt-24 sm:pb-28',
    default: 'py-12 sm:py-20',
    tight: 'py-12 sm:py-20',
    /** The last band before the footer, which follows a full section. */
    closing: 'pt-0 pb-14 sm:pb-20',
} as const;

interface PageSectionProps {
    /** The section's content, under its heading. */
    children: ReactNode;
    /** An anchor for in-page links, which land clear of the sticky header. */
    id?: string;
    /** `default` is the page column (75rem); `narrow` a reading measure (55rem). */
    width?: keyof typeof widths;
    /** The band's vertical room: `hero` for the page's first, `closing` for the last before the footer, `default`
     *  or `tight` between. */
    space?: keyof typeof spacing;
    /** `raised` sets a section apart from the ones around it on a band of its own; `plain` (the default) doesn't. */
    variant?: 'plain' | 'raised';
    /** Names the section for assistive technology when it has no SectionHeading. */
    label?: string;
    /** Art behind the band, such as a Backdrop. */
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
    variant = 'plain',
    label,
    background,
    heading,
}: PageSectionProps) {
    return (
        <section
            id={id}
            aria-label={label}
            className={`relative isolate scroll-mt-16 ${variant === 'raised' ? 'border-line/80 bg-surface-glass border-y' : ''}`}
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
    /** A short label above the title, in the brand navy. */
    eyebrow?: string;
    /** The section's title. */
    title: ReactNode;
    /** A sentence under the title that carries the section's point. */
    lead?: ReactNode;
    /** `center` (the default) for a band of its own; `start` beside other content. */
    align?: 'center' | 'start';
    /** The title's heading level; `h1` only for the page's opening section. */
    level?: 'h1' | 'h2';
    /** The title's heading variant: `headline` (the default) for a section; `display` for the page's one big
     *  statement. */
    variant?: 'display' | 'headline';
}

/** The eyebrow, title and lead that open a section. */
export function SectionHeading({
    eyebrow,
    title,
    lead,
    align = 'center',
    level = 'h2',
    variant = 'headline',
}: SectionHeadingProps) {
    const id = useId();

    return (
        <header
            aria-labelledby={id}
            className={`flex flex-col gap-4 ${align === 'center' ? 'mx-auto max-w-190 items-center text-center' : 'max-w-160'}`}
        >
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <Heading id={id} as={level} variant={variant}>
                {title}
            </Heading>
            {lead ? (
                <TextBase variant="lead" tone="muted" className={align === 'center' ? 'max-w-155' : ''}>
                    {lead}
                </TextBase>
            ) : null}
        </header>
    );
}

/** A short label above a title, in the brand navy. */
export function Eyebrow({
    children,
}: {
    /** The label's text. */
    children: ReactNode;
}) {
    return <span className="text-primary-fg text-ui tracking-heading font-semibold">{children}</span>;
}
