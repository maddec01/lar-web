import type { Meta, StoryObj } from '@storybook/react-vite';
import { CompassIcon, LockIcon, RotateCwIcon, ServerCrashIcon, TriangleAlertIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { CodeBlock } from '../display/CodeBlock';
import { Disclosure } from '../forms/FormSection';
import { PageError } from './PageError';

const meta = {
    title: 'Feedback/PageError',
    component: PageError,
    args: {
        size: 'page',
        tone: 'danger',
        icon: <ServerCrashIcon />,
        title: 'Couldn’t load movies',
        description: 'The server didn’t respond. Check that Lar Server is running, then try again.',
        primaryAction: { label: 'Try again', icon: <RotateCwIcon />, onAction: fn() },
    },
} satisfies Meta<typeof PageError>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A region that failed to load, with a retry. */
export const LoadFailed: Story = {};

export const Retrying: Story = {
    args: { primaryAction: { label: 'Try again', icon: <RotateCwIcon />, onAction: fn(), busy: true } },
};

/** A page that doesn’t exist: it owns the page, says so plainly and leads home. */
export const NotFound: Story = {
    args: {
        size: 'hero',
        tone: 'neutral',
        code: '404',
        icon: <CompassIcon />,
        title: 'This page isn’t here',
        description: 'The address may have changed, or the item was removed from this server.',
        primaryAction: { label: 'Go to the dashboard', href: '/' },
        secondaryAction: { label: 'Go back', onAction: fn() },
    },
};

export const NoPermission: Story = {
    args: {
        tone: 'neutral',
        code: '403',
        icon: <LockIcon />,
        title: 'You can’t open this catalog',
        description: 'Ask the server’s owner to share “Family photos” with you.',
        primaryAction: { label: 'Back to catalogs', href: '/' },
    },
};

/** Technical details stay out of the way under the actions. */
export const WithDetails: Story = {
    args: {
        footer: (
            <Disclosure label="Technical details">
                <CodeBlock value="GET /api/catalogs/movies → 503 Service Unavailable" />
            </Disclosure>
        ),
    },
};

export const Panel: Story = {
    args: {
        size: 'panel',
        icon: <TriangleAlertIcon />,
        title: 'Couldn’t load activity',
        description: 'The connection to the server was lost.',
    },
};

export const Inline: Story = {
    args: {
        size: 'inline',
        tone: 'warning',
        icon: <TriangleAlertIcon />,
        title: 'Match failed',
        description: 'No release on MusicBrainz matches these tracks.',
        primaryAction: { label: 'Search again', onAction: fn() },
    },
    decorators: [
        (Story) => (
            <div className="border-line bg-surface-raised max-w-xs rounded-lg border">
                <Story />
            </div>
        ),
    ],
};
