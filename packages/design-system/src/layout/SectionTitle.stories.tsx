import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../actions/Button';
import { SectionTitle } from './SectionTitle';

const meta = {
    title: 'Layout/SectionTitle',
    component: SectionTitle,
    args: { title: 'Assets', count: 3, countLabel: '3 assets' },
    decorators: [
        (Story) => (
            <div className="max-w-lg">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Counted: Story = {};
export const WithAction: Story = { args: { actions: <Button variant="secondary">Manage assets</Button> } };
export const Loading: Story = { args: { loading: true, count: undefined } };

/** A part inside a section, such as a scan's phase in its details: a label-sized heading whose quiet action's label
 *  sits flush with the edge, like the progress figures under it. */
export const SmallWithQuietAction: Story = {
    args: {
        size: 'sm',
        level: 'h3',
        title: 'Metadata',
        count: undefined,
        countLabel: undefined,
        actions: (
            <Button variant="quiet" size="sm">
                Stop metadata
            </Button>
        ),
    },
};
