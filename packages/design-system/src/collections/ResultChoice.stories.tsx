import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Alert } from '../feedback/Alert';
import { Link } from '../typography/Link';
import { Text } from '../typography/Typography';
import { ResultChoice } from './ResultChoice';
import { ResultList } from './ResultList';

const meta = {
    title: 'Collections/ResultChoice',
    component: ResultChoice,
    args: { name: 'match', checked: true, onChange: fn(), children: 'Kind of Blue · Miles Davis · 1959' },
    render: (args) => (
        <ResultList label="Release matches" presentation="choice">
            <ResultChoice {...args} />
        </ResultList>
    ),
} satisfies Meta<typeof ResultChoice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDetail: Story = {
    args: {
        detail: (
            <Alert size="sm" tone="warning" message="The track count differs. Compare the edition before continuing." />
        ),
        trailing: (
            <Link href="https://musicbrainz.org" external aria-label="Compare Kind of Blue on MusicBrainz">
                MusicBrainz
            </Link>
        ),
    },
};
export const LongName: Story = {
    args: {
        children:
            'The Complete Columbia Studio Recordings of the Miles Davis Quintet, 1965–1968 · Six-disc European reissue',
        detail: (
            <Text variant="caption" tone="muted">
                Six discs · 56 tracks · Columbia · Europe · 1998
            </Text>
        ),
    },
};

function MatchPicker() {
    const [chosen, setChosen] = useState('original');

    return (
        <div className="flex max-w-xl flex-col gap-4">
            <ResultList label="Release matches" presentation="choice">
                {['original', 'reissue'].map((id) => (
                    <ResultChoice
                        key={id}
                        name="release-match"
                        checked={chosen === id}
                        onChange={() => setChosen(id)}
                        trailing={
                            <Link
                                href="https://musicbrainz.org"
                                external
                                aria-label={`Compare the ${id} on MusicBrainz`}
                            >
                                MusicBrainz
                            </Link>
                        }
                        detail={
                            chosen === id ? (
                                <Text variant="caption" tone="muted">
                                    {id === 'original'
                                        ? 'Matches the title, artist and all five tracks.'
                                        : 'One bonus track has no file. Compare this edition before continuing.'}
                                </Text>
                            ) : undefined
                        }
                    >
                        <Text as="span" variant="label">
                            Kind of Blue
                        </Text>
                        <Text variant="caption" tone="muted">
                            Miles Davis ·{' '}
                            {id === 'original' ? '1959 · Columbia · 5 tracks' : '1997 · Legacy · 6 tracks'}
                        </Text>
                    </ResultChoice>
                ))}
            </ResultList>
            <div className="flex justify-end">
                <Button>Review changes</Button>
            </div>
        </div>
    );
}

/** Native radio rows and optional details share one footer action, regardless of metadata provider. */
export const Picker: Story = { render: () => <MatchPicker /> };
export const Disabled: Story = {
    render: (args) => (
        <ResultList label="Release matches" presentation="choice" disabled>
            <ResultChoice {...args} />
        </ResultList>
    ),
};
