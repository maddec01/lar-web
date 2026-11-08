import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { Text } from '../typography/Typography';
import { type FlowSpace, Grid, Inline, Stack } from './Flow';

function Block({ children }: { children: ReactNode }) {
    return (
        <div className="border-primary-ring bg-primary-surface text-fg-soft rounded-md border px-3 py-2 text-sm">
            {children}
        </div>
    );
}

const spaces: readonly FlowSpace[] = ['none', 'tight', 'related', 'group', 'section', 'page'];

const meta = {
    title: 'Layout/Flow',
    component: Stack,
    args: {
        space: 'group',
        children: (
            <>
                <Block>Music</Block>
                <Block>Films</Block>
                <Block>Series</Block>
            </>
        ),
    },
    argTypes: {
        space: { control: 'select', options: spaces },
        children: { control: false },
    },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A column on Lar’s spacing scale: the space names say how related the items are, not how many pixels. */
export const Column: Story = {};

/** Every step of the scale, from none to page. */
export const SpacingScale: Story = {
    render: () => (
        <Inline space="page" wrap align="start">
            {spaces.map((space) => (
                <Stack key={space} space="related">
                    <Text as="span" variant="caption" tone="muted">
                        {space}
                    </Text>
                    <Stack space={space}>
                        <Block>One</Block>
                        <Block>Two</Block>
                        <Block>Three</Block>
                    </Stack>
                </Stack>
            ))}
        </Inline>
    ),
};

/** A row: buttons and labels side by side, wrapping when asked to. */
export const Row: Story = {
    render: () => (
        <Stack space="section">
            <Inline align="center">
                <Button variant="secondary">Cancel</Button>
                <Button>Save changes</Button>
            </Inline>
            <div className="border-line rounded-md border p-3">
                <Inline align="center" justify="between">
                    <Text as="span" variant="label">
                        Remote Access
                    </Text>
                    <Button variant="secondary">Review</Button>
                </Inline>
            </div>
            <div className="max-w-xs">
                <Inline wrap space="tight">
                    {['FLAC', 'ALAC', 'MP3', 'AAC', 'Opus', 'WAV', 'AIFF', 'DSD'].map((format) => (
                        <Block key={format}>{format}</Block>
                    ))}
                </Inline>
            </div>
        </Stack>
    ),
};

/** The named grids: each variant picks its own column rule and gap. */
export const Grids: Story = {
    render: () => (
        <Stack space="page">
            {(['metrics', 'content', 'overview', 'details', 'pairs', 'posters'] as const).map((variant) => (
                <Stack key={variant} space="related">
                    <Text as="span" variant="caption" tone="muted">
                        {variant}
                    </Text>
                    <Grid variant={variant}>
                        {Array.from({ length: variant === 'posters' ? 8 : 4 }, (_, index) => (
                            <Block key={index}>
                                {variant === 'posters' ? (
                                    <span className="block aspect-[2/3]">Poster {index + 1}</span>
                                ) : (
                                    `Item ${index + 1}`
                                )}
                            </Block>
                        ))}
                    </Grid>
                </Stack>
            ))}
        </Stack>
    ),
};
