import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { Text } from '../typography/Typography';
import { Grid } from './Flow';
import { Section } from './Section';

function Tile({ title, detail }: { title: string; detail: string }) {
    return (
        <div className="border-line bg-surface-raised flex flex-col gap-1 rounded-lg border p-4">
            <Text as="span" variant="label">
                {title}
            </Text>
            <Text as="span" variant="caption" tone="muted">
                {detail}
            </Text>
        </div>
    );
}

const meta = {
    title: 'Layout/Section',
    component: Section,
    args: {
        title: 'Media catalogs',
        count: 3,
        actions: <Button variant="secondary">Manage catalogs</Button>,
        children: (
            <Grid variant="overview">
                <Tile title="Music" detail="2,418 albums · up to date" />
                <Tile title="Films" detail="612 films · scanning" />
                <Tile title="Series" detail="84 shows · up to date" />
            </Grid>
        ),
    },
    argTypes: { children: { control: false }, actions: { control: false } },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
    args: {
        title: 'Devices',
        count: 4,
        description: 'Every phone, tablet and computer signed in to this server. Revoke one to sign it out.',
        actions: undefined,
    },
};

/** A nested section, one heading level down. */
export const Subsection: Story = {
    args: {
        level: 'h3',
        title: 'Invitations',
        count: undefined,
        actions: (
            <Button variant="secondary" leftIcon={<PlusIcon />}>
                Invite someone
            </Button>
        ),
        children: <Text tone="muted">No invitations are waiting.</Text>,
    },
};
