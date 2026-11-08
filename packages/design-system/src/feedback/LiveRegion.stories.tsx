import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../actions/Button';
import { LiveRegion } from './LiveRegion';

const meta = {
    title: 'Feedback/LiveRegion',
    component: LiveRegion,
    args: { children: 'Copied' },
    render: function Render() {
        const [said, setSaid] = useState('');

        return (
            <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => setSaid(`Copied at ${new Date().toLocaleTimeString()}`)}>
                    Announce
                </Button>
                <span className="text-fg-muted text-xs">Screen readers hear: {said || 'nothing yet'}</span>
                <LiveRegion>{said}</LiveRegion>
            </div>
        );
    },
} satisfies Meta<typeof LiveRegion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
