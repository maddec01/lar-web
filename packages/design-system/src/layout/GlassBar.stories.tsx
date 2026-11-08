import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../typography/Typography';
import { GlassBar } from './GlassBar';
import { TitleBar } from './TitleBar';

const meta = {
    title: 'Layout/GlassBar',
    component: GlassBar,
    parameters: { layout: 'fullscreen' },
    args: {
        children: <TitleBar brand={<Text>Lar</Text>} title={<Text tone="muted">Dashboard</Text>} />,
    },
    decorators: [
        // The wrapper stands in for the page, which scrolls under the bar: no fade.
        (Story) => (
            <div data-scroll-fade="exempt" className="h-64 overflow-y-auto">
                <Story />
                <div className="grid gap-2 p-4">
                    {Array.from({ length: 16 }, (_, index) => (
                        <div
                            key={index}
                            className={`h-10 rounded-lg ${index % 3 ? 'bg-fill-muted' : 'bg-primary-surface'}`}
                        />
                    ))}
                </div>
            </div>
        ),
    ],
} satisfies Meta<typeof GlassBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** At the top: glass with no hairline. Scroll the frame to see the content pass under it, blurred. */
export const AtTheTop: Story = {};

/** Once what’s under it has scrolled, its hairline shows. */
export const Scrolled: Story = { args: { scrolled: true } };
