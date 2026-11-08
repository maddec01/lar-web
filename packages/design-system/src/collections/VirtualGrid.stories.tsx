import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';
import { VirtualGrid } from './VirtualGrid';

const owners = ['Ana Silva', 'Jon Park', 'Maya Ortiz', 'Sam Lee', 'Priya Rao', 'Tomás Reis', 'Leah Cohen'];

const projects = Array.from({ length: 600 }, (_, index) => ({
    id: `project-${index}`,
    title: index === 7 ? 'A very long project name that runs well past the width of its card' : `Project ${index + 1}`,
    owner: owners[index % owners.length]!,
    hue: (index * 37) % 360,
}));

/** A grid's card: a tinted cover over its title and owner. */
function ProjectCard({ index, aspect = 'square' }: { index: number; aspect?: 'square' | 'poster' }) {
    const project = projects[index]!;

    return (
        <Stack space="related">
            <div
                aria-hidden="true"
                className={`w-full rounded-lg ${aspect === 'poster' ? 'aspect-[2/3]' : 'aspect-square'}`}
                style={{
                    background: `linear-gradient(135deg, hsl(${project.hue} 60% 55%), hsl(${project.hue + 50} 60% 25%))`,
                }}
            />
            <Text variant="label" truncate>
                {project.title}
            </Text>
            <Text tone="muted">{project.owner}</Text>
        </Stack>
    );
}

/**
 * Virtualized against the window’s scroll, not a scroll container of its own, so it sits directly in the page:
 * scroll the canvas to load more rows.
 */
const meta = {
    title: 'Collections/VirtualGrid',
    component: VirtualGrid,
    args: {
        count: projects.length,
        label: 'Projects',
        itemKey: (index) => projects[index]!.id,
        renderItem: (index) => <ProjectCard index={index} />,
        onRangeChange: fn(),
    },
    decorators: [
        (Story) => (
            <div className="max-w-5xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof VirtualGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Portrait: Story = {
    args: { aspect: 'poster', renderItem: (index) => <ProjectCard index={index} aspect="poster" /> },
};

/** Pages that haven’t arrived yet render placeholders in their slots. */
export const Loading: Story = {
    args: {
        loading: true,
        renderItem: (index) =>
            index < 12 ? <ProjectCard index={index} /> : <SkeletonLoader.Shape presentation="artwork" />,
    },
};

export const FewItems: Story = { args: { count: 3 } };
