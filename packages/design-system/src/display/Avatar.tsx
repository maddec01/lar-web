import { Avatar as NinnaAvatar, type AvatarProps as NinnaAvatarProps } from '@ninna-ui/primitives';

type AvatarProps = Omit<NinnaAvatarProps, 'color' | 'size' | 'radius'>;

export function Avatar(props: AvatarProps) {
    return <NinnaAvatar {...props} color="neutral" size="sm" />;
}
