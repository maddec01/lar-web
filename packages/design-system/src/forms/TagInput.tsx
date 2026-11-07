import { XIcon } from 'lucide-react';
import { useState } from 'react';

import { IconButton } from '../actions/IconButton';
import { Badge } from '../display/Badge';
import { Input } from './Input';

interface TagInputProps {
    /** Names the field that adds a value. */
    addLabel: string;
    disabled?: boolean;
    /** Names the list of values. */
    label: string;
    onChange: (values: string[]) => void;
    placeholder?: string;
    /** Names the button that removes a value. */
    removeLabel: (value: string) => string;
    values: readonly string[];
}

/**
 * Values as removable tags, in order, and a field that adds one on Enter, a comma or a
 * semicolon, or when it loses focus. A value already listed, in any case, is not added again.
 */
export function TagInput({ addLabel, disabled, label, onChange, placeholder, removeLabel, values }: TagInputProps) {
    const [draft, setDraft] = useState('');

    function add() {
        const value = draft.trim();

        setDraft('');

        if (value && !values.some((known) => known.toLocaleLowerCase() === value.toLocaleLowerCase()))
            onChange([...values, value]);
    }

    return (
        <div className="flex min-w-0 flex-col gap-2">
            {values.length > 0 ? (
                <ul aria-label={label} className="flex min-w-0 flex-wrap gap-1.5">
                    {values.map((value) => (
                        <li key={value} className="max-w-full min-w-0">
                            <Badge className="max-w-full pr-0.5">
                                <span className="truncate">{value}</span>
                                <IconButton
                                    type="button"
                                    aria-label={removeLabel(value)}
                                    title={removeLabel(value)}
                                    className="size-4 shrink-0 p-0.5"
                                    disabled={disabled}
                                    icon={<XIcon />}
                                    onClick={() => onChange(values.filter((known) => known !== value))}
                                />
                            </Badge>
                        </li>
                    ))}
                </ul>
            ) : null}
            <Input
                aria-label={addLabel}
                placeholder={placeholder}
                value={draft}
                maxLength={4096}
                disabled={disabled}
                onBlur={add}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ',' && event.key !== ';') return;

                    event.preventDefault();
                    add();
                }}
            />
        </div>
    );
}
