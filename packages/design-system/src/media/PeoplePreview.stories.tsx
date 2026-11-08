import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from '../display/Avatar';
import { PeoplePreview } from './PeoplePreview';

const cast = [
    { name: 'Timothée Chalamet', role: 'Paul Atreides' },
    { name: 'Zendaya', role: 'Chani' },
    { name: 'Rebecca Ferguson', role: 'Lady Jessica' },
    { name: 'Javier Bardem', role: 'Stilgar' },
    { name: 'Josh Brolin', role: 'Gurney Halleck' },
    { name: 'Austin Butler', role: 'Feyd-Rautha Harkonnen' },
    { name: 'Florence Pugh', role: 'Princess Irulan' },
    { name: 'Christopher Walken', role: 'Emperor Shaddam IV' },
    { name: 'Léa Seydoux', role: 'Lady Margot Fenring' },
    { name: 'Stellan Skarsgård', role: 'Baron Vladimir Harkonnen' },
].map(({ name, role }, index) => ({
    id: String(index),
    name,
    role,
    href: `/people/${index}`,
    artwork: (
        <Avatar
            name={name}
            src={index % 3 === 2 ? undefined : `https://picsum.photos/seed/lar-person-${index}/128/128`}
        />
    ),
}));

const meta = {
    title: 'Media/PeoplePreview',
    component: PeoplePreview,
    args: { label: 'Cast', items: cast, onNavigate: () => undefined },
} satisfies Meta<typeof PeoplePreview>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Only as many people as fit in one row; resize the canvas to see it change. */
export const Default: Story = {};

export const Narrow: Story = {
    decorators: [
        (Story) => (
            <div className="max-w-xs">
                <Story />
            </div>
        ),
    ],
};

export const Few: Story = { args: { label: 'Directors', items: cast.slice(0, 2) } };

export const WithoutLinks: Story = {
    args: { items: cast.map(({ href: _href, ...person }) => person), onNavigate: undefined },
};
