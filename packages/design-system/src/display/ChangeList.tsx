import { Code } from '@ninna-ui/primitives';

import { Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';

export interface ChangeListItem {
    changes: readonly { from: string; key: string; label: string; to: string }[];
    key: string;
    title: string;
}

/** Before → after values grouped under the item they belong to. */
export function ChangeList({ items, label }: { items: readonly ChangeListItem[]; label: string }) {
    return (
        <Stack as="ul" space="group" aria-label={label}>
            {items.map((item) => (
                <li key={item.key} className="min-w-0">
                    <Stack space="tight">
                        <Text truncate title={item.title} variant="label">
                            {item.title}
                        </Text>
                        <ul className="space-y-1 pl-4">
                            {item.changes.map((change) => (
                                <li key={change.key} className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                                    <Text as="span" variant="caption" tone="muted">
                                        {change.label}
                                    </Text>
                                    <Code className="text-xs">{change.from}</Code>
                                    <Text as="span" aria-hidden="true" variant="caption" tone="muted">
                                        →
                                    </Text>
                                    <Code className="text-xs">{change.to}</Code>
                                </li>
                            ))}
                        </ul>
                    </Stack>
                </li>
            ))}
        </Stack>
    );
}
