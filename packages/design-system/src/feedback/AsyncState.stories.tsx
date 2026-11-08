import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AsyncState } from './AsyncState';
import { SkeletonLoader } from './SkeletonLoader';

const meta = {
    title: 'Feedback/AsyncState',
    component: AsyncState,
    args: {
        label: 'Loading albums',
        errorTitle: 'Couldn’t load albums',
        loading: true,
    },
    decorators: [
        (Story) => (
            <div className="max-w-xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AsyncState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

export const LoadingLine: Story = { args: { presentation: 'line' } };

export const CustomPlaceholder: Story = {
    args: {
        placeholder: (
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <SkeletonLoader.Shape presentation="artwork" />
                        <SkeletonLoader.Shape width="wide" />
                    </div>
                ))}
            </div>
        ),
    },
};

export const LoadFailed: Story = {
    args: {
        loading: false,
        error: 'The server returned 503 Service Unavailable.',
        onRetry: fn(),
        retryLabel: 'Try again',
    },
};

export const Retrying: Story = { args: { ...LoadFailed.args, retrying: true } };

export const ErrorWithoutRetry: Story = {
    args: { loading: false, error: 'You no longer have access to this catalog.' },
};
