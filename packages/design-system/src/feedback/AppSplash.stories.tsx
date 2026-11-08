import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { AppSplash } from './AppSplash';

/** The boot screen every Lar app shows until it is ready: the lockup, a status line and a calm progress track. */
const meta = {
    title: 'Feedback/AppSplash',
    component: AppSplash,
    parameters: { layout: 'fullscreen' },
    args: { label: 'Lar Server', product: 'Server', status: 'Connecting to the server…', drawn: true },
    decorators: [
        (Story) => (
            <div className="relative h-96 [transform:translateZ(0)]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AppSplash>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The one contract in every app: the status line, ending in an ellipsis, over the calm indeterminate track. */
export const Status: Story = {};

/** While how far is unknown, a short segment drifts slowly along the track (still under reduced motion). */
export const Indeterminate: Story = { args: { progress: 'indeterminate' } };

/** A known fraction fills the track. */
export const Determinate: Story = { args: { status: 'Loading your catalogs…', progress: 0.6 } };

/** The mark draws itself on a cold start. */
export const Drawing: Story = { args: { drawn: false, progress: 'indeterminate' } };

/** Lar Factory’s board shows the same splash: its "Loading projects" reads "Loading projects…" over the same track. */
export const Factory: Story = { args: { label: 'Lar Factory', product: 'Factory', status: 'Loading projects' } };

/** In a desktop app’s frameless window: the title bar’s height stays clear on top, and dragging the splash moves the
 *  window. The browser default (the server’s web app) has neither. */
export const DesktopChrome: Story = {
    args: { label: 'Lar Factory', product: 'Factory', status: 'Loading projects', chrome: 'desktop' },
};

function Steps() {
    const [step, setStep] = useState(0);
    const steps = ['Connecting to the server…', 'Signing you in…', 'Loading your catalogs…'];

    useEffect(() => {
        const timer = setInterval(() => setStep((now) => (now + 1) % steps.length), 1600);

        return () => clearInterval(timer);
    }, [steps.length]);

    return <AppSplash label="Lar Server" product="Server" drawn status={steps[step]!} progress="indeterminate" />;
}

/** Each new status rolls in as the last rolls out. */
export const StepChanges: Story = { render: () => <Steps /> };

/** A long status wraps under the lockup. */
export const LongStatus: Story = {
    args: {
        status: 'The server is taking longer than usual to answer. Lar keeps trying; check that the server is running.',
        progress: 'indeterminate',
    },
};
