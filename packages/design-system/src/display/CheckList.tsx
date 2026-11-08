import { CheckIcon } from 'lucide-react';

import { Text } from '../typography/Typography';

export interface CheckListItem {
    /** The statement's key in the list. */
    key: string;
    /** The statement, such as "Streams to every device". */
    text: string;
}

/** Short statements of what something does or includes, each with a check mark. */
export function CheckList({
    items,
    label,
}: {
    /** The statements, in order. */
    items: readonly CheckListItem[];
    /** Names the list for screen readers, such as "What's included". */
    label: string;
}) {
    return (
        <ul aria-label={label} className="space-y-2">
            {items.map((item) => (
                <li key={item.key} className="flex min-w-0 items-start gap-2">
                    <span
                        aria-hidden="true"
                        className="text-success-fg mt-0.5 flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
                    >
                        <CheckIcon />
                    </span>
                    <Text as="span">{item.text}</Text>
                </li>
            ))}
        </ul>
    );
}
