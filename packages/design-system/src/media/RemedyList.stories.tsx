import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyIcon, FolderIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { NoticeCard } from '../display/NoticeCard';
import { Disclosure } from '../forms/FormSection';
import { RemedyList, RemedyRow } from './RemedyList';

const meta = {
    title: 'Media/RemedyList',
    component: RemedyList,
    args: {
        label: 'How Lar can fix it',
        children: (
            <>
                <RemedyRow
                    description="Lar moves each edition into its own folder, named after it, so you can keep them all. Tags stay as they are and nothing is deleted."
                    action={<Button>Fix the folders</Button>}
                />
                <RemedyRow
                    description="Choose the edition to keep. Lar sets the others aside in a hidden folder that Lar and Lidarr ignore."
                    action={<Button variant="secondary">Keep one edition</Button>}
                />
                <RemedyRow
                    description="Pick the release on MusicBrainz and check every change; Lar then rewrites the tags to match it."
                    action={<Button variant="secondary">Match with MusicBrainz</Button>}
                />
            </>
        ),
    },
    decorators: [
        (Story) => (
            <div className="max-w-3xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof RemedyList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTitles: Story = {
    args: {
        label: 'Ways to fix it',
        children: (
            <>
                <RemedyRow
                    title="Split the folder"
                    description="Each edition gets its own folder. Nothing is deleted."
                    action={<Button>Split</Button>}
                />
                <RemedyRow
                    title="Keep one edition"
                    description="The others are set aside, not deleted."
                    action={<Button variant="secondary">Choose</Button>}
                />
            </>
        ),
    },
};

/** A remedy Lar can’t run for you: guidance only, no action. */
export const GuidanceOnly: Story = {
    args: {
        label: 'What you can do',
        children: (
            <RemedyRow description="Keep the copy you want and delete the others yourself. Lar never deletes files." />
        ),
    },
};

export const Narrow: Story = {
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
};

/** The composition the server’s integrity case uses: the issue, its remedies, its details, and one footer action. */
export const InNoticeCard: Story = {
    render: (args) => (
        <NoticeCard
            tone="warning"
            icon={<FolderIcon />}
            title="Different editions share one folder"
            badge={<Badge tone="warning">Worth fixing</Badge>}
            description="This folder holds 2 editions of the same album, so tracks show up more than once and players can mix them up."
            actions={<Button variant="secondary">Dismiss</Button>}
        >
            <RemedyList {...args} />
            <Disclosure label="What Lar found (1 finding)">Two releases share /music/Night Ferry (2019).</Disclosure>
        </NoticeCard>
    ),
};

export const GuidanceInNoticeCard: Story = {
    render: () => (
        <NoticeCard
            tone="warning"
            icon={<CopyIcon />}
            title="The same track is stored more than once"
            badge={<Badge tone="warning">Worth fixing</Badge>}
            description="More than one file claims the same track of this album, in this folder or in another one."
            actions={<Button variant="secondary">Dismiss</Button>}
        >
            <RemedyList label="What you can do">
                <RemedyRow description="Keep the copy you want and delete the others yourself. Lar never deletes files." />
            </RemedyList>
        </NoticeCard>
    ),
};
