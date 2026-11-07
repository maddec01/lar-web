import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCwIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { Text } from '../typography/Typography';
import { Disclosure, FormAction, FormContent, FormField, FormRow, FormSection, FormStack } from './FormSection';
import { Input } from './Input';
import { OptionSelect } from './OptionSelect';
import { Switch } from './Switch';

const meta = {
    title: 'Forms/FormSection',
    component: FormSection,
    args: {
        title: 'Music library',
        description: 'Where Lar finds your music and how it keeps the library up to date.',
        children: (
            <>
                <FormField label="Media folder" helperText="A folder on this server or a mounted share.">
                    <Input defaultValue="/srv/media/music" />
                </FormField>
                <FormRow label="Watch for changes" description="Import new albums as soon as they land in the folder.">
                    <Switch aria-label="Watch for changes" defaultChecked />
                </FormRow>
            </>
        ),
    },
    render: (args) => (
        <div className="max-w-2xl">
            <FormSection {...args} />
        </div>
    ),
} satisfies Meta<typeof FormSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActionAndBadges: Story = {
    args: {
        action: (
            <Button variant="quiet" leftIcon={<RefreshCwIcon />}>
                Rescan
            </Button>
        ),
        badges: <Badge tone="success">Healthy</Badge>,
    },
};

/** While the settings load, the whole section is a skeleton labelled by its title. */
export const Loading: Story = { args: { loading: true } };

/** FormRow: a label and description beside a control, for switches and short selects. */
export const Rows: Story = {
    args: {
        title: 'Playback',
        description: undefined,
        children: (
            <>
                <FormRow
                    label="Gapless playback"
                    description="Play live albums and DJ mixes without silence between tracks."
                >
                    <Switch aria-label="Gapless playback" defaultChecked />
                </FormRow>
                <FormRow
                    label="Streaming quality"
                    description="The quality clients outside your network receive."
                    badges={<Badge tone="accent">New</Badge>}
                >
                    <OptionSelect
                        label="Streaming quality"
                        value="high"
                        options={[
                            { value: 'original', label: 'Original' },
                            { value: 'high', label: 'High (320 kbps)' },
                        ]}
                        onChange={() => {}}
                    />
                </FormRow>
            </>
        ),
    },
};

/** FormField: a labelled control, optionally with an action, an error or a loading state. */
export const Fields: Story = {
    args: {
        title: 'Repository',
        description: undefined,
        children: (
            <>
                <FormField label="Name" required>
                    <Input defaultValue="lar-web" />
                </FormField>
                <FormField
                    label="Remote"
                    helperText="Lar pulls from here before every build."
                    action={<FormAction>Test connection</FormAction>}
                >
                    <Input defaultValue="git@github.com:lar-works/lar-web.git" />
                </FormField>
                <FormField label="Deploy key" invalid errorText="The key was rejected by the remote.">
                    <Input defaultValue="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA…" invalid />
                </FormField>
                <FormField label="Webhook" loading loadingLabel="Loading webhook" />
            </>
        ),
    },
};

/** FormContent for free-form content, and Disclosure for details most people can skip. */
export const ContentAndDisclosure: Story = {
    args: {
        title: 'Advanced',
        description: undefined,
        children: (
            <FormContent>
                <Text variant="caption" tone="muted">
                    These settings rarely need changing.
                </Text>
                <Disclosure label="How Lar matches albums">
                    Lar reads MusicBrainz IDs from the tags first, then falls back to the artist, album title and track
                    count.
                </Disclosure>
            </FormContent>
        ),
    },
};

/** FormStack spaces several sections as a settings page. */
export const Stacked: Story = {
    render: () => (
        <div className="max-w-2xl">
            <FormStack>
                <FormSection title="Library">
                    <FormField label="Name">
                        <Input defaultValue="Movies" />
                    </FormField>
                </FormSection>
                <FormSection title="Metadata" description="Where posters, cast and summaries come from.">
                    <FormRow label="Download posters" description="Fetch artwork for every movie that has none.">
                        <Switch aria-label="Download posters" defaultChecked />
                    </FormRow>
                </FormSection>
            </FormStack>
        </div>
    ),
};
