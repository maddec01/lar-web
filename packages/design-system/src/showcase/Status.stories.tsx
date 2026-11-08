import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import booksIcon from '../../.storybook/assets/books.webp';
import factoryIcon from '../../.storybook/assets/factory.webp';
import musicIcon from '../../.storybook/assets/music.webp';
import photosIcon from '../../.storybook/assets/photos.webp';
import serverIcon from '../../.storybook/assets/server.webp';
import videoIcon from '../../.storybook/assets/video.webp';
import { Announcement, AppIcon, type Readiness, StatusLight, ReadinessStatus } from './Status';

const readiness: readonly { status: Readiness; label: string }[] = [
    { status: 'available', label: 'Available for Mac' },
    { status: 'development', label: 'In development' },
    { status: 'planned', label: 'Planned' },
];

const meta = {
    title: 'Showcase/Status',
    component: ReadinessStatus,
    args: { status: 'available', children: 'Available for Mac' },
    argTypes: { status: { control: 'inline-radio', options: ['available', 'development', 'planned'] } },
} satisfies Meta<typeof ReadinessStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Where a product or feature stands: out now, being built, or planned. */
export const Default: Story = {};

/** Each readiness: the apps' status light and label, in its tone. */
export const Readinesses: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-2">
            {readiness.map((item) => (
                <ReadinessStatus key={item.status} status={item.status}>
                    {item.label}
                </ReadinessStatus>
            ))}
        </div>
    ),
};

/** The bare light, as in readiness lists; the announcement’s pulses. */
export const Lights: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            {readiness.map((item) => (
                <StatusLight key={item.status} status={item.status} />
            ))}
            <StatusLight status="available" pulse />
        </div>
    ),
};

/** The pill above a hero title that points at news. */
export const Announcements: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-3">
            <Announcement href="/factory" tag="New" onNavigate={fn()}>
                Lar Factory is out for Mac
            </Announcement>
            <Announcement href="#progress" status="development" tag="In development">
                See what works
            </Announcement>
            <Announcement href="https://github.com/maddec01/lar-factory" external tag="Open source">
                MIT licensed and on GitHub
            </Announcement>
        </div>
    ),
};

/** Lar’s app icons, cut to the platform’s continuous corner, in each size. */
export const AppIcons: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            {(['sm', 'md', 'lg'] as const).map((size) => (
                <div key={size} className="flex items-center gap-3">
                    <AppIcon src={factoryIcon} alt="Lar Factory" size={size} />
                    <AppIcon src={serverIcon} alt="Lar Server" size={size} />
                    <AppIcon src={musicIcon} alt="Lar Music" size={size} />
                    <AppIcon src={videoIcon} alt="Lar Video" size={size} />
                    <AppIcon src={photosIcon} alt="Lar Photos" size={size} />
                    <AppIcon src={booksIcon} alt="Lar Books" size={size} />
                </div>
            ))}
        </div>
    ),
};
