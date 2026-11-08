import { Avatar } from './Avatar';

/** A person: their avatar and name, the name wrapping. */
export function Person({
    name,
}: {
    /** The person's name, under their avatar. */
    name: string;
}) {
    return (
        <span className="inline-flex max-w-full min-w-0 items-center gap-1.5">
            <Avatar name={name} size="sm" />
            <span className="min-w-0 wrap-anywhere">{name}</span>
        </span>
    );
}
