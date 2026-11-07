import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';

import { ColorSwatches } from './ColorSwatches';
import { Input } from './Input';

const hexes = ['D73A4A', 'E99695', 'FBCA04', '0E8A16', 'C2E0C6', 'BFDADC', '1D76DB', '5319E7', 'D4C5F9', 'EDEDED'];
const swatches = hexes.map((hex) => ({ value: hex, color: `#${hex}`, label: `Colour #${hex}` }));

const meta = {
    title: 'Forms/ColorSwatches',
    component: ColorSwatches,
    args: { swatches, value: '0E8A16', onPick: () => {} },
} satisfies Meta<typeof ColorSwatches>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

function WithHexField(args: ComponentProps<typeof ColorSwatches>) {
    const [value, setValue] = useState(args.value);

    return (
        <div className="max-w-sm">
            <ColorSwatches {...args} value={value} onPick={setValue}>
                <Input
                    aria-label="Hex colour"
                    presentation="short"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </ColorSwatches>
        </div>
    );
}

/** With a field for any other colour after the swatches, which a pick fills. */
export const WithField: Story = { render: (args) => <WithHexField {...args} /> };
