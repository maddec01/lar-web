import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Field } from './Field';
import { RadioGroup, RadioGroupChoice, RadioGroupItem } from './RadioGroup';

const meta = {
    title: 'Forms/RadioGroup',
    component: RadioGroup,
    args: {
        'aria-label': 'Streaming quality',
        defaultValue: 'original',
        onValueChange: fn(),
        children: (
            <>
                <RadioGroupItem value="original" label="Original" description="Stream files as they are stored." />
                <RadioGroupItem
                    value="high"
                    label="High"
                    description="Transcode to 320 kbps when the network is slow."
                />
                <RadioGroupItem value="data-saver" label="Data saver" description="Always transcode to 128 kbps." />
            </>
        ),
    },
    argTypes: { orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
    args: {
        'aria-label': 'Sort albums by',
        orientation: 'horizontal',
        defaultValue: 'artist',
        children: (
            <>
                <RadioGroupItem value="artist" label="Artist" />
                <RadioGroupItem value="year" label="Year" />
                <RadioGroupItem value="added" label="Date added" />
            </>
        ),
    },
};

export const WithDisabledOption: Story = {
    args: {
        'aria-label': 'Build runner',
        defaultValue: 'local',
        children: (
            <>
                <RadioGroupItem value="local" label="This server" />
                <RadioGroupItem value="docker" label="Docker" />
                <RadioGroupItem value="remote" label="Remote runner" description="Add a runner first." disabled />
            </>
        ),
    },
};

export const Disabled: Story = { args: { disabled: true } };

/** Inside a Field, the group takes its label and error from the field. */
export const InvalidInField: Story = {
    args: { 'aria-label': undefined, defaultValue: undefined, invalid: true },
    render: (args) => (
        <Field label="Default branch" invalid errorText="Choose the branch Lar deploys from.">
            <RadioGroup {...args}>
                <RadioGroupItem value="main" label="main" />
                <RadioGroupItem value="develop" label="develop" />
            </RadioGroup>
        </Field>
    ),
};

/** `choices` rows: each a bordered row with the bare radio, so a long title truncates, as Lar Factory's onboarding
 *  lists the T3 projects to add. */
export const Choices: Story = {
    render: () => (
        <div className="max-w-md">
            <RadioGroup aria-label="T3 project" presentation="choices" defaultValue="web">
                <RadioGroupChoice value="web">
                    <span className="truncate">web · ~/Developer/web</span>
                </RadioGroupChoice>
                <RadioGroupChoice value="a-project-whose-name-is-long">
                    <span className="truncate">
                        a-project-whose-name-is-long-enough-to-truncate · ~/Developer/clients/acme/a-project
                    </span>
                </RadioGroupChoice>
                <RadioGroupChoice value="new">
                    <span className="truncate">Add a repository folder</span>
                </RadioGroupChoice>
            </RadioGroup>
        </div>
    ),
};
