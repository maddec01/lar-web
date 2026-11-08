import type { HTMLAttributes, ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';

const textStyles = {
    body: 'text-sm leading-5',
    description: 'text-md leading-6',
    caption: 'text-xs leading-4',
    label: 'text-sm font-medium leading-5',
    overline: 'text-2xs font-semibold uppercase leading-4 tracking-caps',
    metric: 'text-2xl font-semibold leading-8 tracking-title tabular-nums',
    /** The paragraph under a hero or section title. */
    lead: 'text-lg leading-[1.6] tracking-heading text-pretty',
    /** Running copy on marketing pages. */
    prose: 'text-md leading-[1.65] tracking-heading text-pretty',
    /** The surrounding text's size and, unless a `tone` is given, its colour: a message inside a note or a form that
     *  sets its own type. */
    inherit: '',
} as const;

/** T3's headings: semibold with tightening tracking as they grow; the hero takes t3.codes' display setting. */
const headingStyles = {
    page: 'text-title font-semibold leading-7 tracking-title',
    section: 'text-base font-semibold leading-6 tracking-heading',
    subsection: 'text-md font-semibold leading-6 tracking-heading',
    title: 'text-sm font-semibold leading-5',
    label: 'text-sm font-semibold leading-5',
    hero: 'text-3xl font-semibold leading-[1.05] tracking-display [text-box:trim-both_cap_alphabetic] sm:text-4xl lg:text-5xl',
    /** A page's one big statement. */
    display:
        'text-headline font-semibold leading-[1.04] tracking-display text-balance sm:text-6xl lg:text-7xl xl:text-display',
    /** A marketing section's title. */
    headline: 'text-3xl font-semibold leading-[1.08] tracking-display text-balance sm:text-headline lg:text-5xl',
    /** A feature's title inside a section. */
    feature: 'text-xl font-semibold leading-7 tracking-title text-balance sm:text-2xl sm:leading-8',
} as const;

const tones = {
    default: 'text-fg',
    muted: 'text-fg-muted',
    /** Muted long-form text: a lead, prose or a caption under a hero, a step lighter than `muted` in dark. */
    lead: 'text-fg-lead',
    soft: 'text-fg-soft',
    danger: 'text-danger-fg',
    warning: 'text-warning-fg',
    success: 'text-success-fg',
} as const;

interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'className' | 'style'> {
    /** The text. */
    children?: ReactNode;
    /** Draws a skeleton line in the text's place, keeping its line box, while its content loads. */
    loading?: boolean;
    /** The text's colour by role: `default`, `muted`, `lead` (muted long-form), `soft`, or a status's text colour. */
    tone?: keyof typeof tones;
    /** Keeps it to one line, cut off with an ellipsis. */
    truncate?: boolean;
}

/** A text's look is its variant and tone, never a class of the caller's. */
export interface TextProps extends TypographyProps {
    /** The element it renders: a paragraph (the default), or a `span` or `div` where a paragraph can't go. */
    as?: 'p' | 'span' | 'div';
    /** The text's role, which sets its size, weight and line height: `body`, `description`, `caption`, `label`,
     *  `overline`, `metric`, `lead`, `prose`, or `inherit` for the surrounding text's. */
    variant?: keyof typeof textStyles;
    /** Keeps the text on one line, such as a date that shouldn't break. */
    nowrap?: boolean;
    /** Lines its figures up as a table's. */
    numeric?: boolean;
    /** Lets a long word, such as a path, break anywhere. */
    breaks?: boolean;
    /** Takes a line of its own in a wrapping row. */
    ownLine?: boolean;
    /** Limits supporting prose to the shared 75ch reading measure. */
    measure?: 'reading';
    /** Shows it only in a container under 40rem (`narrow`) or, on one line, in one 40rem or wider (`wide`), where the
     *  same words show elsewhere in the other. */
    only?: keyof typeof containers | undefined;
}

const containers = { narrow: '@pane:hidden', wide: 'whitespace-nowrap @max-pane:hidden' } as const;

type TextBaseProps = TextProps & Pick<HTMLAttributes<HTMLElement>, 'className' | 'style'>;

/** The text for the design system's own compositions, which may fit it to their layout with a class. */
export function TextBase({
    as: Tag = 'p',
    variant = 'body',
    tone = variant === 'inherit' ? undefined : 'default',
    truncate,
    nowrap = false,
    numeric = false,
    breaks = false,
    ownLine = false,
    measure,
    only,
    loading,
    className = '',
    children,
    ...props
}: TextBaseProps) {
    const layout = `${numeric ? ' tabular-nums' : ''}${breaks ? ' wrap-anywhere' : ''}${ownLine ? ' w-full' : ''}${measure ? ' max-w-reading' : ''}${only ? ` ${containers[only]}` : ''}`;

    return (
        <Tag
            {...props}
            className={`${textStyles[variant]} ${tone ? tones[tone === 'muted' && (variant === 'lead' || variant === 'prose') ? 'lead' : tone] : ''} ${truncate ? 'truncate' : ''} ${nowrap ? 'whitespace-nowrap' : ''} ${loading ? `relative ${Tag === 'span' ? 'inline-block w-full' : ''}` : ''} ${className}${layout}`}
        >
            {loading ? <LoadingText /> : children}
        </Tag>
    );
}

/** Lar's body text, in one of its roles and tones. */
export function Text(props: TextProps) {
    return <TextBase {...props} />;
}

/** A heading's look is its variant and tone, never a class of the caller's. */
export interface HeadingProps extends TypographyProps {
    /** The heading's level in the page's outline (`h2` by default), independent of its look. */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** The heading's look by role: `page`, `section`, `subsection`, `title`, `label`, or the website's `hero`,
     *  `display`, `headline` and `feature`. */
    variant?: keyof typeof headingStyles;
}

type HeadingBaseProps = HeadingProps & Pick<HTMLAttributes<HTMLElement>, 'className' | 'style'>;

/** The heading for the design system's own compositions, which may fit it to their layout with a class. */
export function HeadingBase({
    as: Tag = 'h2',
    variant = 'section',
    tone = 'default',
    truncate,
    loading,
    className = '',
    children,
    ...props
}: HeadingBaseProps) {
    return (
        <Tag
            {...props}
            className={`${headingStyles[variant]} ${tones[tone]} ${truncate ? 'truncate' : ''} ${loading ? 'relative' : ''} ${className}`}
        >
            {loading ? <LoadingText heading={variant === 'hero'} /> : children}
        </Tag>
    );
}

/** Lar's heading: a level in the outline, drawn in one of its roles. */
export function Heading(props: HeadingProps) {
    return <HeadingBase {...props} />;
}

/** An invisible glyph retains the font's line box, including cap-height trimming. */
function LoadingText({ heading = false }: { heading?: boolean }) {
    return (
        <>
            <span aria-hidden="true" className="invisible">
                &nbsp;
            </span>
            <span aria-hidden="true" className="absolute inset-0 flex items-center">
                <SkeletonLoader.Shape presentation={heading ? 'heading' : 'line'} />
            </span>
        </>
    );
}
