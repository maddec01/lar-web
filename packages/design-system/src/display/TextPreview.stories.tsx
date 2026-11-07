import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

import { Badge } from './Badge';
import { TextPreview } from './TextPreview';

const overview =
    'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.\n\nThe second part of Denis Villeneuve’s adaptation of Frank Herbert’s novel.';

// The loaded variant of the props, so stories' args and controls match it; the loading state has its own story.
type TextPreviewProps = Extract<ComponentProps<typeof TextPreview>, { value: string }>;

const meta = {
    title: 'Display/TextPreview',
    component: TextPreview,
    args: { title: 'Dune: Part Two', moreLabel: 'More', value: overview, language: 'en' },
    decorators: [
        (Story) => (
            <div className="max-w-xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<TextPreviewProps>;

export default meta;

type Story = StoryObj<typeof meta>;

/** One truncated line; "More" opens the full text in a modal. */
export const Default: Story = {};

/** Extra content shown above the full text in the modal. */
export const WithModalContent: Story = {
    args: {
        title: 'Kind of Blue',
        value: 'Recorded in two sessions at Columbia’s 30th Street Studio in New York, in March and April 1959. The musicians were given only sketches of scales and melody lines, and every track but one was recorded in a single take.',
        children: (
            <div className="flex gap-2">
                <Badge>Jazz</Badge>
                <Badge>Modal jazz</Badge>
            </div>
        ),
    },
};

export const Short: Story = { args: { value: 'A short summary that fits.' } };

export const Loading: Story = { render: () => <TextPreview loading /> };
