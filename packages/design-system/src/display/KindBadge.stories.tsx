import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpenIcon, BugIcon, FilmIcon, LightbulbIcon, MusicIcon, SparklesIcon, TrendingUpIcon } from 'lucide-react';

import { KindBadge } from './KindBadge';

const meta = {
    title: 'Display/KindBadge',
    component: KindBadge,
    args: {
        hue: 25,
        children: (
            <>
                <BugIcon />
                Bug
            </>
        ),
    },
} satisfies Meta<typeof KindBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Without a hue the badge is neutral, like a kind that has no colour of its own. */
export const Neutral: Story = { args: { hue: undefined, children: 'Chore' } };

export const Medium: Story = { args: { size: 'md' } };

/** Listed but switched off, such as a disabled catalog’s kind. */
export const Muted: Story = { args: { hue: 22, muted: true, children: 'Music' } };

/** Lar Factory’s item kinds and Lar Server’s catalog kinds side by side, for comparing hues in light and dark. */
export const Kinds: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                {[
                    { hue: 25, label: 'Bug', icon: <BugIcon /> },
                    { hue: 150, label: 'Feature', icon: <SparklesIcon /> },
                    { hue: 245, label: 'Improvement', icon: <TrendingUpIcon /> },
                    { hue: 300, label: 'Concept', icon: <LightbulbIcon /> },
                ].map(({ hue, label, icon }) => (
                    <KindBadge key={label} hue={hue}>
                        {icon}
                        {label}
                    </KindBadge>
                ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {[
                    { hue: 22, label: 'Music', icon: <MusicIcon /> },
                    { hue: 300, label: 'Video', icon: <FilmIcon /> },
                    { hue: 55, label: 'Books', icon: <BookOpenIcon /> },
                ].map(({ hue, label, icon }) => (
                    <KindBadge key={label} hue={hue}>
                        {icon}
                        {label}
                    </KindBadge>
                ))}
            </div>
        </div>
    ),
};
