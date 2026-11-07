import type { Meta, StoryObj } from '@storybook/react-vite';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { InsetPanel } from '../display/InsetPanel';
import { LabelChip } from '../display/LabelChip';
import { ColorSwatches } from '../forms/ColorSwatches';
import { FormRow } from '../forms/FormSection';
import { Input } from '../forms/Input';
import { Inline } from '../layout/Flow';
import { Text } from '../typography/Typography';
import { buttonKind } from './ButtonKinds';
import { CreateLabelForm, TrackerLabelEditor, TrackerLabelList, TrackerLabelRow } from './TrackerLabels';

const actions = (name: string) => (
    <>
        <Button {...buttonKind('control')} iconOnly aria-label={`Edit ${name}`} leftIcon={<PencilIcon />} />
        <Button {...buttonKind('control')} iconOnly aria-label={`Delete ${name}`} leftIcon={<Trash2Icon />} />
    </>
);

const hexes = ['D73A4A', 'E99695', 'FBCA04', '0E8A16', 'C2E0C6', 'BFDADC', '1D76DB', '5319E7', 'D4C5F9', 'EDEDED'];

const editor = (
    <TrackerLabelEditor onSubmit={(event) => event.preventDefault()}>
        <InsetPanel presentation="settings">
            <FormRow layout="flow" label="Label name">
                <Input aria-label="Label name" defaultValue="bug" />
            </FormRow>
            <FormRow layout="flow" label="Colour">
                <ColorSwatches
                    swatches={hexes.map((hex) => ({ value: hex, color: `#${hex}`, label: `Colour #${hex}` }))}
                    value="D73A4A"
                    onPick={fn()}
                >
                    <Input aria-label="Hex colour" presentation="short" defaultValue="D73A4A" />
                </ColorSwatches>
            </FormRow>
        </InsetPanel>
        <Inline as="span">
            <Button {...buttonKind('other')} type="button">
                Cancel
            </Button>
            <Button {...buttonKind('other')} type="submit">
                Save
            </Button>
        </Inline>
    </TrackerLabelEditor>
);

const meta = {
    title: 'Board/TrackerLabels',
    component: TrackerLabelList,
    args: { children: null },
    render: () => (
        <div className="grid max-w-2xl gap-3">
            <InsetPanel presentation="settings">
                <FormRow layout="flow" label="New label">
                    <CreateLabelForm onSubmit={(event) => event.preventDefault()}>
                        <Input aria-label="New label" placeholder="New label name" />
                        <Button {...buttonKind('other')} type="submit" leftIcon={<PlusIcon />}>
                            Create label
                        </Button>
                    </CreateLabelForm>
                </FormRow>
            </InsetPanel>
            <TrackerLabelList>
                <TrackerLabelRow
                    data-label="bug"
                    chip={<LabelChip label="bug" color="#D73A4A" />}
                    detail="Something isn't working"
                    actions={actions('bug')}
                    editor={editor}
                />
                <TrackerLabelRow
                    data-label="lar:building"
                    chip={<LabelChip label="lar:building" locked lockedLabel="Factory-managed" />}
                    detail="Factory-managed. The factory sets this label itself."
                />
                <TrackerLabelRow
                    data-label="long"
                    chip={<LabelChip label={`a-label-with-a-${'very-'.repeat(12)}long-name`} color="#1D76DB" />}
                    detail={'A long description that truncates and gives itself whole in its tooltip. '.repeat(3)}
                    actions={actions('long')}
                />
            </TrackerLabelList>
            <Text variant="caption" tone="danger" role="alert">
                GitHub refused the change.
            </Text>
        </div>
    ),
} satisfies Meta<typeof TrackerLabelList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Labels: Story = {};
