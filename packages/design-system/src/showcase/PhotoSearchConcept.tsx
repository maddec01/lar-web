import { SearchIcon } from 'lucide-react';

export interface ConceptPhoto {
    src: string;
    alt: string;
    /** Whether the photo matches the search shown above the grid. */
    match: boolean;
}

/** An illustration, not a screenshot: a search over your own photo library, with the matches lit. Its label says
 *  it is a concept. */
export function PhotoSearchConcept({
    query,
    photos,
    label,
}: {
    query: string;
    photos: readonly ConceptPhoto[];
    label: string;
}) {
    return (
        <figure className="flex flex-col gap-3">
            <div className="border-base-300 bg-base-100/80 text-base-content dark:bg-base-200/70 [&>svg]:text-base-600 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm [&>svg]:size-4">
                <SearchIcon />
                <span className="truncate">{query}</span>
            </div>
            <ul className="grid grid-cols-3 gap-1.5">
                {photos.map((photo) => (
                    <li key={photo.src} className="relative overflow-hidden rounded-md">
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            loading="lazy"
                            width={320}
                            height={320}
                            className={`aspect-square w-full object-cover transition-opacity ${photo.match ? '' : 'opacity-35'}`}
                        />
                        {photo.match ? (
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 rounded-md ring-2 ring-white/80 ring-inset"
                            />
                        ) : null}
                    </li>
                ))}
            </ul>
            <figcaption className="text-base-700 text-xs">{label}</figcaption>
        </figure>
    );
}
