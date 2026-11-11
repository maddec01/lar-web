import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ArchiveIcon,
    BellIcon,
    FolderGit2Icon,
    GlobeIcon,
    PaletteIcon,
    PlugIcon,
    RotateCcwIcon,
    Settings2Icon,
    UsersIcon,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { ThemeSwitch } from '../actions/ThemeSwitch';
import { Input } from '../forms/Input';
import { OptionSelect } from '../forms/OptionSelect';
import { useSettingsDraft } from '../forms/SettingsDraft';
import { SettingsGroup } from '../forms/SettingsGroup';
import { SettingsControl, SettingsDetails, SettingsReason, SettingsValueList } from '../forms/SettingsParts';
import { SettingsRow } from '../forms/SettingsRow';
import { Switch } from '../forms/Switch';
import { SettingsDialog, type SettingsDialogGroup } from './SettingsDialog';

const groups: SettingsDialogGroup[] = [
    {
        label: 'Board',
        sections: [
            { id: 'general', label: 'General', icon: <Settings2Icon />, keywords: 'notifications sidebar limits' },
            { id: 'appearance', label: 'Appearance', icon: <PaletteIcon />, keywords: 'theme dark light' },
            { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
        ],
    },
    {
        label: 'Connections',
        sections: [
            { id: 'projects', label: 'Projects', icon: <FolderGit2Icon /> },
            { id: 'integrations', label: 'Integrations', icon: <PlugIcon /> },
            { id: 'users', label: 'Users', icon: <UsersIcon />, notification: '2 sign-in requests' },
            { id: 'remote-access', label: 'Remote access', icon: <GlobeIcon /> },
        ],
    },
    { label: 'App', sections: [{ id: 'archive', label: 'Archive', icon: <ArchiveIcon /> }] },
];

/** A switch applies at once: the control is the feedback. */
function Toggle({ label, initial = false }: { label: string; initial?: boolean }) {
    const [on, setOn] = useState(initial);

    return <Switch aria-label={label} checked={on} onCheckedChange={setOn} />;
}

/** A dropdown applies at once too. */
function Choice({ label, options, initial }: { label: string; options: string[]; initial: string }) {
    const [value, setValue] = useState(initial);

    return (
        <OptionSelect
            label={label}
            presentation="setting"
            value={value}
            onChange={setValue}
            options={options.map((option) => ({ value: option, label: option }))}
        />
    );
}

/** A typed number is a draft: the footer saves it, Enter in the field too. */
function LimitDraft() {
    const [saved, setSaved] = useState(4);
    const [typed, setTyped] = useState<string | null>(null);
    const text = typed ?? String(saved);
    const number = Number(text);
    const invalid = !Number.isInteger(number) || number < 1;
    const { submit } = useSettingsDraft({
        dirty: typed !== null && text !== String(saved),
        invalid,
        save: () =>
            new Promise<void>((resolve) =>
                setTimeout(() => {
                    setSaved(number);
                    setTyped(null);
                    resolve();
                }, 600),
            ),
        reset: () => setTyped(null),
    });

    return (
        <form
            onSubmit={(event: FormEvent) => {
                event.preventDefault();
                submit();
            }}
        >
            <SettingsControl>
                <Input
                    presentation="count"
                    inputMode="numeric"
                    aria-label="Parallel tests and builds"
                    value={text}
                    invalid={invalid}
                    onChange={(event) => setTyped(event.target.value)}
                />
            </SettingsControl>
        </form>
    );
}

function GeneralSection() {
    return (
        <>
            <SettingsGroup title="Notifications">
                <SettingsRow
                    label="Thread notifications"
                    description="System alerts when a thread finishes, fails, or needs input or approval. Applies to this device while the board is open."
                >
                    <Choice
                        label="Thread notifications"
                        options={['Notifications only', 'Sound and notifications', 'Off']}
                        initial="Notifications only"
                    />
                </SettingsRow>
                <SettingsRow
                    label="In-app notifications"
                    description="Show a toast when another thread finishes, fails, or needs input while this app has focus."
                >
                    <Toggle label="In-app notifications" />
                </SettingsRow>
            </SettingsGroup>
            <SettingsGroup
                title="Commands"
                action={
                    <Button size="sm" variant="quiet" leftIcon={<RotateCcwIcon />}>
                        Restore defaults
                    </Button>
                }
            >
                <SettingsRow
                    label="Parallel tests and builds"
                    description="Limit tests and builds running together across all projects on this Mac."
                    help="Automatic allows one per 4 CPUs or 8 GB of memory, whichever is fewer."
                >
                    <LimitDraft />
                </SettingsRow>
                <SettingsRow
                    label="Shaping threads when a build starts"
                    description="Choose whether to keep, finish, archive or delete the shaping thread."
                    below={
                        <SettingsValueList
                            label="Each project's choice"
                            rows={[
                                { key: 'web', name: 'lar-web', value: 'Mark as finished' },
                                { key: 'server', name: 'lar-server', value: 'Archive' },
                            ]}
                        />
                    }
                >
                    <Choice
                        label="Shaping threads"
                        options={['Keep', 'Mark as finished', 'Archive', 'Delete']}
                        initial="Mark as finished"
                    />
                </SettingsRow>
                <SettingsRow label="Auto-build model" description="Used for automatic starts.">
                    <SettingsReason
                        reason="T3 isn't running"
                        explanation="Open T3 Code to choose a model; Auto-build uses the project's default until then."
                        action={
                            <Button size="sm" variant="quiet">
                                Check again
                            </Button>
                        }
                    />
                </SettingsRow>
            </SettingsGroup>
            <SettingsGroup title="Sidebar">
                <SettingsRow label="Project grouping" description="Combine matching repositories across environments.">
                    <Toggle label="Project grouping" initial />
                </SettingsRow>
                <SettingsRow label="Appearance" description="Choose how Lar looks on this device.">
                    <ThemeSwitch value="dark" onChange={fn()} />
                </SettingsRow>
                <SettingsRow
                    label="Skill folders"
                    description="Where agents read Lar's bundled skills."
                    below={
                        <SettingsDetails breaks>
                            <span className="text-fg-muted">~/.claude/skills · ~/.codex/skills/lar-factory</span>
                        </SettingsDetails>
                    }
                >
                    <Button size="sm" variant="secondary">
                        Install
                    </Button>
                </SettingsRow>
            </SettingsGroup>
        </>
    );
}

/** Opens with the story on its first section; reopens from the button after it closes. */
function SettingsDemo({ initial = 'general' }: { initial?: string }) {
    const [open, setOpen] = useState(true);
    const [section, setSection] = useState(initial);
    const label = groups.flatMap((group) => group.sections).find((item) => item.id === section)?.label;

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                Settings
            </Button>
            {open ? (
                <SettingsDialog
                    groups={groups}
                    section={section}
                    onSectionChange={setSection}
                    onClose={() => setOpen(false)}
                    description={
                        section === 'general' ? 'Notifications, command limits and the sidebar on this Mac.' : undefined
                    }
                    actions={
                        section === 'general' ? (
                            <Button size="sm" variant="quiet" leftIcon={<RotateCcwIcon />}>
                                Restore defaults
                            </Button>
                        ) : undefined
                    }
                >
                    {section === 'general' ? (
                        <GeneralSection />
                    ) : (
                        <SettingsGroup title={label} loading skeleton={[{ label: 'Theme' }, { label: 'Density' }]} />
                    )}
                </SettingsDialog>
            ) : null}
        </>
    );
}

const meta = {
    title: 'Overlays/SettingsDialog',
    component: SettingsDemo,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SettingsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** T3 Code's settings: the glass sidebar with `/` search, the breadcrumb header, groups of rows. Type a number in
 *  "Parallel tests and builds" to see the save bar; close or change section to see the unsaved-draft question. */
export const General: Story = {};
/** A section still loading: its group's rows as skeletons as wide as their real titles. */
export const Loading: Story = { args: { initial: 'appearance' } };
/** On a phone: the dialog is a full-height sheet and the sections a sideways row above the content. */
export const Phone: Story = { globals: { viewport: { value: 'mobile1' } } };
