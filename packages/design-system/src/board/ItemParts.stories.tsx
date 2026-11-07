import type { Meta, StoryObj } from '@storybook/react-vite';
import { SparklesIcon } from 'lucide-react';

import { Badge } from '../display/Badge';
import { LabelChip } from '../display/LabelChip';
import { Inline } from '../layout/Flow';
import { Text } from '../typography/Typography';
import { ItemFields, ItemTitle, KindMarker, RepoIdentity, RepoTag, TitleLink } from './ItemParts';

const icon = <span className="grid size-3.5 place-items-center rounded-sm bg-sky-500 text-[9px] text-white">L</span>;

const meta = {
    title: 'Board/ItemParts',
    component: ItemTitle,
    args: { reference: '#147', title: 'Fall back to software transcoding when the GPU is busy' },
} satisfies Meta<typeof ItemTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Title: Story = {};

/** Captured work has no ticket, so no reference. */
export const TitleWithoutReference: Story = { args: { reference: undefined } };

/** A title as a sentence names it: a link to its ticket, or text with no page. */
export const TitleLinks: Story = {
    render: () => (
        <p className="grid gap-2 text-sm">
            <span>
                Moved <TitleLink reference="#12" title="Sign-in screen" href="#ticket" /> to Queued.
            </span>
            <span>
                Added <TitleLink title="A captured thought" /> to List.
            </span>
        </p>
    ),
};

export const Repositories: Story = {
    render: () => (
        <div className="grid w-60 gap-2 text-xs">
            <RepoTag icon={icon} name="lar-server" />
            <RepoIdentity icon={icon} name="lar-server" />
            <RepoIdentity icon={icon} name="a-repository-name-long-enough-to-truncate" />
            <RepoIdentity presentation="map" icon={icon} name="lar-apple" title="maddec01/lar-apple" />
            <RepoIdentity
                presentation="wrap"
                icon={icon}
                name="maddec01/lar-server · #128 · Set aside, finished work"
            />
        </div>
    ),
};

/** The badges and notes beside an item's kind. */
export const KindAndLabels: Story = {
    render: () => (
        <div className="grid w-80 gap-2">
            <Inline as="span" inline wrap space="tight">
                <Badge hue={150}>
                    <SparklesIcon aria-hidden="true" />
                    Feature
                </Badge>
                <KindMarker said="Bug" label="The ticket says Bug." title="The ticket says Bug. Open to choose." />
                <Badge>Part of a concept</Badge>
            </Inline>
            <span className="flex flex-wrap gap-1">
                <LabelChip label="docs" color="#0075ca" />
                <LabelChip label="good first issue" color="#7057ff" />
                <LabelChip label="a label whose name is long enough that the chip truncates it" />
                <LabelChip label="needs-design" note="new" />
            </span>
            <ItemFields text="User Story · Active · Pedro Gomes" />
            <Text as="span" variant="caption" tone="muted" role="status">
                Planning is saved on this Mac.
            </Text>
        </div>
    ),
};
