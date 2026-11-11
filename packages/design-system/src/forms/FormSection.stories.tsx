import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCwIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { InsetPanel } from '../display/InsetPanel';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { HelpTip } from '../overlays/HelpTip';
import { Text } from '../typography/Typography';
import { DateField } from './DateField';
import { Field } from './Field';
import {
    Disclosure,
    FormAction,
    FormContent,
    FormField,
    FormFieldset,
    FormRow,
    FormSection,
    FormStack,
    FormUnit,
} from './FormSection';
import { Input } from './Input';
import { OptionSelect } from './OptionSelect';
import { Switch } from './Switch';
import { Textarea } from './Textarea';

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
        badges: <StatusIndicator state="ready" label="Healthy" />,
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

/** A `section` Disclosure folds a section’s own content, such as an earlier version of a text, behind a muted label. */
export const SectionDisclosure: Story = {
    render: () => (
        <div className="grid max-w-md gap-2">
            <Text>Grant guests read access to the photo library.</Text>
            <Disclosure label="Original" presentation="section">
                <Text>Let guests see the photos.</Text>
            </Disclosure>
            <Disclosure label="Checks" presentation="section" defaultOpen>
                <Text>All checks passed.</Text>
            </Disclosure>
        </div>
    ),
};

/** A `group` Disclosure folds a form’s optional group under its heading, with a badge, starting open when asked; a
 *  `framed` one folds a short list in a frame. */
export const GroupAndFramedDisclosure: Story = {
    render: () => (
        <div className="grid max-w-md gap-4">
            <Disclosure label="Map kinds to labels and types" presentation="group" badge="Optional" lazy defaultOpen>
                <Text variant="caption" tone="muted">
                    Without a mapping, new tickets get no labels from their kind.
                </Text>
            </Disclosure>
            <Disclosure label="Optional settings" presentation="group">
                <Text>What this Project does.</Text>
            </Disclosure>
            <Disclosure label="Already added (2)" presentation="framed">
                <Text>web, api</Text>
            </Disclosure>
        </div>
    ),
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

/** A dialog's editor: FormFields straight in a FormStack, outside any panel, are flush with the dialog's text (full
 *  width), one 20px gap apart with or without help, each label topping its control's first line (beside a textarea
 *  too), and a date reads as the long date pages show until it is focused. */
export const DialogFields: Story = {
    render: () => (
        <div className="max-w-2xl">
            <FormStack>
                <FormField label="Title" helperText="From MusicBrainz">
                    <Input defaultValue="Tidewater Hymns" />
                </FormField>
                <FormField label="Release date" helperText="From MusicBrainz">
                    <DateField value="2021-01-10" locale="en-US" onValueChange={() => {}} />
                </FormField>
                <FormField label="First released">
                    <DateField value="2021-01" locale="en-US" onValueChange={() => {}} />
                </FormField>
                <FormField label="Plot">
                    <Textarea
                        rows={4}
                        defaultValue="On a storm-battered island off the northern coast, a reclusive lighthouse keeper finds a logbook that predicts every ship that will be lost."
                    />
                </FormField>
                <FormField label="Year">
                    <Input defaultValue="2021" />
                </FormField>
            </FormStack>
        </div>
    ),
};

/** Rows with help, content below and an error. `layout="flow"` is deprecated: it draws the one settings row. */
export const FlowRows: Story = {
    render: () => (
        <div className="max-w-2xl">
            <FormSection title="Archive">
                <FormRow layout="flow" label="Hide finished and set-aside work after" data-setting="hide">
                    <FormUnit unit="days">
                        <Input inputMode="numeric" aria-label="Days before hiding" defaultValue="14" />
                    </FormUnit>
                </FormRow>
                <FormRow
                    layout="flow"
                    label="Delete hidden work"
                    help="Deleting removes the work’s brief, threads and reviews from this Mac."
                    description="Export what you want to keep first."
                >
                    <OptionSelect
                        label="Delete hidden work"
                        presentation="setting"
                        writesOnPick
                        value="delete"
                        onChange={() => {}}
                        options={[
                            { value: 'keep', label: 'Keep it' },
                            { value: 'delete', label: 'Delete it after' },
                        ]}
                    />
                    <FormUnit unit="days">
                        <Input inputMode="numeric" aria-label="Days before deleting" defaultValue="x" />
                    </FormUnit>
                </FormRow>
                <FormRow layout="flow" label="Build limit" error="Enter a whole number from 1.">
                    <Switch aria-label="Build limit" busy />
                </FormRow>
            </FormSection>
        </div>
    ),
};

/** `dense`: a title with help and its description over the content as given (SettingsGroup `panel={false}`). */
export const Dense: Story = {
    render: () => (
        <div className="grid max-w-2xl gap-7">
            <FormSection
                presentation="dense"
                title="Kinds and labels"
                help="Map bugs, features and improvements to existing labels and types."
                helpLabel="kind mapping"
            >
                <InsetPanel presentation="settings">
                    <FormRow layout="flow" label="Glossary path">
                        <Input aria-label="Glossary path" presentation="setting" defaultValue="docs/glossary.md" />
                    </FormRow>
                </InsetPanel>
                <Text variant="caption" tone="muted">
                    A note under the group’s panel.
                </Text>
            </FormSection>
            <FormSection
                presentation="dense"
                title="Labels"
                description="Changes here write to the tracker straight away, for everyone using the repository."
            >
                <InsetPanel presentation="settings">
                    <FormRow layout="flow" label="New label">
                        <Input aria-label="New label" placeholder="New label name" />
                    </FormRow>
                </InsetPanel>
            </FormSection>
        </div>
    ),
};

/** A fieldset groups controls under a legend and disables them all at once. */
export const Fieldset: Story = {
    render: () => (
        <div className="max-w-md">
            <FormFieldset legend="Ticket" disabled>
                <Field label="Title">
                    <Input defaultValue="Move the title bar" />
                </Field>
            </FormFieldset>
            <FormFieldset presentation="group">
                <Field label="Body">
                    <Input defaultValue="Grouped and disabled together, with no frame." />
                </Field>
            </FormFieldset>
            <FormFieldset presentation="group" legend="Issue options" hiddenLegend>
                <Field label="Assignee">
                    <Input defaultValue="Its legend names the group for assistive technology only." />
                </Field>
            </FormFieldset>
        </div>
    ),
};

export const Help: Story = {
    render: () => <HelpTip label="Build limit">How many builds run at once.</HelpTip>,
};

/** Short fields stay together; helper text only takes space when present. */
export const AdjacentFields: Story = {
    render: () => (
        <FormStack>
            <FormField label="Title">
                <Input defaultValue="The Lantern Keeper" />
            </FormField>
            <FormField label="Year">
                <Input defaultValue="2024" />
            </FormField>
            <FormField label="Provider" helperText="Choose the source used to match this movie.">
                <OptionSelect
                    label="Provider"
                    value="tmdb"
                    options={[{ value: 'tmdb', label: 'The Movie Database' }]}
                    onChange={() => undefined}
                />
            </FormField>
        </FormStack>
    ),
};
