import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Breadcrumbs } from './Breadcrumbs';

const meta = {
    title: 'Navigation/Breadcrumbs',
    component: Breadcrumbs,
    args: {
        label: 'Breadcrumb',
        items: [
            { href: '/music', label: 'Music' },
            { href: '/music/artists/miles-davis', label: 'Miles Davis' },
        ],
        current: 'Kind of Blue',
        onNavigate: fn(),
    },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleLevel: Story = {
    args: { items: [{ href: '/movies', label: 'Movies' }], current: 'Dune: Part Two' },
};

export const WithoutCurrent: Story = { args: { current: undefined } };

/** Deep folder paths scroll sideways instead of wrapping. */
export const DeepFolder: Story = {
    args: {
        items: ['media', 'photos', 'Family', '2019 - Summer holidays in Lisbon and Porto', 'Day 3 - Sintra'].map(
            (segment, index, all) => ({
                href: `/folders/${all.slice(0, index + 1).join('/')}`,
                label: segment,
            }),
        ),
        current: 'Pena Palace (edited)',
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
};
