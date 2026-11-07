import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpenIcon, CameraIcon, FilmIcon, FolderIcon, MusicIcon, TvIcon } from 'lucide-react';

import { KindIcon } from './KindIcon';

const kinds = [
    { label: 'Music', hue: 280, icon: <MusicIcon /> },
    { label: 'Movies', hue: 25, icon: <FilmIcon /> },
    { label: 'TV', hue: 150, icon: <TvIcon /> },
    { label: 'Photos', hue: 210, icon: <CameraIcon /> },
    { label: 'Books', hue: 60, icon: <BookOpenIcon /> },
];

const meta = {
    title: 'Display/KindIcon',
    component: KindIcon,
    args: { hue: 280, children: <MusicIcon /> },
    // The icon takes its size from its container.
    render: (args) => (
        <span className="inline-flex size-6 [&_svg]:size-full">
            <KindIcon {...args} />
        </span>
    ),
} satisfies Meta<typeof KindIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Without a hue the icon is neutral. */
export const Neutral: Story = { args: { hue: undefined, children: <FolderIcon /> } };

/** Each catalog kind in its hue, for comparing them in light and dark. */
export const Kinds: Story = {
    render: () => (
        <ul className="flex flex-col gap-3">
            {kinds.map(({ label, hue, icon }) => (
                <li key={label} className="flex items-center gap-2 text-sm">
                    <span className="inline-flex size-5 [&_svg]:size-full">
                        <KindIcon hue={hue}>{icon}</KindIcon>
                    </span>
                    {label}
                </li>
            ))}
            <li className="flex items-center gap-2 text-sm">
                <span className="inline-flex size-5 [&_svg]:size-full">
                    <KindIcon>
                        <FolderIcon />
                    </KindIcon>
                </span>
                Other
            </li>
        </ul>
    ),
};
