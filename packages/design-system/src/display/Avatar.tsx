import { Avatar as NinnaAvatar, type AvatarProps as NinnaAvatarProps } from '@ninna-ui/primitives';

type AvatarProps = Omit<NinnaAvatarProps, 'color' | 'size' | 'radius'> & {
    /** The 24px avatar beside a name in a dense list, such as a comment's author. */
    compact?: boolean;
};

export function Avatar({ compact = false, ...props }: AvatarProps) {
    return <NinnaAvatar {...props} color="neutral" size={compact ? 'xs' : 'sm'} />;
}
