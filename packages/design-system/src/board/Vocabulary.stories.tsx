import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { InsetPanel } from '../display/InsetPanel';
import { LabelChip } from '../display/LabelChip';
import { LabelPicker } from '../forms/LabelPicker';
import { OptionSelect } from '../forms/OptionSelect';
import { Popover } from '../overlays/Popover';
import { InlineLink } from '../typography/Link';
import { Text } from '../typography/Typography';
import { buttonKind } from './ButtonKinds';
import { ReasonNote } from './Settings';
import { VocabularyMore, VocabularyRow, VocabularySuggestion } from './Vocabulary';

const type = (
    <OptionSelect
        label="Bug type"
        writesOnPick
        value="Bug"
        none="No type"
        onChange={fn()}
        options={[
            { value: 'Bug', label: 'Bug' },
            { value: 'Task', label: 'Task' },
        ]}
    />
);

const chooseButton = (label: string) => (
    <Button {...buttonKind('control')} aria-label={`${label}: Choose Bug labels`}>
        {label}
    </Button>
);

const meta = {
    title: 'Board/Vocabulary',
    component: VocabularyRow,
    args: {
        title: 'Bug',
        type,
        labelsLabel: 'Bug labels',
        'data-vocabulary': 'bug',
        labels: (
            <>
                <LabelChip label="bug" removeLabel="Remove bug from Bug" onRemove={fn()} />
                <LabelChip
                    label="needs-review"
                    note="(new)"
                    removeLabel="Remove needs-review from Bug"
                    onRemove={fn()}
                />
                <VocabularyMore label="2 more Bug labels" onClick={fn()}>
                    +2
                </VocabularyMore>
            </>
        ),
        chooser: chooseButton('Edit'),
    },
    render: (args) => (
        <div className="w-full max-w-2xl">
            <InsetPanel presentation="settings">
                <VocabularyRow {...args} />
            </InsetPanel>
        </div>
    ),
} satisfies Meta<typeof VocabularyRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Mapped: Story = {};

/** No label yet, with a suggestion to map and the reasons and actions under the row. */
export const Suggested: Story = {
    args: {
        labels: <VocabularySuggestion onClick={fn()}>+ bug · suggested</VocabularySuggestion>,
        chooser: chooseButton('Add label'),
        children: (
            <>
                <ReasonNote
                    reason="GitHub refused setting labels."
                    explanation="GitHub refused setting labels. Ask for triage access, then check again."
                    helpLabel="access"
                    action={<InlineLink onClick={fn()}>Recheck</InlineLink>}
                />
                <Text variant="caption" tone="danger" role="alert">
                    Couldn’t save the Bug mapping. <InlineLink onClick={fn()}>Try again</InlineLink>
                </Text>
            </>
        ),
    },
};

/** Nothing mapped and nothing suggested. */
export const None: Story = {
    args: {
        labels: (
            <Text variant="caption" tone="muted">
                None
            </Text>
        ),
        chooser: chooseButton('Add label'),
    },
};

const labels = ['bug', 'defect', 'regression', 'needs-review'];

/** Vocabulary uses the same searchable checklist as item labels and filters. */
export const Chooser: Story = {
    render: () => (
        <div className="h-120">
            <Popover open>
                <Popover.Trigger asChild>{chooseButton('Edit')}</Popover.Trigger>
                <Popover.Content align="start" width="md">
                    <LabelPicker
                        choices={labels.map((name) => ({ name }))}
                        picked={['bug']}
                        onToggle={fn()}
                        filterLabel="Search labels for Bug"
                        placeholder="Filter or type a new label"
                        noMatchLabel="No matching labels."
                        create={{
                            refused: null,
                            problem: () => null,
                            note: 'New labels are created when you add the Project.',
                            createLabel: (name) => `Create "${name}"`,
                            onCreate: fn(),
                        }}
                    />
                </Popover.Content>
            </Popover>
        </div>
    ),
};
