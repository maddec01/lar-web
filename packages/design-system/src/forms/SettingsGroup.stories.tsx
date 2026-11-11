import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { OptionSelect } from './OptionSelect';
import { SettingsGroup } from './SettingsGroup';
import { SettingsNote } from './SettingsParts';
import { SettingsRow } from './SettingsRow';
import { Switch } from './Switch';

const rows = (
    <>
        <SettingsRow label="Project grouping" description="Combine matching repositories across environments.">
            <Switch checked aria-label="Project grouping" onCheckedChange={fn()} />
        </SettingsRow>
        <SettingsRow label="Project order" description="Order of projects in the sidebar and command palette.">
            <OptionSelect
                label="Project order"
                presentation="setting"
                value="recent"
                onChange={fn()}
                options={[
                    { value: 'recent', label: 'Last user message' },
                    { value: 'name', label: 'Name' },
                ]}
            />
        </SettingsRow>
    </>
);

const meta = {
    title: 'Forms/SettingsGroup',
    component: SettingsGroup,
    args: { title: 'Sidebar', children: rows },
} satisfies Meta<typeof SettingsGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** T3 Code's group: the title in line with the rows' text, then the rows in one panel. */
export const Default: Story = {};
/** With a description, a count, a status badge and an sm action at the title's end. */
export const WithAction: Story = {
    args: {
        title: 'Libraries',
        description: 'Folders Lar scans for music and video.',
        count: 2,
        countLabel: '2 libraries',
        badges: <StatusIndicator tone="success" label="Healthy" />,
        action: (
            <Button size="sm" variant="secondary">
                Add folder
            </Button>
        ),
    },
};
/** A note under the panel and an add action on its sunken footer strip. */
export const NoteAndFooter: Story = {
    args: {
        note: <SettingsNote>Last checked 2 minutes ago.</SettingsNote>,
        footer: (
            <Button size="sm" variant="quiet">
                Add project
            </Button>
        ),
    },
};
/** Loading: the rows drawn as skeletons as wide as their real titles; the action is held. */
export const Loading: Story = {
    args: {
        loading: true,
        action: (
            <Button size="sm" variant="secondary">
                Add folder
            </Button>
        ),
        skeleton: [
            { label: 'Project grouping', control: 'switch' },
            { label: 'Project order', control: 'select' },
        ],
    },
};
/** Content as given (cards, several panels): no panel of its own. */
export const WithoutPanel: Story = {
    args: { panel: false, children: <p className="text-fg-muted m-0 px-4 text-sm">Cards or panels go here.</p> },
};
