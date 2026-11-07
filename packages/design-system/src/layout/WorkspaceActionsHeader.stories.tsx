import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutGridIcon, ListIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Heading, Text } from '../typography/Typography';
import { Inline } from './Flow';
import { WorkspaceActionsHeader } from './WorkspaceActionsHeader';

const meta = {
    title: 'Layout/WorkspaceActionsHeader',
    component: WorkspaceActionsHeader,
    parameters: { layout: 'fullscreen' },
    args: {
        leading: (
            <Inline align="baseline">
                <Heading as="h1" variant="section">
                    Films
                </Heading>
                <Text as="span" variant="caption" tone="muted">
                    612 films
                </Text>
            </Inline>
        ),
        children: (
            <Inline align="center">
                <Button variant="secondary" leftIcon={<RefreshCwIcon />}>
                    Scan
                </Button>
                <Inline align="center" space="tight">
                    <IconButton aria-label="Grid" icon={<LayoutGridIcon />} tone="accent" />
                    <IconButton aria-label="List" icon={<ListIcon />} />
                </Inline>
            </Inline>
        ),
    },
    argTypes: { leading: { control: false }, children: { control: false } },
} satisfies Meta<typeof WorkspaceActionsHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A catalog's header: its name and count on the left, scan and view controls on the right. */
export const Default: Story = {};

export const ActionsOnly: Story = {
    args: {
        leading: undefined,
        children: <Button leftIcon={<PlusIcon />}>Add catalog</Button>,
    },
};
