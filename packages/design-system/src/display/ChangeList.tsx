import { Code } from '@ninna-ui/primitives';

import { Stack } from '../layout/Flow';
import { Text, TextBase } from '../typography/Typography';

export interface ChangeListChange {
    /** The value before. */
    from: string;
    /** The change's key in the item. */
    key: string;
    /** What changes, such as "Album artist". */
    label: string;
    /** The value after. */
    to: string;
    /** `text` (the default) for a value people read, such as a name or a title, in the reading font; `code` for a
     *  value a machine reads, such as a path, an id or a tag's raw form, in the code font on its chip. */
    kind?: 'text' | 'code';
}

export interface ChangeListItem {
    /** The item's changed values: each one's label, its value before and after, and what kind of value it is. */
    changes: readonly ChangeListChange[];
    /** The item's key in the list. */
    key: string;
    /** The item the changes belong to, such as a file's name. */
    title: string;
}

/** A value as its kind reads: a person's words in the reading font (the old one muted, the new one in the text colour),
 *  a machine's value on a code chip. */
function ChangeValue({
    kind = 'text',
    before = false,
    children,
}: {
    kind?: 'text' | 'code';
    before?: boolean;
    children: string;
}) {
    return kind === 'code' ? (
        <Code className="text-xs">{children}</Code>
    ) : (
        <TextBase as="span" variant="caption" tone={before ? 'muted' : 'default'} className="wrap-break-word">
            {children}
        </TextBase>
    );
}

/** Before → after values grouped under the item they belong to: human values (names, titles) in the reading font,
 *  machine values (`kind: 'code'`: paths, ids) on code chips. */
export function ChangeList({
    items,
    label,
}: {
    /** The items and their changes, in order. */
    items: readonly ChangeListItem[];
    /** Names the list for screen readers, such as "Changes to apply". */
    label: string;
}) {
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
                                    <ChangeValue kind={change.kind} before>
                                        {change.from}
                                    </ChangeValue>
                                    <Text as="span" aria-hidden="true" variant="caption" tone="muted">
                                        →
                                    </Text>
                                    <ChangeValue kind={change.kind}>{change.to}</ChangeValue>
                                </li>
                            ))}
                        </ul>
                    </Stack>
                </li>
            ))}
        </Stack>
    );
}
