import type { Meta, StoryObj } from '@storybook/react-vite';

import { Diagram } from './Diagram';

const source = 'flowchart LR\n  brief --> build --> review --> ship';

/** A stand-in for a diagram library: three boxes joined by arrows. */
const drawBoxes = async (text: string) => {
    const steps = text.split('-->').map((step) => step.replace(/^flowchart LR\s*/, '').trim());

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${steps.length * 120} 48" width="${steps.length * 120}" height="48">${steps
        .map(
            (step, index) =>
                `<rect x="${index * 120 + 4}" y="8" width="96" height="32" rx="6" fill="none" stroke="currentColor"/><text x="${index * 120 + 52}" y="29" text-anchor="middle" font-size="12" fill="currentColor">${step}</text>`,
        )
        .join('')}</svg>`;
};

const meta = {
    title: 'Display/Diagram',
    component: Diagram,
    args: {
        source,
        draw: drawBoxes,
        label: 'Concept map diagram',
        failedLabel: 'The diagram could not be drawn. Its source is available below.',
        sourceLabel: 'Diagram source',
    },
} satisfies Meta<typeof Diagram>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Drawn: Story = {};

export const Failed: Story = { args: { draw: () => Promise.reject(new Error('Parse error on line 2')) } };
