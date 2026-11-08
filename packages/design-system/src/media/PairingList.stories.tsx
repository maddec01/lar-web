import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select, SelectItem } from '../forms/Select';
import { PairingList } from './PairingList';

const files = [
    '01 Airbag.flac',
    '02 Paranoid Android.flac',
    '03 Subterranean Homesick Alien.flac',
    '04 Exit Music.flac',
];

const fileSelect = (track: string, value?: string) => (
    <Select aria-label={`File for ${track}`} placeholder="Choose a file" defaultValue={value}>
        {files.map((file) => (
            <SelectItem key={file} value={file}>
                {file}
            </SelectItem>
        ))}
    </Select>
);

const meta = {
    title: 'Media/PairingList',
    component: PairingList,
    args: {
        label: 'Tracks and files',
        items: [
            { key: '1', position: '1', title: 'Airbag', detail: '4:44', control: fileSelect('Airbag', files[0]) },
            {
                key: '2',
                position: '2',
                title: 'Paranoid Android',
                detail: '6:23',
                control: fileSelect('Paranoid Android', files[1]),
            },
            {
                key: '3',
                position: '3',
                title: 'Subterranean Homesick Alien',
                detail: '4:27',
                note: 'Matched by title only; the durations differ by 9 seconds',
                noteTone: 'warning',
                control: fileSelect('Subterranean Homesick Alien', files[2]),
            },
            {
                key: '4',
                position: '4',
                title: 'Exit Music (For a Film)',
                detail: '4:24',
                note: 'No file chosen',
                control: fileSelect('Exit Music (For a Film)'),
            },
        ],
    },
} satisfies Meta<typeof PairingList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Disc-and-track positions and long titles. */
export const MultiDisc: Story = {
    args: {
        items: [
            {
                key: '2-05',
                position: '2-05',
                title: 'Shine On You Crazy Diamond (Parts VI–IX) [2011 Remastered Version, Immersion Box Set]',
                detail: '12:31',
                note: 'From /mnt/media/music/Pink Floyd/Wish You Were Here (Immersion)/Disc 2',
                control: fileSelect('Shine On You Crazy Diamond'),
            },
        ],
    },
};
