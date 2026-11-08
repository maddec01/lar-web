import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../actions/Button';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { ScrollFadeRegion } from '../overlays/ScrollFadeRegion';
import { Checkbox } from './Checkbox';
import { Input } from './Input';

export interface LabelChoice {
    /** The label's name, which `picked` and `onToggle` use. */
    name: string;
    /** A CSS colour; a tracker with no label colours gives none. */
    color?: string | undefined;
    /** The tracker's description of the label, under its name. */
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
    /** Called with the typed name to add it as a new label. */
    onCreate: (name: string) => void;
}

interface LabelPickerProps {
    /** Tells this picker apart from others on the page, for tests and for scrolling to it. */
    'data-label-picker'?: string;
    /** The labels to pick from. */
    choices: readonly LabelChoice[];
    /** The names of the labels ticked now. */
    picked: readonly string[];
    /** Called with a label's name when the reader ticks or clears it. */
    onToggle: (name: string) => void;
    /** The filter field's accessible name and its placeholder. */
    filterLabel: string;
    /** The filter field's hint, such as "Filter labels". */
    placeholder: string;
    /** Shown when the filter matches nothing. */
    noMatchLabel: string;
    /** Choices shown ticked or not but not changeable here, each marked with `lockedNote`. */
    locked?: readonly string[];
    /** Says why the `locked` labels can't change here. */
    lockedNote?: string;
    /** Holds the list while a change it made saves, keeping the focus. */
    busy?: boolean;
    /** Lets a typed name that no choice has become a new label. */
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
    'data-label-picker': pickerId = '',
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
        <div className="grid w-72 gap-2" data-label-picker={pickerId} aria-busy={busy}>
            <Input
                autoFocus
                placeholder={placeholder}
                aria-label={filterLabel}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;

                    e.preventDefault();

                    if (fresh && !refusal && !busy) add();
                }}
            />
            <ScrollFadeRegion className="grid max-h-56 gap-0.5">
                {hits.map(({ name, color, description }) => {
                    const fixed = locked.some((label) => same(label, name));

                    return (
                        <label
                            key={name}
                            data-label-choice
                            className="hover:bg-fill-hover flex cursor-pointer items-start gap-2 rounded-md px-1.5 py-1 text-xs"
                        >
                            <Checkbox
                                checked={picked.some((label) => same(label, name))}
                                disabled={fixed || busy}
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
                                    {fixed && lockedNote && <span className="text-fg-muted"> · {lockedNote}</span>}
                                </span>
                                {description && <span className="text-fg-muted text-2xs block">{description}</span>}
                            </span>
                        </label>
                    );
                })}
                {!hits.length && !fresh && <p className="text-fg-muted text-2xs m-0 p-1.5">{noMatchLabel}</p>}
            </ScrollFadeRegion>
            {fresh && !refusal && (
                <span className="justify-self-start">
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<PlusIcon />}
                        disabled={!!refusal || busy}
                        onClick={add}
                    >
                        {create.createLabel(typed)}
                    </Button>
                </span>
            )}
            {refusal && (
                <p role="alert" className="text-fg-muted text-2xs m-0">
                    {refusal}
                </p>
            )}
            {create && !create.refused && <p className="text-fg-muted text-2xs m-0">{create.note}</p>}
        </div>
    );
}
