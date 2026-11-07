import { Badge } from './Badge';

export interface BadgeListItem {
    id: string;
    label: string;
    /** Shown struck through, as a warning, when the item doesn't apply. */
    struck?: boolean;
}

export function BadgeList({ items, label }: { items: readonly BadgeListItem[]; label?: string }) {
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
