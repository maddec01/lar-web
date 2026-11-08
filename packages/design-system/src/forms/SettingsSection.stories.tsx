import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { InsetPanel } from '../display/InsetPanel';
import { EmptyState } from '../feedback/EmptyState';
import { SettingsRow, SettingsRowSkeleton } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { Switch } from './Switch';

const meta = {
    title: 'Forms/SettingsSection',
    component: SettingsSection,
    args: {
        title: 'Projects',
        count: 0,
        action: (
            <Button size="sm" variant="secondary" leftIcon={<PlusIcon />}>
                Add project
            </Button>
        ),
        children: <EmptyState size="inline" title="No projects yet" />,
    },
} satisfies Meta<typeof SettingsSection>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Loading: Story = {
    args: { title: 'Playback', loading: true, loadingLabel: 'Loading playback settings', skeletonRows: 3 },
};
export const LoadingAndLoaded: Story = {
    render: () => (
        <div className="grid max-w-5xl gap-8 md:grid-cols-2">
            {[true, false].map((loading) => (
                <SettingsSection
                    key={String(loading)}
                    title="Music playback"
                    loading={loading}
                    loadingLabel="Loading music playback"
                    action={
                        <Button size="sm" variant="quiet">
                            Refresh
                        </Button>
                    }
                >
                    <InsetPanel presentation="settings">
                        <SettingsRow
                            loading={loading}
                            label="Generate audio"
                            description="Prepare compatible audio before playback."
                        >
                            <Switch checked aria-label="Generate audio" />
                        </SettingsRow>
                        <SettingsRow loading={loading} label="Cache" description="Storage used by generated audio.">
                            <Button variant="quiet">Clear cache</Button>
                        </SettingsRow>
                    </InsetPanel>
                </SettingsSection>
            ))}
        </div>
    ),
};
export const CustomSkeletonRows: Story = {
    args: {
        title: 'Remote access',
        loading: true,
        children: (
            <InsetPanel presentation="settings">
                <SettingsRowSkeleton control="switch" />
                <SettingsRowSkeleton description={false} control="value" />
                <SettingsRowSkeleton control="input" />
            </InsetPanel>
        ),
    },
};

/** Ghost actions on the heading, alone or as a group, sit flush with the panel’s edge like a bordered action does; the
 *  slot handles it, so callers never nudge a button. A caption about an action goes in `description`. */
export const GhostActionsFlush: Story = {
    render: () => (
        <div className="grid max-w-xl gap-8">
            <SettingsSection
                title="Log files"
                description="Kept for 14 days, then deleted."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="quiet">
                            Refresh
                        </Button>
                        <Button size="sm" variant="destructive-quiet">
                            Delete all logs
                        </Button>
                    </div>
                }
            >
                <InsetPanel presentation="settings">
                    <SettingsRow label="7 November 2026" description="2.4 MB">
                        <Button size="sm" variant="quiet">
                            Download
                        </Button>
                    </SettingsRow>
                </InsetPanel>
            </SettingsSection>
            <SettingsSection
                title="Catalogs"
                action={
                    <Button size="sm" variant="secondary" leftIcon={<PlusIcon />}>
                        Add catalog
                    </Button>
                }
            >
                <InsetPanel presentation="settings">
                    <SettingsRow label="Music" description="/mnt/media/music">
                        <Button size="sm" variant="secondary">
                            Edit
                        </Button>
                    </SettingsRow>
                </InsetPanel>
            </SettingsSection>
        </div>
    ),
};
