import { Badge as NinnaBadge, type BadgeProps as NinnaBadgeProps } from '@ninna-ui/primitives';
import type { CSSProperties } from 'react';

import type { StatusTone } from '../feedback/StatusIndicator';
import { tint } from './LabelTint';

/** A badge's look is its tone or label colour, never a class or style of the caller's. */
export interface BadgeProps extends Omit<
    NinnaBadgeProps,
    'color' | 'size' | 'variant' | 'radius' | 'className' | 'style'
> {
    /** The status colour it's tinted in: neutral for a plain tag, accent for a highlight that isn't a status. */
    tone?: StatusTone | 'accent';
    /** sm (20px) for a row, a card or a field; md (24px) for a heading's or a hero's status. */
    size?: 'sm' | 'md';
    /** A tracker label's own colour, such as GitHub's, as a soft tint readable in both modes; anything but a colour
     *  keeps the tone. */
    labelColor?: string | undefined;
    /** Dims the text to the muted colour, for an entry that is listed but switched off. */
    muted?: boolean;
}

type BadgeBaseProps = BadgeProps &
    Pick<NinnaBadgeProps, 'className' | 'style'> & {
        /** A hue (an oklch hue angle, such as 25) that colours the badge in place of its tone, as a soft tint with text
         *  and a hairline in the hue, such as a kind's own colour. */
        hue?: number | undefined;
    };

/** The one badge: a pill on a soft tint of its tone, in the tone's text colour, edged by a hairline of the tone.
 *  Kinds, labels, counts, states and formats all take it. */
const toneClasses: Record<NonNullable<BadgeBaseProps['tone']>, string> = {
    neutral: 'bg-fill-muted text-fg-soft ring-line',
    accent: 'bg-primary-surface text-primary-fg ring-primary-ring',
    success: 'bg-success-surface text-success-fg ring-success-ring',
    warning: 'bg-warning-surface text-warning-fg ring-warning-ring',
    danger: 'bg-danger-surface text-danger-fg ring-danger-ring',
    info: 'bg-info-surface text-info-fg ring-info-ring',
};

const sizeClasses: Record<NonNullable<BadgeBaseProps['size']>, string> = {
    sm: 'h-5 gap-1 px-2 [&>svg]:size-3',
    md: 'h-6 gap-1.5 px-2.5 [&>svg]:size-3.5',
};

/** The badge for compositions (the design system's own and an app's UI layer), which may fit it to their layout
 *  with a class or colour it by a hue. */
export function BadgeBase({
    tone = 'neutral',
    size = 'sm',
    hue,
    labelColor,
    muted = false,
    className = '',
    style,
    ...props
}: BadgeBaseProps) {
    const labelTint = tint(labelColor);

    return (
        <NinnaBadge
            {...props}
            color={tone === 'accent' ? 'primary' : tone}
            size="sm"
            variant="soft"
            style={
                hue !== undefined
                    ? ({ ...style, '--lar-kind-hue': hue } as CSSProperties)
                    : labelTint
                      ? { ...style, ...labelTint }
                      : style
            }
            className={`rounded-full py-0 text-xs font-medium ring-1 ring-inset [&>svg]:shrink-0 ${sizeClasses[size]} ${hue === undefined ? toneClasses[tone] : 'kind-badge!'} ${muted ? 'text-fg-muted' : ''} ${className}`}
        />
    );
}

/** The one badge, for a state, a count, a label or a format. */
export function Badge(props: BadgeProps) {
    return <BadgeBase {...props} />;
}
