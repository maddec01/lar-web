import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoadingScreen } from './LoadingScreen';

const bar = 27.52;

const meta = {
    title: 'Board/LoadingScreen',
    component: LoadingScreen,
    parameters: { layout: 'fullscreen' },
    args: {
        mark: {
            viewBox: '0 0 100 100',
            block: 'M50.68 0H91.97a8.03 8.03 0 0 1 8.03 8.03V49.32a8.03 8.03 0 0 1-8.03 8.03H50.68a8.03 8.03 0 0 1-8.03-8.03V8.03a8.03 8.03 0 0 1 8.03-8.03z',
            blockColor: '#355292',
            centreLine: `M${bar / 2} 0V${100 - bar / 2}H100`,
            bar,
            l: 'M0 0H27.52V72.48H100V100H3a3 3 0 0 1-3-3z',
        },
        product: 'Factory',
        drawn: false,
        leaving: false,
        line: { id: 0, text: 'Loading Projects' },
        rolled: false,
    },
    decorators: [
        (Story) => (
            <div className="relative h-96 [transform:translateZ(0)]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof LoadingScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The mark draws itself: the block springs in, the L traces around it, then "ar" slides out and "Factory" fades in. */
export const Drawing: Story = {};

/** Opened after the desktop’s starting page drew the mark, it starts finished. */
export const Drawn: Story = { args: { drawn: true } };

/** A new step rolls in as the last rolls out. */
export const StepChange: Story = {
    args: {
        drawn: true,
        line: { id: 2, text: 'Finishing up' },
        leavingLine: { id: 1, text: 'Loading Projects' },
        rolled: true,
    },
};

export const LongStep: Story = {
    args: {
        drawn: true,
        line: { id: 0, text: 'Reading lar-works/lar-factory, lar-works/lar-web and lar-works/lar-server from GitHub' },
    },
};

export const Leaving: Story = { args: { drawn: true, leaving: true } };
