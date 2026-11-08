import { Avatar as NinnaAvatar, type AvatarProps as NinnaAvatarProps } from '@ninna-ui/primitives';
import type { ReactNode } from 'react';

/** An avatar's look is fixed, never a class of the caller's. */
interface AvatarProps extends Omit<
    NinnaAvatarProps,
    'className' | 'style' | 'color' | 'size' | 'radius' | 'shape' | 'showRing' | 'ringColor'
> {
    /** The person's picture; without one, or while it fails, their initials. */
    src?: string;
    /** Describes the picture; leave it empty where their name is beside it. */
    alt?: string;
    /** The person's name, whose initials stand in for a missing picture. */
    name?: string;
    /** Shown in place of the initials when there is no picture. */
    fallback?: ReactNode;
    /** A generic person icon in place of initials, for someone without a name, such as a guest. */
    showFallbackIcon?: boolean;
    /** The 24px avatar beside a name in a dense list, such as a comment's author. */
    size?: 'sm' | 'md';
}

/** A person's round picture, or their initials, at 32px (`md`, the default) or 24px (`sm`). */
export function Avatar({ size = 'md', ...props }: AvatarProps) {
    return <NinnaAvatar {...props} color="neutral" size={size === 'sm' ? 'xs' : 'sm'} />;
}
