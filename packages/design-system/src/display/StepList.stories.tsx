import type { Meta, StoryObj } from '@storybook/react-vite';

import { StepList } from './StepList';

const meta = {
    title: 'Display/StepList',
    component: StepList,
    args: {
        steps: [
            'Install the Lar app from the App Store or Google Play.',
            'Open the app and tap “Add server”.',
            'Scan the pairing code shown on this page.',
        ],
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StepList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Factory: Story = {
    args: {
        steps: [
            'Clone the repository into ~/Developer.',
            'Run lar factory add . from the repository root.',
            'Pick the branches Factory may work on, then start the first job.',
            'Review the pull request Factory opens when the job finishes, and merge it if the checks pass and the change looks right to you.',
        ],
    },
};
