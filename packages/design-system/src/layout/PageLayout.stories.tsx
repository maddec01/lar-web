import type { Meta, StoryObj } from '@storybook/react-vite';
import { BracesIcon, FilmIcon, LayoutGridIcon, ListIcon, RefreshCwIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { Heading, Text } from '../typography/Typography';
import { Grid, InlineBase, StackBase } from './Flow';
import { PageLayout } from './PageLayout';
import { Section } from './Section';
import { WorkspaceActionsHeader } from './WorkspaceActionsHeader';

const films = [
    'Alien',
    'Arrival',
    'Blade Runner',
    'Children of Men',
    'Dune',
    'Heat',
    'In the Mood for Love',
    'Jaws',
    'Moonlight',
    'Paris, Texas',
    'Stalker',
    'The Thing',
];

function Posters() {
    return (
        <Grid variant="posters">
            {films.map((film) => (
                <StackBase key={film} space="tight">
                    <div className="bg-fill-muted border-line text-fg-muted flex aspect-[2/3] items-center justify-center rounded-md border [&>svg]:size-6">
                        <FilmIcon />
                    </div>
                    <Text as="span" variant="caption" truncate>
                        {film}
                    </Text>
                </StackBase>
            ))}
        </Grid>
    );
}

const meta = {
    title: 'Layout/PageLayout',
    component: PageLayout,
    parameters: { layout: 'fullscreen' },
    args: {
        label: 'Remote Access',
        title: 'Remote Access',
        description: 'Set up internet access and check whether devices outside your home can connect.',
        children: (
            <Section title="Connection" description="Apps reach this server directly, with no relay in between.">
                <InlineBase align="center" justify="between" className="border-line rounded-lg border p-4">
                    <StackBase space="none">
                        <Text as="span" variant="label">
                            Router forwarding
                        </Text>
                        <Text as="span" variant="caption" tone="muted">
                            Port 32400 forwarded automatically by UPnP
                        </Text>
                    </StackBase>
                    <StatusIndicator state="ready" label="Reachable" />
                </InlineBase>
            </Section>
        ),
    },
    argTypes: { children: { control: false }, header: { control: false } },
} satisfies Meta<typeof PageLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A page with its title and description above the content. */
export const Default: Story = {};

/** A catalog page: the actions header on top, then the library. */
/** A title-only page's quiet controls sit at the title row's end, never floating elsewhere on the page. */
export const WithTitleActions: Story = {
    args: { actions: <IconButton aria-label="Technical details" icon={<BracesIcon />} /> },
};

export const WithActionsHeader: Story = {
    args: {
        label: 'Films',
        title: undefined,
        description: undefined,
        header: (
            <WorkspaceActionsHeader
                leading={
                    <Heading as="h1" variant="section">
                        Films
                    </Heading>
                }
            >
                <InlineBase align="center">
                    <Button variant="secondary" leftIcon={<RefreshCwIcon />}>
                        Scan
                    </Button>
                    <IconButton aria-label="Grid" icon={<LayoutGridIcon />} tone="accent" />
                    <IconButton aria-label="List" icon={<ListIcon />} />
                </InlineBase>
            </WorkspaceActionsHeader>
        ),
        children: <Posters />,
    },
};

/** A detail page puts more room between its blocks. */
export const Detail: Story = {
    args: {
        variant: 'detail',
        label: 'Arrival',
        title: 'Arrival',
        description: '2016 · Science fiction · 1 h 56 min',
        children: (
            <>
                <div className="max-w-160">
                    <Text variant="prose" tone="muted">
                        A linguist works with the military to communicate with alien lifeforms after twelve mysterious
                        spacecraft appear around the world.
                    </Text>
                </div>
                <Section title="Files" level="h2">
                    <Text tone="muted">Arrival (2016).mkv · 2160p · HDR10 · 48.2 GB</Text>
                </Section>
            </>
        ),
    },
};
