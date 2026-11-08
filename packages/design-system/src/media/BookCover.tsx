import { Artwork } from './Artwork';

const tones = [
    'bg-book-cover-1',
    'bg-book-cover-2',
    'bg-book-cover-3',
    'bg-book-cover-4',
    'bg-book-cover-5',
    'bg-book-cover-6',
] as const;

interface BookCoverProps {
    /** Names the image; a drawn cover is read by its title and author instead. */
    alt: string;
    /** The book's title, set on the drawn cover and naming the image. */
    title: string;
    /** The first author, set small under the title of a drawn cover. */
    author?: string;
    /** Picks the drawn cover's tone, usually the book's id, so a book keeps its colour. */
    seed: string;
    /** The cover image's address; none draws a cover. */
    src?: string;
    /** The server is still fetching the cover. */
    pending?: boolean;
    /** The cover failed to load: a drawn cover takes its place. */
    error?: boolean;
}

/**
 * A book's cover at 2:3. The image when there is one; otherwise a drawn cover, its title and author set on a quiet cloth
 * tone, so a shelf without art still reads as books rather than as a row of placeholders.
 */
export function BookCover({ alt, title, author, seed, src, pending, error }: BookCoverProps) {
    if (src && !error) return <Artwork alt={alt} aspect="poster" src={src} pending={pending} />;

    return (
        <div
            role="img"
            aria-label={author ? `${title}, ${author}` : title}
            className={`${tones[hash(seed) % tones.length]} text-book-cover-ink @container relative flex aspect-[2/3] flex-col overflow-hidden rounded-lg p-[9%]`}
        >
            {/* A ruled frame inset from the edge, as on a cloth binding. */}
            <span aria-hidden="true" className="border-book-cover-ink/25 absolute inset-[5%] rounded-sm border" />
            <span
                aria-hidden="true"
                className="tracking-heading line-clamp-5 pt-[8%] text-[length:11cqw] leading-[1.15] font-semibold text-balance wrap-break-word"
            >
                {title}
            </span>
            {author ? (
                <span
                    aria-hidden="true"
                    className="tracking-caps mt-auto line-clamp-2 text-[length:7.5cqw] leading-tight uppercase opacity-80"
                >
                    {author}
                </span>
            ) : null}
        </div>
    );
}

function hash(value: string): number {
    let result = 0;

    for (const character of value) result = (result * 31 + character.charCodeAt(0)) >>> 0;

    return result;
}
