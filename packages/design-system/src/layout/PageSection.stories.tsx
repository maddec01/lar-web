import type { Meta, StoryObj } from '@storybook/react-vite';
import { HandIcon, HouseIcon, MonitorSmartphoneIcon } from 'lucide-react';

import { FeatureGrid, FeatureTile } from '../showcase/Cards';
import { Backdrop } from '../showcase/Stage';
import { Text } from '../typography/Typography';
import { Eyebrow, PageSection, SectionHeading } from './PageSection';

function Principles() {
    return (
        <FeatureGrid>
            <FeatureTile icon={<HouseIcon />} title="It runs on your machines">
                Your repositories, work records and media libraries live on hardware you own. What&apos;s yours stays
                home.
            </FeatureTile>
            <FeatureTile icon={<MonitorSmartphoneIcon />} title="It fits in where you are">
                Each product works with the tools and devices you already use, from your tracker and CI to your iPhone,
                iPad and Mac.
            </FeatureTile>
            <FeatureTile icon={<HandIcon />} title="You stay in control">
                You approve what ships, decide who gets access, and your own changes are never overwritten.
            </FeatureTile>
        </FeatureGrid>
    );
}

const meta = {
    title: 'Layout/PageSection',
    component: PageSection,
    parameters: { layout: 'fullscreen' },
    args: {
        heading: <SectionHeading eyebrow="Why Lar" title="Three promises in everything we make." />,
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
        tone: 'raised',
        heading: (
            <SectionHeading
                eyebrow="Development preview"
                title="What works, what's next."
                lead="Lar Server isn't publicly released yet. It's being built in the open on real hardware, Music and Video first."
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
                lead="Factory works from what your project already has, and keeps its own things to itself."
            />
        ),
        children: (
            <Text variant="prose" tone="muted">
                Builds follow your package scripts, manifests, CI and tests. Repositories need no factory config, and
                settings and work records stay on your Mac.
            </Text>
        ),
    },
};

/** A section without a heading names itself for assistive technology, here over the hero glow. */
export const LabelledWithBackground: Story = {
    args: {
        label: 'Principles',
        heading: undefined,
        background: <Backdrop hue={264} />,
    },
};

/** The page's opening statement as a display-size h1. */
export const DisplayHeading: Story = {
    args: {
        space: 'hero',
        heading: (
            <SectionHeading
                level="h1"
                size="display"
                title="Software that stays home."
                lead="Lar makes software that runs on machines you own. Each product does one job well, and leaves the final word to you."
            />
        ),
        children: null,
    },
};

export const EyebrowOnly: Story = {
    parameters: { layout: 'padded' },
    render: () => <Eyebrow>Made for collectors</Eyebrow>,
};
