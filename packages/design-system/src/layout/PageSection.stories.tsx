import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading, Text } from '../typography/Typography';
import { Grid, Stack } from './Flow';
import { Eyebrow, PageSection, SectionHeading } from './PageSection';

const principles = [
    ['It runs on your machines', 'Your files live on hardware you own. What’s yours stays home.'],
    ['It fits in where you are', 'It works with the tools and devices you already use.'],
    ['You stay in control', 'You approve what changes, and your own changes are never overwritten.'],
] as const;

function Principles() {
    return (
        <Grid>
            {principles.map(([title, body]) => (
                <Stack key={title} space="related">
                    <Heading as="h3" variant="subsection">
                        {title}
                    </Heading>
                    <Text tone="muted">{body}</Text>
                </Stack>
            ))}
        </Grid>
    );
}

/** A soft glow behind a section, as a page draws one. */
function Glow() {
    return (
        <div
            aria-hidden="true"
            className="from-primary-surface absolute inset-0 -z-10 bg-radial-[at_50%_0%] to-transparent to-70%"
        />
    );
}

const meta = {
    title: 'Layout/PageSection',
    component: PageSection,
    parameters: { layout: 'fullscreen' },
    args: {
        heading: <SectionHeading eyebrow="Why it" title="Three promises in everything it does." />,
        children: <Principles />,
    },
    argTypes: {
        heading: { control: false },
        children: { control: false },
        background: { control: false },
    },
} satisfies Meta<typeof PageSection>;

export default meta;

type Story = StoryObj<typeof meta>;

/** One band of a marketing page: a centred heading with room to breathe, then the content. */
export const Default: Story = {};

/** A raised band sets a section apart from the ones around it. */
export const Raised: Story = {
    args: {
        variant: 'raised',
        heading: (
            <SectionHeading
                eyebrow="Development preview"
                title="What works, what’s next."
                lead="It isn’t publicly released yet. It’s being built in the open, one feature at a time."
            />
        ),
    },
};

/** A narrow column for reading, with a heading aligned to the start. */
export const NarrowStartAligned: Story = {
    args: {
        width: 'narrow',
        heading: (
            <SectionHeading
                align="start"
                eyebrow="Fits right in"
                title="Nothing to install in your repositories."
                lead="It works from what your project already has, and keeps its own things to itself."
            />
        ),
        children: (
            <Text variant="prose" tone="muted">
                It follows your package scripts, manifests, CI and tests. Projects need no configuration of its own, and
                its settings stay on your computer.
            </Text>
        ),
    },
};

/** A section without a heading names itself for assistive technology, here over a glow. */
export const LabelledWithBackground: Story = {
    args: {
        label: 'Principles',
        heading: undefined,
        background: <Glow />,
    },
};

/** The page’s opening statement as a display-size h1. */
export const DisplayHeading: Story = {
    args: {
        space: 'hero',
        heading: (
            <SectionHeading
                level="h1"
                variant="display"
                title="Software that stays home."
                lead="It runs on machines you own, does one job well, and leaves the final word to you."
            />
        ),
        children: null,
    },
};

export const EyebrowOnly: Story = {
    parameters: { layout: 'padded' },
    render: () => <Eyebrow>Made for teams</Eyebrow>,
};
