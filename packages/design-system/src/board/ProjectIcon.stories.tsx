import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProjectIcon } from './ProjectIcon';

const favicon =
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="3" fill="#0ea5e9"/><path d="M4 4h3v8H4zM9 4h3v3H9z" fill="white"/></svg>',
    );

const meta = {
    title: 'Board/ProjectIcon',
    component: ProjectIcon,
    args: { name: 'lar-web', place: 0, size: 'row' },
} satisfies Meta<typeof ProjectIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The toned initial: the colour of the repository's place on the board. */
export const Initial: Story = {};

/** A project the board doesn't list keeps the muted colour. */
export const Unlisted: Story = { args: { place: undefined } };

/** Each of the board's eight repository colours, which repeat after the eighth. */
export const Tones: Story = {
    render: (args) => (
        <span className="flex gap-1">
            {Array.from({ length: 9 }, (_, place) => (
                <ProjectIcon key={place} {...args} name={`repo-${place}`} place={place} />
            ))}
        </span>
    ),
};

/** small, row and medium. */
export const Sizes: Story = {
    render: (args) => (
        <span className="flex items-center gap-2">
            <ProjectIcon {...args} size="small" />
            <ProjectIcon {...args} size="row" />
            <ProjectIcon {...args} size="medium" />
        </span>
    ),
};

/** An emoji or a monogram chosen in T3 takes the square. */
export const EmojiAndMonogram: Story = {
    render: (args) => (
        <span className="flex items-center gap-2">
            <ProjectIcon {...args} size="medium" icon={{ kind: 'emoji', emoji: '🎛️' }} />
            <ProjectIcon {...args} size="medium" icon={{ kind: 'monogram', text: 'LW', color: 'rose' }} />
        </span>
    ),
};

/** A favicon or a lucide icon lies over the initial once it has loaded. */
export const FaviconAndLucide: Story = {
    render: (args) => (
        <span className="flex items-center gap-2">
            <ProjectIcon {...args} size="medium" icon={{ kind: 'favicon', src: favicon }} />
            <ProjectIcon {...args} size="medium" icon={{ kind: 'lucide', name: 'git-branch', color: 'sky' }} />
        </span>
    ),
};

/** A broken favicon or an unknown lucide name leaves the initial. */
export const Fallbacks: Story = {
    render: (args) => (
        <span className="flex items-center gap-2">
            <ProjectIcon {...args} size="medium" icon={{ kind: 'favicon', src: '/missing.png' }} />
            <ProjectIcon {...args} size="medium" icon={{ kind: 'lucide', name: 'not-a-lucide-icon', color: 'sky' }} />
        </span>
    ),
};
