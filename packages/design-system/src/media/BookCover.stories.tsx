import type { Meta, StoryObj } from '@storybook/react-vite';

import { ImageCard } from '../display/ImageCard';
import { BookCover } from './BookCover';

const meta = {
    title: 'Media/BookCover',
    component: BookCover,
    args: {
        alt: 'Cover of The Cartographer’s Daughter',
        title: 'The Cartographer’s Daughter',
        author: 'Helena Marsh',
        seed: 'b83d6bc0-6480-4b4a-ab75-94cb61309c81',
    },
    render: (args) => (
        <div className="w-44">
            <BookCover {...args} />
        </div>
    ),
} satisfies Meta<typeof BookCover>;

export default meta;

type Story = StoryObj<typeof meta>;

/** No cover art: the drawn cover, its tone picked from the book’s id. */
export const Drawn: Story = {};

export const WithCover: Story = {
    args: { src: 'https://picsum.photos/seed/lar-book/400/600' },
};

/** A long title wraps and clamps; a book with no author shows only its title. */
export const LongTitleNoAuthor: Story = {
    args: { title: 'A Field Guide to Quiet Machines and Other Instruments of the Patient Hour', author: undefined },
};

/** A shelf of drawn covers in the catalog grid, each keeping its own tone. */
export const Shelf: Story = {
    render: () => (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
            {[
                ['The Cartographer’s Daughter', 'Helena Marsh'],
                ['A Filha do Cartógrafo', 'Helena Marsh'],
                ['Salt and Signal', 'Owen Achterberg'],
                ['A Field Guide to Quiet Machines', 'Priya Lakhani-Ross'],
                ['Letters from the Winter Orchard', 'Mireille Fontaine'],
                ['Scan 2019-04-11 (untitled)', undefined],
            ].map(([title = '', author]) => (
                <ImageCard
                    key={title}
                    title={title}
                    subtitle={author ?? 'Unknown author'}
                    href="#"
                    artwork={<BookCover alt="" title={title} author={author} seed={title} />}
                />
            ))}
        </div>
    ),
};
