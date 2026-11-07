import type { Meta, StoryObj } from '@storybook/react-vite';

import { BrandLink, BrandMark } from './BrandMark';

const meta = {
    title: 'Display/BrandMark',
    component: BrandMark,
    args: { label: 'Lar Server', product: 'Server', size: 'md' },
} satisfies Meta<typeof BrandMark>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Server: Story = {};

export const Factory: Story = { args: { label: 'Lar Factory', product: 'Factory' } };

export const MarkOnly: Story = { args: { label: 'Lar', product: undefined } };

export const Large: Story = { args: { size: 'lg' } };

/** Both sizes, with and without a product name. */
export const Lockups: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            {(['md', 'lg'] as const).map((size) => (
                <div key={size} className="flex flex-wrap items-baseline gap-8">
                    <BrandMark label="Lar" size={size} />
                    <BrandMark label="Lar Server" product="Server" size={size} />
                    <BrandMark label="Lar Factory" product="Factory" size={size} />
                </div>
            ))}
        </div>
    ),
};

/** The lockup as the link home, as in the app header. */
export const AsLink: Story = {
    render: () => <BrandLink href="/" label="Lar Server home" onNavigate={() => undefined} />,
};
