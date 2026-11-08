import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterIcon } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { fn, userEvent, within } from 'storybook/test';

import { type DrilldownBrowseGroup, DrilldownBrowseSelector } from './DrilldownBrowseSelector';

const genres = [
    'Afrobeat',
    'Ambient',
    'Baïonarena',
    'Blues',
    'Bossa nova',
    'Classical',
    'Electronic',
    'Fado',
    'Folk',
    'Funk',
    'Hip hop',
    'Jazz',
    'Krautrock',
    'Música popular brasileira',
    'Post-rock',
    'Reggae',
    'Soul',
].map((label) => ({ id: label.toLowerCase().replace(/\W+/g, '-'), label }));

const labels = ['Blue Note', 'ECM', 'Impulse!', 'Nonesuch', 'Warp', 'XL Recordings'].map((label) => ({
    id: label.toLowerCase().replace(/\W+/g, '-'),
    label,
}));

const types = [
    { id: 'albums', label: 'Albums' },
    { id: 'eps', label: 'EPs' },
    { id: 'live', label: 'Live albums' },
    { id: 'compilations', label: 'Compilations' },
];

type Selection = Record<'genres' | 'labels' | 'types', string | undefined>;

function DrilldownDemo({
    initial,
    loadingGenres = false,
    ...args
}: Omit<ComponentProps<typeof DrilldownBrowseSelector>, 'groups' | 'label' | 'onClear'> & {
    initial?: Partial<Selection>;
    loadingGenres?: boolean;
}) {
    const [selection, setSelection] = useState<Selection>({
        genres: undefined,
        labels: undefined,
        types: undefined,
        ...initial,
    });
    const groups: DrilldownBrowseGroup[] = [
        {
            id: 'genres',
            label: 'Genres',
            allLabel: 'All genres',
            items: loadingGenres ? [] : genres,
            loading: loadingGenres,
            loadingLabel: 'Loading genres…',
            noResultsLabel: 'Nothing matches',
            clearSearchLabel: 'Clear search',
            searchLabel: 'Search genres',
            selectedId: selection.genres,
            onChange: (id) => setSelection((current) => ({ ...current, genres: id })),
        },
        {
            id: 'labels',
            label: 'Record labels',
            allLabel: 'All record labels',
            items: labels,
            loading: false,
            loadingLabel: 'Loading record labels…',
            noResultsLabel: 'Nothing matches',
            clearSearchLabel: 'Clear search',
            searchLabel: 'Search record labels',
            selectedId: selection.labels,
            onChange: (id) => setSelection((current) => ({ ...current, labels: id })),
        },
        {
            id: 'types',
            label: 'Types',
            allLabel: 'All types',
            items: types,
            loading: false,
            loadingLabel: 'Loading types…',
            noResultsLabel: 'Nothing matches',
            clearSearchLabel: 'Clear search',
            selectedId: selection.types,
            onChange: (id) => setSelection((current) => ({ ...current, types: id })),
        },
    ];
    const selected = groups
        .map((group) => group.items.find((item) => item.id === group.selectedId)?.label)
        .filter(Boolean);

    return (
        <div className="h-96">
            <DrilldownBrowseSelector
                {...args}
                groups={groups}
                label={selected.length ? selected.join(', ') : args.allLabel}
                onClear={() => setSelection({ genres: undefined, labels: undefined, types: undefined })}
            />
        </div>
    );
}

const meta = {
    title: 'Navigation/DrilldownBrowseSelector',
    component: DrilldownBrowseSelector,
    args: {
        allLabel: 'All albums',
        backLabel: 'Back',
        label: 'All albums',
        groups: [],
        onClear: fn(),
    },
    render: ({ groups: _groups, label: _label, onClear: _onClear, ...args }) => <DrilldownDemo {...args} />,
} satisfies Meta<typeof DrilldownBrowseSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Opened, to show the menu of groups. */
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await userEvent.click(within(canvasElement).getByRole('button', { name: 'All albums' }));
    },
};

export const WithIconAndDisabledOption: Story = {
    args: { icon: <FilterIcon />, disabledOptionLabel: 'Unmatched' },
};

export const WithSelection: Story = {
    render: ({ groups: _groups, label: _label, onClear: _onClear, ...args }) => (
        <DrilldownDemo {...args} initial={{ genres: 'jazz', labels: 'blue-note' }} />
    ),
};

export const LoadingGroup: Story = {
    render: ({ groups: _groups, label: _label, onClear: _onClear, ...args }) => (
        <DrilldownDemo {...args} loadingGenres />
    ),
};
