import { Avatar as NinnaAvatar, type AvatarProps as NinnaAvatarProps } from '@ninna-ui/primitives';
import type { ReactNode } from 'react';

import { avatarHueOf } from './AvatarHue';

/** Up to two initials: a name's first and last words, or an email's local part split at dots, dashes and the like. */
function initialsOf(name: string) {
    const words = (name.includes('@') ? (name.split('@')[0] ?? name) : name).split(/[\s._+-]+/).filter(Boolean);
    const first = (word: string | undefined) => (word ? (Array.from(word)[0] ?? '') : '');

    return (first(words[0]) + (words.length > 1 ? first(words.at(-1)) : '')).toLocaleUpperCase();
}

const sizes = {
    sm: { ninna: 'xs', box: 'size-6 text-2xs' },
    bar: { ninna: 'sm', box: 'size-7 text-xs' },
    md: { ninna: 'sm', box: 'size-8 text-xs' },
    lg: { ninna: 'lg', box: 'size-12 text-base' },
} as const;

/** An avatar's look is fixed, never a class of the caller's. */
interface AvatarProps extends Omit<
    NinnaAvatarProps,
    'className' | 'style' | 'color' | 'size' | 'radius' | 'shape' | 'showRing' | 'ringColor'
> {
    /** The person's picture; without one, or while it fails, their initials. */
    src?: string;
    /** Describes the picture; leave it empty where their name is beside it. */
    alt?: string;
    /** The person's name, whose initials stand in for a missing picture (or their email, when that is all there is). */
    name?: string;
    /** Shown in place of the initials when there is no picture. */
    fallback?: ReactNode;
    /** A generic person icon in place of initials, for someone without a name, such as a guest. */
    showFallbackIcon?: boolean;
    /** A stable key for the person, such as their email: without a picture, their initials sit on their own
     *  categorical tint (an 18% fill, a 30% edge), the same hue for the same key in every app (avatarHueOf). Left out,
     *  the initials are neutral. */
    hueKey?: string;
    /** `md` (the default) 32px; `sm` 24px beside a name in a dense list, such as a comment's author; `bar` 28px, the
     *  title bar's identity button; `lg` 48px, heading an account page. */
    size?: keyof typeof sizes;
}

/** A person's round picture, or their initials (in their own hue, with a `hueKey`), at 24, 28, 32 or 48px. */
export function Avatar({ size = 'md', hueKey, ...props }: AvatarProps) {
    const look = sizes[size];

    if (hueKey !== undefined && !props.src && props.name !== undefined)
        return (
            <span
                aria-hidden={props.alt ? undefined : true}
                role={props.alt ? 'img' : undefined}
                aria-label={props.alt || undefined}
                data-slot="avatar"
                className={`${avatarHueOf(hueKey)} categorical-avatar flex shrink-0 items-center justify-center rounded-full leading-none font-semibold select-none ${look.box}`}
            >
                {initialsOf(props.name)}
            </span>
        );

    return (
        <NinnaAvatar {...props} color="neutral" size={look.ninna} className={size === 'bar' ? 'h-7 w-7' : undefined} />
    );
}
