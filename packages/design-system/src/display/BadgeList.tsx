import { BadgeBase as Badge } from './Badge';

export interface BadgeListItem {
    /** The item's key in the list. */
    id: string;
    /** The badge's text. */
    label: string;
    /** Shown struck through, as a warning, when the item doesn't apply. */
    struck?: boolean;
}

/** A wrapping list of neutral badges, such as a title's genres. */
export function BadgeList({
    items,
    label,
}: {
    /** The badges, in order. */
    items: readonly BadgeListItem[];
    /** Names the list for screen readers, such as "Genres". */
    label?: string;
}) {
    return (
        <ul aria-label={label} className="flex flex-wrap gap-2">
            {items.map(({ id, label: text, struck = false }) => (
                <li key={id} className="max-w-full min-w-0">
                    <Badge
                        tone={struck ? 'warning' : 'neutral'}
                        className="max-w-full wrap-break-word whitespace-normal"
                    >
                        {struck ? <del>{text}</del> : text}
                    </Badge>
                </li>
            ))}
        </ul>
    );
}
