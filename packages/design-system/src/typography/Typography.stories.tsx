import { Code } from '@ninna-ui/primitives';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading, type HeadingProps, Text, type TextProps } from './Typography';

const textVariants = [
    'body',
    'description',
    'caption',
    'label',
    'overline',
    'metric',
    'lead',
    'prose',
] as const satisfies readonly NonNullable<TextProps['variant']>[];
const headingVariants = [
    'display',
    'hero',
    'headline',
    'feature',
    'page',
    'section',
    'subsection',
    'title',
    'label',
] as const satisfies readonly NonNullable<HeadingProps['variant']>[];
const tones = ['default', 'muted', 'soft', 'danger', 'warning', 'success'] as const satisfies readonly NonNullable<
    TextProps['tone']
>[];

const meta = {
    title: 'Typography/Typography',
    component: Text,
    args: {
        children: 'Your music library holds 4,812 tracks across 362 albums.',
        variant: 'body',
        tone: 'default',
    },
    argTypes: {
        variant: { control: 'select', options: textVariants },
        tone: { control: 'select', options: tones },
        as: { control: 'inline-radio', options: ['p', 'span', 'div'] },
    },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Text with its controls: pick a variant, tone, element, truncation or the loading state. */
export const TextPlayground: Story = {};

/** Every Text variant, from running copy to the dense overline. */
export const TextVariants: Story = {
    render: (args) => (
        <div className="grid max-w-2xl grid-cols-[7rem_1fr] items-baseline gap-x-6 gap-y-4">
            {textVariants.map((variant) => (
                <div key={variant} className="contents">
                    <Text as="span" variant="caption" tone="muted">
                        {variant}
                    </Text>
                    <Text {...args} variant={variant}>
                        {variant === 'metric'
                            ? '4,812'
                            : 'Movies added this week: Arrival, Dune: Part Two and Past Lives.'}
                    </Text>
                </div>
            ))}
        </div>
    ),
};

/** Every Heading variant, from the page's one big statement down to a row label. */
export const HeadingVariants: Story = {
    render: () => (
        <div className="grid max-w-4xl grid-cols-[7rem_1fr] items-baseline gap-x-6 gap-y-6">
            {headingVariants.map((variant) => (
                <div key={variant} className="contents">
                    <Text as="span" variant="caption" tone="muted">
                        {variant}
                    </Text>
                    <Heading variant={variant}>Your home server, your media</Heading>
                </div>
            ))}
        </div>
    ),
};

export const HeadingPlayground: StoryObj<typeof Heading> = {
    args: { children: 'Music library', variant: 'page', as: 'h1', tone: 'default' },
    argTypes: {
        variant: { control: 'select', options: headingVariants },
        tone: { control: 'select', options: tones },
        as: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    },
    render: (args) => <Heading {...args} />,
};

export const Tones: Story = {
    render: (args) => (
        <div className="flex flex-col gap-2">
            {tones.map((tone) => (
                <Text key={tone} {...args} tone={tone}>
                    {tone}: the nightly backup of the photo library finished in 4 minutes.
                </Text>
            ))}
        </div>
    ),
};

/** `inherit` takes the surrounding text's size and colour, such as a message inside a note that sets its own type. */
export const Inherited: Story = {
    render: () => (
        <div className="text-base-700 grid gap-1 text-xs">
            <Text variant="inherit" role="status">
                Reading outgoing issue text…
            </Text>
            <Text variant="inherit" tone="danger" role="alert">
                Could not read the outgoing issue text.
            </Text>
        </div>
    ),
};

/** Text and headings hold their line box while their content loads. */
export const Loading: Story = {
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <Heading variant="page" loading>
                Music library
            </Heading>
            <Text loading>Your music library holds 4,812 tracks.</Text>
            <Text variant="caption" loading>
                Updated a minute ago
            </Text>
        </div>
    ),
};

/** A long name truncated to one line in a narrow column. */
export const Truncated: Story = {
    render: () => (
        <div className="flex w-64 flex-col gap-1">
            <Heading variant="title" truncate>
                The Rise and Fall of Ziggy Stardust and the Spiders from Mars (2012 Remaster)
            </Heading>
            <Text variant="caption" tone="muted" truncate>
                /srv/media/music/David Bowie/1972 - The Rise and Fall of Ziggy Stardust and the Spiders from Mars
            </Text>
        </div>
    ),
};

/** `nowrap` keeps a short phrase, such as a date, on one line while the sentence around it wraps. */
export const NoWrap: Story = {
    render: () => (
        <Text variant="caption" tone="muted" className="w-48">
            Matt Pocock · MIT ·{' '}
            <Text as="span" variant="inherit" nowrap>
                updated 19 Oct 2026
            </Text>
        </Text>
    ),
};

/** The marketing pages' lead and prose under a headline. */
export const MarketingCopy: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-col gap-4">
            <Text variant="overline" tone="muted">
                Software factory
            </Text>
            <Heading variant="headline">Build, test and ship from your own server</Heading>
            <Text variant="lead" tone="muted">
                Lar runs your repositories&apos; pipelines next to your media, on hardware you own, with no per-seat
                pricing and no data leaving the house.
            </Text>
            <Text variant="prose">
                Point Lar at a repository and it builds every push, keeps the artefacts and deploys the ones you
                approve. The same box streams your movies and music to every screen at home.
            </Text>
        </div>
    ),
};

/** Inline code, re-exported from ninna-ui as `Code`. */
export const InlineCode: Story = {
    render: () => (
        <Text>
            Install the package with <Code>pnpm add @lar-works/design-system</Code> and import <Code>styles.css</Code>{' '}
            once.
        </Text>
    ),
};
