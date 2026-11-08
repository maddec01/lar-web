import type { Meta, StoryObj } from '@storybook/react-vite';

import { PageError } from '../feedback/PageError';
import { StateStage } from './StateStage';

const meta = {
    title: 'Showcase/StateStage',
    component: StateStage,
    parameters: { layout: 'fullscreen' },
    args: {
        children: (
            <PageError
                size="hero"
                tone="neutral"
                code="404"
                title="This page isn’t home"
                description="The address may have changed. Let’s get you back."
                primaryAction={{ label: 'Go to the home page', href: '/' }}
            />
        ),
    },
} satisfies Meta<typeof StateStage>;

export default meta;
type Story = StoryObj<typeof meta>;
export const NotFound: Story = {};
