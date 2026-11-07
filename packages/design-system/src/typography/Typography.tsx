import type { HTMLAttributes } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';

const textStyles = {
    body: 'text-sm leading-5',
    description: 'text-[15px] leading-6',
    caption: 'text-xs leading-4',
    label: 'text-sm font-medium leading-5',
    overline: 'text-[11px] font-semibold uppercase leading-4 tracking-[0.08em]',
    metric: 'text-2xl font-semibold leading-8 tracking-[-0.02em] tabular-nums',
    /** The paragraph under a hero or section title. */
    lead: 'text-[17px] leading-[1.6] tracking-[-0.011em] sm:text-lg sm:leading-[1.6] text-pretty',
    /** Running copy on marketing pages. */
    prose: 'text-[15px] leading-[1.65] tracking-[-0.006em] text-pretty',
    /** The surrounding text's size and, unless a `tone` is given, its colour: a message inside a note or a form that
     *  sets its own type. */
    inherit: '',
} as const;

/** T3's headings: semibold with tightening tracking as they grow; the hero takes t3.codes' display setting. */
const headingStyles = {
    page: 'text-[1.375rem] font-semibold leading-7 tracking-[-0.02em]',
    section: 'text-base font-semibold leading-6 tracking-[-0.01em]',
    subsection: 'text-[15px] font-semibold leading-6 tracking-[-0.005em]',
    title: 'text-sm font-semibold leading-5',
    label: 'text-sm font-semibold leading-5',
    hero: 'text-3xl font-semibold leading-[1.05] tracking-[-0.035em] [text-box:trim-both_cap_alphabetic] sm:text-4xl lg:text-[2.875rem]',
    /** A page's one big statement. */
    display:
        'text-[2.625rem] font-semibold leading-[1.04] tracking-[-0.036em] text-balance sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]',
    /** A marketing section's title. */
    headline:
        'text-[1.875rem] font-semibold leading-[1.08] tracking-[-0.035em] text-balance sm:text-[2.5rem] lg:text-[3rem]',
    /** A feature's title inside a section. */
    feature: 'text-xl font-semibold leading-7 tracking-[-0.02em] text-balance sm:text-2xl sm:leading-8',
} as const;

const tones = {
    default: 'text-base-content',
    muted: 'text-base-700',
    soft: 'text-base-800',
    danger: 'text-danger',
    warning: 'text-warning',
    success: 'text-success',
} as const;

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    loading?: boolean;
    tone?: keyof typeof tones;
    truncate?: boolean;
}

export interface TextProps extends TypographyProps {
    as?: 'p' | 'span' | 'div';
    variant?: keyof typeof textStyles;
    /** Keeps the text on one line, such as a date that shouldn't break. */
    nowrap?: boolean;
}

export function Text({
    as: Tag = 'p',
    variant = 'body',
    tone = variant === 'inherit' ? undefined : 'default',
    truncate,
    nowrap = false,
    loading,
    className = '',
    children,
    ...props
}: TextProps) {
    return (
        <Tag
            {...props}
            className={`${textStyles[variant]} ${tone ? tones[tone] : ''} ${tone === 'muted' && (variant === 'lead' || variant === 'prose') ? 'dark:text-[#a3a3aa]' : ''} ${truncate ? 'truncate' : ''} ${nowrap ? 'whitespace-nowrap' : ''} ${loading ? `relative ${Tag === 'span' ? 'inline-block w-full' : ''}` : ''} ${className}`}
        >
            {loading ? <LoadingText /> : children}
        </Tag>
    );
}

export interface HeadingProps extends TypographyProps {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    variant?: keyof typeof headingStyles;
}

export function Heading({
    as: Tag = 'h2',
    variant = 'section',
    tone = 'default',
    truncate,
    loading,
    className = '',
    children,
    ...props
}: HeadingProps) {
    return (
        <Tag
            {...props}
            className={`${headingStyles[variant]} ${tones[tone]} ${truncate ? 'truncate' : ''} ${loading ? 'relative' : ''} ${className}`}
        >
            {loading ? <LoadingText heading={variant === 'hero'} /> : children}
        </Tag>
    );
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
