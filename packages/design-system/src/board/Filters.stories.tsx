import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDashedIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { LabelChip } from '../display/LabelChip';
import { LabelPicker } from '../forms/LabelPicker';
import { buttonKind } from './ButtonKinds';
import { FilterBar, FilterChip, FilterChoice, FilterChoices, FilterMenu } from './Filters';

const kinds = [
    { value: 'bug', name: 'Bug', hue: 25 },
    { value: 'feature', name: 'Feature', hue: 150 },
];

function Demo() {
    const [picked, setPicked] = useState<string[]>(['bug']);
    const [labels, setLabels] = useState<string[]>(['needs triage']);
    const toggle = (value: string) =>
        setPicked((now) => (now.includes(value) ? now.filter((kind) => kind !== value) : [...now, value]));

    return (
        <FilterBar>
            <FilterMenu which="kind" name="Kind" picked={picked.length}>
                <FilterChoices>
                    {kinds.map((kind) => (
                        <FilterChoice
                            key={kind.value}
                            checked={picked.includes(kind.value)}
                            onToggle={() => toggle(kind.value)}
                        >
                            <Badge hue={kind.hue}>{kind.name}</Badge>
                        </FilterChoice>
                    ))}
                    <FilterChoice checked={false} onToggle={fn()}>
                        <Badge>
                            <CircleDashedIcon aria-hidden="true" />
                            No kind
                        </Badge>
                    </FilterChoice>
                </FilterChoices>
            </FilterMenu>
            <FilterMenu which="labels" name="Labels" picked={labels.length}>
                <LabelPicker
                    choices={[
                        { name: 'needs triage', color: '#FBCA04' },
                        { name: 'design', color: '#5319E7' },
                    ]}
                    picked={labels}
                    onToggle={(name) =>
                        setLabels((now) =>
                            now.includes(name) ? now.filter((label) => label !== name) : [...now, name],
                        )
                    }
                    filterLabel="Filter labels"
                    placeholder="Filter labels"
                    noMatchLabel="No match."
                />
            </FilterMenu>
            {picked.map((value) => (
                <FilterChip key={value} removeLabel={`Remove ${value}`} onRemove={() => toggle(value)}>
                    <Badge hue={kinds.find((kind) => kind.value === value)?.hue}>
                        {kinds.find((kind) => kind.value === value)?.name}
                        <span aria-hidden="true">×</span>
                    </Badge>
                </FilterChip>
            ))}
            {labels.map((label) => (
                <FilterChip
                    key={label}
                    removeLabel={`Remove ${label}`}
                    onRemove={() => setLabels((now) => now.filter((l) => l !== label))}
                >
                    <LabelChip label={label} color="#FBCA04" removable />
                </FilterChip>
            ))}
            {picked.length + labels.length > 0 && (
                <Button {...buttonKind('other')} data-filter-clear onClick={() => (setPicked([]), setLabels([]))}>
                    Clear
                </Button>
            )}
        </FilterBar>
    );
}

const meta = {
    title: 'Board/Filters',
    component: FilterBar,
    args: { children: null },
    render: () => <Demo />,
} satisfies Meta<typeof FilterBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filters: Story = {};

/** A label as long as a sentence truncates in its chip. */
export const LongLabel: Story = {
    render: () => (
        <FilterBar>
            <FilterChip removeLabel="Remove label" onRemove={fn()}>
                <LabelChip label="a label as long as a sentence, which a tracker allows" color="#0E8A16" removable />
            </FilterChip>
        </FilterBar>
    ),
};
