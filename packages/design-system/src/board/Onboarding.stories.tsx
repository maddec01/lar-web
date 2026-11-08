import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { BrandMark } from '../display/BrandMark';
import { InsetPanel } from '../display/InsetPanel';
import { NoticeCard } from '../display/NoticeCard';
import { RadioChoice } from '../display/RadioChoice';
import { EmptyState } from '../feedback/EmptyState';
import { Progress } from '../feedback/Progress';
import { Disclosure, FormFieldset } from '../forms/FormSection';
import { Input } from '../forms/Input';
import { Text } from '../typography/Typography';
import { buttonKind } from './ButtonKinds';
import {
    AddFolderLine,
    ChoiceDetails,
    EmptyBoard,
    ProjectLine,
    ProjectList,
    ProjectListItem,
    SetupCardList,
    SetupHeader,
    SetupStep,
} from './Onboarding';

const meta = {
    title: 'Board/Onboarding',
    component: SetupStep,
    args: { children: null },
} satisfies Meta<typeof SetupStep>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The board before its first Project: the welcome, scrolling in the main area. */
export const Empty: Story = {
    render: () => (
        <div className="flex h-96 flex-col">
            <EmptyBoard data-empty-state>
                <EmptyState
                    artwork={<BrandMark label="Lar" />}
                    title="Add your first Project"
                    description="Connect a Project to see its work and start agents from this board."
                    actions={<Button {...buttonKind('other')}>Add a Project</Button>}
                />
            </EmptyBoard>
        </div>
    ),
};

/** A card for each Project still setting up, above the board. */
export const SetupCards: Story = {
    render: () => (
        <div className="flex h-64 flex-col">
            <SetupCardList>
                {['lar-web', 'lar-server'].map((name) => (
                    <NoticeCard
                        key={name}
                        tone="warning"
                        icon={<span className="bg-fill-muted-hover size-5 rounded-md" />}
                        title={`maddec01/${name}`}
                        badge={<Badge tone="warning">Setting up</Badge>}
                        description="Stopped at the work step"
                        actions={<Button {...buttonKind('other')}>Resume</Button>}
                    />
                ))}
            </SetupCardList>
        </div>
    ),
};

const icon = <span className="bg-fill-muted-hover size-4 shrink-0 rounded-sm" />;

/** The first step: the place and progress, then the T3 projects to pick, the folder to add, and those already added
 *  or that can’t be added, folded. */
export const ProjectStep: Story = {
    render: () => (
        <div className="grid w-full max-w-xl gap-4">
            <SetupHeader
                icon={icon}
                place={<Text tone="muted">Set up web.</Text>}
                progress={<Progress value={0} max={3} caption="Step 1 of 3" aria-label="Step 1 of 3" />}
            />
            <SetupStep>
                <FormFieldset presentation="group" legend="T3 project" hiddenLegend>
                    <InsetPanel presentation="settings">
                        <RadioChoice name="t3-project" checked={false} onChange={fn()} data-choice="web">
                            <ProjectLine
                                icon={icon}
                                name="web"
                                badge="GitHub"
                                path="~/Developer/web"
                                fullPath="/Users/me/Developer/web"
                            />
                        </RadioChoice>
                        <RadioChoice name="t3-project" checked onChange={fn()} data-choice="new">
                            <AddFolderLine
                                title="Add a repository folder"
                                hint="Choose a folder already on this machine."
                            />
                        </RadioChoice>
                    </InsetPanel>
                </FormFieldset>
                <ChoiceDetails>
                    <Input aria-label="Repository folder" placeholder="~/Developer/my-project" />
                </ChoiceDetails>
                <Disclosure presentation="framed" label="Already added (1)">
                    <ProjectList>
                        <ProjectListItem>
                            <ProjectLine
                                icon={icon}
                                name="api"
                                badge="Added"
                                path="~/Developer/api"
                                fullPath="/Users/me/Developer/api"
                            />
                        </ProjectListItem>
                    </ProjectList>
                </Disclosure>
                <Disclosure presentation="framed" label="Can’t be added (1)" defaultOpen>
                    <ProjectList>
                        <ProjectListItem reason="This folder is a git worktree. Add its main checkout instead.">
                            <ProjectLine
                                icon={icon}
                                name="worktree"
                                path="~/Developer/worktree"
                                fullPath="/Users/me/Developer/worktree"
                            />
                        </ProjectListItem>
                    </ProjectList>
                </Disclosure>
            </SetupStep>
        </div>
    ),
};

/** The work step’s groups, further apart, with an optional group folded under its heading. */
export const WorkStep: Story = {
    render: () => (
        <div className="w-full max-w-xl">
            <SetupStep presentation="form" data-work-step>
                <Text variant="caption" tone="muted">
                    New labels wait until you add the Project.
                </Text>
                <Disclosure presentation="group" label="Map kinds to labels and types" badge="Optional" lazy>
                    <Text variant="caption" tone="muted">
                        Without a mapping, new tickets get no labels from their kind.
                    </Text>
                </Disclosure>
                <Disclosure presentation="group" label="Optional settings">
                    <Input aria-label="What this Project does" presentation="setting" placeholder="API" />
                </Disclosure>
                <span>
                    <Button {...buttonKind('other')} onClick={fn()}>
                        Recheck access
                    </Button>
                </span>
            </SetupStep>
        </div>
    ),
};
