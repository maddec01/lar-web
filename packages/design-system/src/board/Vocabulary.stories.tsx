import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { InsetPanel } from '../display/InsetPanel';
import { Input } from '../forms/Input';
import { OptionSelect } from '../forms/OptionSelect';
import { Popover } from '../overlays/Popover';
import { InlineLink } from '../typography/Link';
import { Text } from '../typography/Typography';
import { buttonKind } from './ButtonKinds';
import { ReasonNote } from './Settings';
import {
    LabelChooser,
    LabelChooserEmpty,
    LabelChooserFooter,
    LabelChooserList,
    LabelChooserOption,
    VocabularyChip,
    VocabularyMore,
    VocabularyRow,
    VocabularySuggestion,
} from './Vocabulary';

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
    <Button {...buttonKind('control')} aria-label="Choose Bug labels">
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
                <VocabularyChip label="bug" removeLabel="Remove bug from Bug" onRemove={fn()}>
                    bug
                </VocabularyChip>
                <VocabularyChip label="needs-review" removeLabel="Remove needs-review from Bug" onRemove={fn()}>
                    needs-review (new)
                </VocabularyChip>
                <VocabularyMore label="2 more Bug labels" onClick={fn()}>
                    +2
                </VocabularyMore>
            </>
        ),
        chooser: chooseButton('Edit'),
    },
    render: (args) => (
        <div className="max-w-2xl">
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
                    Could not save the Bug mapping. <InlineLink onClick={fn()}>Retry</InlineLink>
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

/** The chooser open: the search field, the list with the highlighted and picked labels, Create and the footer. */
export const Chooser: Story = {
    render: () => (
        <div className="h-120">
            <Popover open>
                <Popover.Trigger asChild>{chooseButton('Edit')}</Popover.Trigger>
                <Popover.Content align="start" width="md">
                    <LabelChooser data-label-picker="bug">
                        <Input
                            type="search"
                            role="combobox"
                            aria-expanded
                            aria-controls="labels-bug"
                            aria-label="Search labels for Bug"
                            placeholder={`Search ${labels.length} labels`}
                        />
                        <LabelChooserList id="labels-bug" label="Bug labels">
                            {labels.map((label, index) => (
                                <LabelChooserOption
                                    key={label}
                                    id={`label-bug-${index}`}
                                    selected={index === 0}
                                    disabled={false}
                                    active={index === 1}
                                    onHover={fn()}
                                    onPick={fn()}
                                >
                                    {index === 0 ? '✓ ' : ''}
                                    {label}
                                </LabelChooserOption>
                            ))}
                        </LabelChooserList>
                        <Button {...buttonKind('other')} wrap>
                            Create "a-new-label-with-a-long-name-that-wraps-anywhere-it-needs-to"
                        </Button>
                        <LabelChooserFooter>
                            <Button {...buttonKind('other')}>None</Button>
                            <Button {...buttonKind('other')}>Done</Button>
                        </LabelChooserFooter>
                    </LabelChooser>
                </Popover.Content>
            </Popover>
        </div>
    ),
};

/** A search that matches nothing. */
export const ChooserEmpty: Story = {
    render: () => (
        <div className="w-88">
            <LabelChooser>
                <LabelChooserList id="labels-feature" label="Feature labels">
                    <LabelChooserEmpty>No labels match "enhancement".</LabelChooserEmpty>
                </LabelChooserList>
            </LabelChooser>
        </div>
    ),
};
