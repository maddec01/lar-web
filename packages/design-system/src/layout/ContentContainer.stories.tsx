import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading, Text } from '../typography/Typography';
import { ContentContainer } from './ContentContainer';
import { Stack } from './Flow';

const meta = {
    title: 'Layout/ContentContainer',
    component: ContentContainer,
    parameters: { layout: 'fullscreen' },
    args: {
        children: (
            <Stack space="related" className="border-base-300 rounded-lg border border-dashed p-4">
                <Heading as="h2" variant="section">
                    Music
                </Heading>
                <Text tone="muted">2,418 albums from 612 artists, indexed from your files&apos; own tags.</Text>
            </Stack>
        ),
    },
    argTypes: { children: { control: false } },
} satisfies Meta<typeof ContentContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The page column's 16px gutter, full width: the dashed box shows where content starts. */
export const Default: Story = {};

/** As the page's main landmark, with extra classes for vertical rhythm. */
export const AsMain: Story = { args: { as: 'main', className: 'py-6' } };
