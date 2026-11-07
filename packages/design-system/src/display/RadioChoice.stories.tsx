import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Text } from '../typography/Typography';
import { Badge } from './Badge';
import { InsetPanel } from './InsetPanel';
import { RadioChoice } from './RadioChoice';

const meta = {
    title: 'Display/RadioChoice',
    component: RadioChoice,
    args: {
        name: 'match',
        checked: false,
        onChange: () => undefined,
        children: (
            <>
                <Text variant="label">Dune: Part Two (2024)</Text>
                <Text variant="caption" tone="muted">
                    Denis Villeneuve · 2h 46m
                </Text>
            </>
        ),
    },
    decorators: [
        (Story) => (
            <div className="max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof RadioChoice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { checked: true } };

export const WithTrailing: Story = { args: { trailing: <Badge tone="success">98% match</Badge> } };

const matches = [
    { id: 'dune-2', title: 'Dune: Part Two (2024)', detail: 'Denis Villeneuve · 2h 46m', score: '98% match' },
    { id: 'dune-1', title: 'Dune (2021)', detail: 'Denis Villeneuve · 2h 35m', score: '71% match' },
    { id: 'dune-84', title: 'Dune (1984)', detail: 'David Lynch · 2h 17m', score: '64% match' },
];

function MatchChoices() {
    const [selected, setSelected] = useState('dune-2');

    return (
        <InsetPanel presentation="settings">
            {matches.map((match) => (
                <RadioChoice
                    key={match.id}
                    name="movie-match"
                    checked={selected === match.id}
                    onChange={() => setSelected(match.id)}
                    trailing={<Badge>{match.score}</Badge>}
                >
                    <Text variant="label">{match.title}</Text>
                    <Text variant="caption" tone="muted">
                        {match.detail}
                    </Text>
                </RadioChoice>
            ))}
        </InsetPanel>
    );
}

/** A group of choices inside a settings panel, as when matching a file to a movie. */
export const Group: Story = { render: () => <MatchChoices /> };

/** A long title truncates rather than pushing the row wider, as Lar Factory's onboarding lists the T3 projects to add;
 *  `data-choice` names each row's value. */
export const LongTitles: Story = {
    render: () => (
        <div className="max-w-md">
            <InsetPanel presentation="settings">
                <RadioChoice name="t3-project" checked onChange={() => undefined} data-choice="web">
                    <span className="block truncate">web · ~/Developer/web</span>
                </RadioChoice>
                <RadioChoice name="t3-project" checked={false} onChange={() => undefined} data-choice="long">
                    <span className="block truncate">
                        a-project-whose-name-is-long-enough-to-truncate · ~/Developer/clients/acme/a-project
                    </span>
                </RadioChoice>
            </InsetPanel>
        </div>
    ),
};
