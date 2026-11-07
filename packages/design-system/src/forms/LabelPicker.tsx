import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../actions/Button';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { Checkbox } from './Checkbox';
import { Input } from './Input';

export interface LabelChoice {
    name: string;
    /** A CSS colour; a tracker with no label colours gives none. */
    color?: string | undefined;
    description?: string | undefined;
}

/** Lets a typed name no choice has become a new label. */
export interface LabelCreation {
    /** Why this person can't add new labels at all, or null when they can. */
    refused: string | null;
    /** Why this name can't be a label, or null when it can. */
    problem: (name: string) => string | null;
    /** What adding one does, under the list. */
    note: string;
    /** The button that adds `name`, such as `Create "name"`. */
    createLabel: (name: string) => string;
    onCreate: (name: string) => void;
}

interface LabelPickerProps {
    choices: readonly LabelChoice[];
    picked: readonly string[];
    onToggle: (name: string) => void;
    /** The filter field's accessible name and its placeholder. */
    filterLabel: string;
    placeholder: string;
    /** Shown when the filter matches nothing. */
    noMatchLabel: string;
    /** Choices shown ticked or not but not changeable here, each marked with `lockedNote`. */
    locked?: readonly string[];
    lockedNote?: string;
    busy?: boolean;
    create?: LabelCreation;
    /** Whether two names are the same label; trackers compare them ignoring case. */
    same?: (a: string, b: string) => boolean;
}

const ignoringCase = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * A searchable checklist of labels, with each label's colour and description. It holds only its search text: the
 * caller gives the choices, what is picked and what a toggle does, so it reads and writes whichever way its surface
 * needs. With `create`, Enter or the create button lets a typed name no choice has in.
 */
export function LabelPicker({
    choices,
    picked,
    onToggle,
    filterLabel,
    placeholder,
    noMatchLabel,
    locked = [],
    lockedNote,
    busy = false,
    create,
    same = ignoringCase,
}: LabelPickerProps) {
    const [query, setQuery] = useState('');
    const typed = query.trim();
    const hits = choices.filter(({ name }) => name.toLowerCase().includes(typed.toLowerCase()));
    const fresh = !!create && !!typed && !choices.some(({ name }) => same(name, typed));
    const refusal = fresh ? (create.refused ?? create.problem(typed)) : null;
    const add = () => {
        create?.onCreate(typed);
        setQuery('');
    };

    return (
        <div className="grid w-72 gap-2" data-label-picker aria-busy={busy}>
            <Input
                autoFocus
                placeholder={placeholder}
                aria-label={filterLabel}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;

                    e.preventDefault();

                    if (fresh && !refusal) add();
                }}
            />
            <div className="grid max-h-56 gap-0.5 overflow-y-auto">
                {hits.map(({ name, color, description }) => {
                    const fixed = locked.some((label) => same(label, name));

                    return (
                        <label
                            key={name}
                            data-label-choice
                            className="hover:bg-base-200 flex cursor-pointer items-start gap-2 rounded-md px-1.5 py-1 text-xs"
                        >
                            <Checkbox
                                checked={picked.some((label) => same(label, name))}
                                disabled={fixed}
                                onChange={() => onToggle(name)}
                            />
                            {color && (
                                <span data-label-dot className="mt-1 flex">
                                    <StatusIndicator tone="neutral" labelColor={color} />
                                </span>
                            )}
                            <span className="min-w-0 flex-1">
                                <span className="block wrap-anywhere">
                                    {name}
                                    {fixed && lockedNote && <span className="text-base-700"> · {lockedNote}</span>}
                                </span>
                                {description && <span className="text-base-700 block text-[11px]">{description}</span>}
                            </span>
                        </label>
                    );
                })}
                {!hits.length && !fresh && <p className="text-base-700 m-0 p-1.5 text-[11px]">{noMatchLabel}</p>}
            </div>
            {fresh && !refusal && (
                <span className="justify-self-start">
                    <Button variant="secondary" compact leftIcon={<PlusIcon />} onClick={add}>
                        {create.createLabel(typed)}
                    </Button>
                </span>
            )}
            {refusal && (
                <p role="alert" className="text-base-700 m-0 text-[11px]">
                    {refusal}
                </p>
            )}
            {create && !create.refused && <p className="text-base-700 m-0 text-[11px]">{create.note}</p>}
        </div>
    );
}
