import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { InsetPanel } from '../display/InsetPanel';
import { FormResult } from '../feedback/FormResult';
import { Progress } from '../feedback/Progress';
import { FormRow, FormSection } from '../forms/FormSection';
import { Input } from '../forms/Input';
import { Switch } from '../forms/Switch';
import { SidebarNavigationItem } from '../layout/sidebar/SidebarNavigationItem';
import { SidebarNavigationGroup } from '../layout/sidebar/SidebarPane';
import { InlineButton } from '../typography/Link';
import { Text } from '../typography/Typography';
import { buttonKind } from './ButtonKinds';
import { LabelsValue } from './ItemDetails';
import {
    OpenSettingsButton,
    ProjectValueList,
    ReasonNote,
    SettingControl,
    SettingDetails,
    SettingsGroups,
    SettingsNav,
    SettingsNote,
    SourceLink,
} from './Settings';

const meta = {
    title: 'Board/Settings',
    component: SettingsGroups,
    args: { children: null },
} satisfies Meta<typeof SettingsGroups>;

export default meta;

type Story = StoryObj<typeof meta>;

const reason = (
    <ReasonNote
        reason="GitHub refused pushing branches."
        explanation="GitHub refused pushing branches. Ask for write access to the repository, then check again."
        helpLabel="access"
        action={<InlineButton onClick={fn()}>Recheck</InlineButton>}
    />
);

/** A project's page: its groups, one with a setting that can't be changed and why. */
export const Page: Story = {
    render: () => (
        <div className="max-w-2xl">
            <SettingsGroups data-project-page="maddec01/lar-web">
                <FormSection presentation="dense" title="Project">
                    <InsetPanel presentation="settings">
                        <FormRow layout="flow" label="What this Project does">
                            <Input aria-label="What this Project does" presentation="setting" defaultValue="The site" />
                        </FormRow>
                    </InsetPanel>
                </FormSection>
                <FormSection presentation="dense" title="Docs and skills">
                    <InsetPanel presentation="settings">
                        <FormRow layout="flow" label="Glossary and decisions" description={reason} />
                    </InsetPanel>
                </FormSection>
            </SettingsGroups>
        </div>
    ),
};

/** The reason alone, while its check runs. */
export const Checking: Story = {
    render: () => (
        <ReasonNote
            reason="Not checked yet."
            explanation="The factory hasn't checked this access yet."
            helpLabel="access"
            action={
                <InlineButton disabled onClick={fn()}>
                    Checking…
                </InlineButton>
            }
        />
    ),
};

/** The title bar's Settings button: icon-only, its 20px icon in the text colour. */
export const OpenButton: Story = {
    render: () => <OpenSettingsButton label="Settings" onOpen={fn()} />,
};

const sections = (
    <>
        <SidebarNavigationGroup label="Board">
            <SidebarNavigationItem active onClick={fn()}>
                <span>General</span>
            </SidebarNavigationItem>
            <SidebarNavigationItem onClick={fn()}>
                <span>Appearance</span>
            </SidebarNavigationItem>
        </SidebarNavigationGroup>
        <SidebarNavigationGroup label="App">
            <SidebarNavigationItem onClick={fn()}>
                <span>Updates</span>
            </SidebarNavigationItem>
        </SidebarNavigationGroup>
    </>
);

/** The sections' sidebar, with its search over the groups. */
export const Sidebar: Story = {
    render: () => (
        <div className="flex h-80 w-56">
            <SettingsNav
                label="Settings sections"
                search={<Input type="search" aria-label="Search settings" placeholder="Search settings" />}
            >
                {sections}
            </SettingsNav>
        </div>
    ),
};

/** A search that keeps no section says so. */
export const SidebarNoMatch: Story = {
    render: () => (
        <div className="flex h-80 w-56">
            <SettingsNav
                label="Settings sections"
                search={<Input type="search" aria-label="Search settings" defaultValue="zzz" />}
                empty="No settings match."
            >
                {null}
            </SettingsNav>
        </div>
    ),
};

/** The Skills page: a skill folder with its readers and an install in progress, the group's note with what its last
 *  call did, and a bundled skill with its source. */
export const SkillsPage: Story = {
    render: () => (
        <div className="max-w-2xl">
            <SettingsGroups>
                <FormSection presentation="dense" title="Skill folders" help="The app installs its skills here.">
                    <InsetPanel presentation="settings">
                        <FormRow
                            layout="flow"
                            label="~/.agents/skills"
                            below={
                                <>
                                    <LabelsValue label="Provider instances reading ~/.agents/skills">
                                        <Badge tone="accent">Codex personal</Badge>
                                        <Badge muted>Cursor · Disabled</Badge>
                                    </LabelsValue>
                                    <SettingDetails breaks>
                                        <Text variant="inherit">Release 0.4.0 · Installing</Text>
                                        <Progress aria-label="Skills installed in ~/.agents/skills" value={1} max={2} />
                                        <ul>
                                            <li>lar-build: Installed</li>
                                            <li>lar-shape: Installing</li>
                                        </ul>
                                    </SettingDetails>
                                </>
                            }
                        >
                            <Switch checked aria-label="~/.agents/skills" onCheckedChange={fn()} />
                        </FormRow>
                    </InsetPanel>
                    <SettingsNote>
                        <Text variant="caption" tone="muted" role="status">
                            T3 Code listed its provider targets.
                        </Text>
                        <FormResult
                            id="settings-result"
                            tone="warning"
                            text="Couldn't remove the links Lar Factory didn't make:"
                            list={[<code key="path">~/.claude-work/skills/lar-work</code>]}
                        />
                    </SettingsNote>
                </FormSection>
                <FormSection presentation="dense" title="Bundled skills">
                    <InsetPanel presentation="settings">
                        <FormRow layout="flow" label="tdd" description="Matt Pocock · MIT · updated 19 Oct">
                            <SourceLink href="https://github.com/mattpocock/skills" label="tdd source">
                                Source
                            </SourceLink>
                        </FormRow>
                    </InsetPanel>
                </FormSection>
            </SettingsGroups>
        </div>
    ),
};

/** A setting's control with its error under it, and each Project's value for it. */
export const ControlWithProjects: Story = {
    render: () => (
        <div className="grid max-w-md gap-3">
            <SettingControl>
                <Button {...buttonKind('other')} shrinks mark="▾">
                    T3 Project default
                </Button>
                <Text variant="caption" tone="danger" role="alert">
                    Couldn't save the model.
                </Text>
            </SettingControl>
            <ProjectValueList
                label="Default model by Project"
                rows={[
                    { key: 'web', name: 'maddec01/lar-web', value: 'Codex GPT-5.5' },
                    { key: 'server', name: 'maddec01/lar-server', value: 'Default model unknown' },
                ]}
            />
        </div>
    ),
};
