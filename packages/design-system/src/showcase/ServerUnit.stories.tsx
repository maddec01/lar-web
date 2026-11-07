import type { Meta, StoryObj } from '@storybook/react-vite';

import booksIcon from '../../.storybook/assets/books.webp';
import musicIcon from '../../.storybook/assets/music.webp';
import photosIcon from '../../.storybook/assets/photos.webp';
import videoIcon from '../../.storybook/assets/video.webp';
import {
    type MediaApp,
    type ReadinessItem,
    ReadinessLegend,
    ReadinessPanel,
    type ServerBay,
    ServerUnit,
} from './ServerUnit';
import { AppIcon, type Readiness, StatusPill } from './Status';

const statusLabels: Record<Readiness, string> = {
    available: 'Working',
    development: 'In development',
    planned: 'Planned',
};

const line = (label: string, status: Readiness): ReadinessItem => ({
    label,
    status,
    statusLabel: statusLabels[status],
});

interface AppReadiness {
    id: MediaApp;
    name: string;
    title: string;
    icon: string;
    status: Readiness;
    summary: string;
    server: readonly ReadinessItem[];
    apps: readonly ReadinessItem[];
}

/** Where each media app stands, as the Lar website draws its drives. */
const music: AppReadiness = {
    id: 'music',
    name: 'Music',
    title: 'Lar Music',
    icon: musicIcon,
    status: 'available',
    summary: 'The most complete app today. Lar Music plays your library on iPhone, iPad and Mac, online or off.',
    server: [
        line('Catalog built from your tags', 'available'),
        line('Albums, artists and playlists', 'available'),
        line('Integrity checks with confirmed repairs', 'available'),
        line('Spots missing albums, with Lidarr', 'available'),
        line('Lyrics on demand', 'planned'),
        line('Smart playlists', 'planned'),
    ],
    apps: [
        line('iPhone, iPad and Mac', 'available'),
        line('Downloads and offline cache', 'available'),
        line('Apple TV, Apple Watch and CarPlay', 'development'),
    ],
};

const video: AppReadiness = {
    id: 'video',
    name: 'Video',
    title: 'Lar Video',
    icon: videoIcon,
    status: 'development',
    summary:
        'Shipping alongside Music. Films and series with artwork and credits, played in their original quality or converted on the fly.',
    server: [
        line('Movies and shows catalog', 'development'),
        line('Transcoding with HDR tone mapping', 'development'),
        line('Trakt sync for watch history', 'development'),
        line('Metadata from the Lar metadata service', 'planned'),
    ],
    apps: [line('iPhone, iPad and Mac', 'development'), line('Apple TV', 'development')],
};

const photos: AppReadiness = {
    id: 'photos',
    name: 'Photos',
    title: 'Lar Photos',
    icon: photosIcon,
    status: 'planned',
    summary:
        "Your own photo cloud, in place of iCloud Photos or Google Photos. Every picture you take goes straight to your server, and you find any of them by what's in it.",
    server: [
        line('Every photo and video, on your own disks', 'planned'),
        line('Albums and a timeline of every year', 'planned'),
        line('Search by what is in the picture', 'planned'),
        line("Recognition that runs on your server, not someone else's", 'planned'),
    ],
    apps: [
        line("Automatic backup from your iPhone's camera", 'planned'),
        line('Browse and share on iPhone, iPad, Mac and Apple TV', 'planned'),
    ],
};

const books: AppReadiness = {
    id: 'books',
    name: 'Books',
    title: 'Lar Books',
    icon: booksIcon,
    status: 'planned',
    summary: 'Planned after Music and Video: your ebooks, grouped into works and editions with their covers.',
    server: [line('Works and editions', 'planned'), line('EPUB and PDF', 'planned')],
    apps: [line('iPhone, iPad and Mac', 'planned')],
};

const apps: readonly AppReadiness[] = [music, video, photos, books];

function AppPanel({ app }: { app: AppReadiness }) {
    return (
        <ReadinessPanel
            icon={<AppIcon src={app.icon} alt="" size="sm" />}
            title={app.title}
            status={<StatusPill status={app.status}>{statusLabels[app.status]}</StatusPill>}
            summary={app.summary}
            groups={[
                { title: 'On the server', items: app.server },
                { title: 'In the apps', items: app.apps, wideOnly: true },
            ]}
        />
    );
}

const bays: readonly ServerBay[] = apps.map((app) => ({
    id: app.id,
    name: app.name,
    status: app.status,
    statusLabel: statusLabels[app.status],
    panel: <AppPanel app={app} />,
}));

const legend = (
    <ReadinessLegend
        items={(['available', 'development', 'planned'] as const).map((status) => ({
            status,
            label: statusLabels[status],
        }))}
    />
);

const meta = {
    title: 'Showcase/ServerUnit',
    component: ServerUnit,
    parameters: { layout: 'fullscreen' },
    args: {
        label: "Lar Server's apps",
        display: { name: 'LAR SERVER', state: 'BUILDING' },
        bays,
        legend,
    },
    argTypes: { bays: { control: false }, legend: { control: false } },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ServerUnit>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Server's progress: a four-bay box, one drive per media app. Choose a drive, or use the arrow keys. */
export const Default: Story = {};

/** Without the key under the unit. */
export const WithoutLegend: Story = { args: { legend: undefined } };

/** One app's panel on its own: what works, what is being built and what is planned. */
export const AppStatusPanel: Story = {
    parameters: { layout: 'padded' },
    render: () => (
        <div className="max-w-[480px]">
            <AppPanel app={video} />
        </div>
    ),
};

/** The key for the readiness lights. */
export const Legend: Story = { parameters: { layout: 'padded' }, render: () => legend };
