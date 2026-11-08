import type { Meta, StoryObj } from '@storybook/react-vite';
import { BugIcon, CircleDotIcon, GitBranchIcon, SparklesIcon, TrendingUpIcon } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { OptionSelect } from './OptionSelect';

type Quality = 'original' | 'high' | 'medium' | 'low';

const qualities = [
    { value: 'original', label: 'Original' },
    { value: 'high', label: 'High (320 kbps)' },
    { value: 'medium', label: 'Medium (192 kbps)' },
    { value: 'low', label: 'Low (96 kbps)', disabled: true },
] as const satisfies readonly { value: Quality; label: string; disabled?: boolean }[];

/** The loaded select’s props; the loading state is its own story. */
interface OptionSelectArgs {
    disabled?: boolean;
    label: string;
    onChange: (value: Quality) => void;
    options: typeof qualities;
    value: Quality;
}

const meta = {
    title: 'Forms/OptionSelect',
    component: OptionSelect,
    args: { label: 'Streaming quality', value: 'original', options: qualities, onChange: fn() },
    render: (args) => (
        <div className="max-w-xs">
            <OptionSelect {...args} />
        </div>
    ),
} satisfies Meta<OptionSelectArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Controlled from the `value` control; disabled options stay visible but can’t be chosen. */
export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

/** While the options load, a control-shaped skeleton holds the place. */
export const Loading: Story = {
    render: () => (
        <div className="max-w-xs">
            <OptionSelect label="Streaming quality" loading />
        </div>
    ),
};

function InteractiveOptionSelect({ onChange }: { onChange: (value: Quality) => void }) {
    const [value, setValue] = useState<Quality>('high');

    return (
        <OptionSelect
            label="Streaming quality"
            value={value}
            options={qualities}
            onChange={(next) => {
                setValue(next);
                onChange(next);
            }}
        />
    );
}

/** Keeps its own value, so choosing an option updates it. */
export const Interactive: Story = {
    render: (args) => (
        <div className="max-w-xs">
            <InteractiveOptionSelect onChange={args.onChange} />
        </div>
    ),
};

const branches = [
    { value: 'main', label: 'main', icon: <GitBranchIcon /> },
    { value: 'release', label: 'release', icon: <GitBranchIcon /> },
    { value: 'legacy', label: 'legacy (archived)', icon: <CircleDotIcon />, disabled: true },
];

function BranchSelect(props: Partial<Parameters<typeof OptionSelect<string>>[0]>) {
    const [value, setValue] = useState('');

    return (
        <div className="w-72">
            <OptionSelect
                label="Base branch"
                placeholder="Choose a branch"
                options={branches}
                value={value}
                onChange={setValue}
                {...(props as object)}
            />
        </div>
    );
}

/** With nothing picked, the placeholder; each option with its icon. */
export const Placeholder: Story = { render: () => <BranchSelect /> };

/** A `none` option empties the value, which a form with the select’s `name` reads as an empty string. */
export const WithNone: Story = { render: () => <BranchSelect none="No default" name="branch" /> };

/** A settings row’s 11rem dropdown, which writes at once on a pick. */
export const Setting: Story = { render: () => <BranchSelect presentation="setting" writesOnPick /> };

/** A value in a row of facts that edits in place, such as an item’s kind under its label. */
export const Inline: Story = { render: () => <BranchSelect presentation="inline" writesOnPick /> };

/** Each option’s icon in its lar-brand hue, as Lar Factory’s Kind select shows the kinds. */
export const HuedIcons: Story = {
    render: () => (
        <BranchSelect
            label="Kind"
            placeholder="Choose a kind"
            options={[
                { value: 'bug', label: 'Bug', icon: <BugIcon />, hue: 25 },
                { value: 'feature', label: 'Feature', icon: <SparklesIcon />, hue: 150 },
                { value: 'improvement', label: 'Improvement', icon: <TrendingUpIcon />, hue: 245 },
            ]}
        />
    ),
};

function NarrowKindSelect() {
    const [value, setValue] = useState('bug');

    return (
        <div className="flex h-64 items-start gap-2 text-sm">
            <span className="text-fg-muted pt-1.5">Kind</span>
            <OptionSelect
                label="Kind"
                presentation="inline"
                value={value}
                onChange={setValue}
                options={[
                    { value: 'bug', label: 'Bug', icon: <BugIcon />, hue: 25 },
                    { value: 'improvement', label: 'Improvement', icon: <TrendingUpIcon />, hue: 245 },
                    { value: 'feature', label: 'Feature request from a customer', icon: <SparklesIcon />, hue: 150 },
                ]}
            />
        </div>
    );
}

/** A narrow inline trigger ("Bug") over longer options: the list grows to its longest label, never clipping it. */
export const NarrowTriggerLongOptions: Story = { render: () => <NarrowKindSelect /> };

/** An editable kind shares a hue badge's shape and hue. */
export const HueBadgeSelect: Story = {
    render: () => (
        <OptionSelect
            label="Kind"
            presentation="badge"
            value="bug"
            options={[
                { value: 'bug', label: 'Bug', icon: <BugIcon />, hue: 25 },
                { value: 'feature', label: 'Feature', icon: <SparklesIcon />, hue: 150 },
            ]}
            onChange={() => {}}
        />
    ),
};
