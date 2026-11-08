import { TooltipEngine } from '@ninna-ui/react-internal';
import {
    BookOpenIcon,
    CheckIcon,
    Disc3Icon,
    EllipsisIcon,
    FilmIcon,
    ImageIcon,
    TvIcon,
    UploadIcon,
    UserIcon,
} from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Count } from '../display/Count';
import { Loading } from '../feedback/Loading';
import { tabbable } from '../foundations/KeyboardFocus';
import { DropdownMenu } from '../overlays/DropdownMenu';
import { Tooltip, TooltipPopup } from '../overlays/Tooltip';
import { scrollFadeClassName, useScrollFade } from '../overlays/useScrollFade';
import { TextBase } from '../typography/Typography';
import { Artwork } from './Artwork';

/** A header action: its label, what it does, and whether it can now. */
export interface ImagePickerAction {
    /** The action's label, such as "Use automatic" or "Remove". */
    label: string;
    /** Called when the reader picks it. */
    onAction: () => void;
    /** Can't be picked now, such as while saving, or when it is already the staged change. */
    disabled?: boolean | undefined;
}

/**
 * The one header every image picker (an album's cover, a movie's poster, an artist's background) has, so they read
 * alike: a `notice` first, then one toolbar row that never wraps under its title, the `description` under it, and the
 * staged change last.
 *
 * - `notice` is the alert rule: one compact info Alert, only when the change reaches beyond this item, such as metadata
 *   shared by every catalog that holds the album ("Changes here apply in Music and Vinyl Rips"). Never a second one.
 * - The row: the title with its count (and a spinner while images load) at the start; at the end (under the title
 *   only where the pane is too narrow for both, as on a phone) the ways to add an image (`upload`: an ImageUpload, and an app's URL button beside it) and a ⋯ menu (`actionsLabel`) holding
 *   `automatic` ("Use automatic": let Lar pick again) and `remove` ("Remove": no image). Offer each one the item
 *   supports; a picker doesn't drop one another picker shows for the same situation. The row is the same whether or
 *   not a change is staged.
 * - `description` is the one place for what the images are and where they come from, in a sentence.
 * - `pending` says what is staged and that it isn't saved yet ("folder.jpg · Not saved yet"), with `undo` at its end.
 */
export function ImagePickerHeader({
    title,
    count,
    countLabel,
    loading = false,
    loadingLabel,
    description,
    notice,
    undo,
    automatic,
    remove,
    actionsLabel,
    upload,
    pending,
}: {
    /** What the choices are, such as "Available images". */
    title: string;
    /** How many choices there are; none while there are none. */
    count?: number | undefined;
    /** The count in words for screen readers, such as "8 images". */
    countLabel?: string | undefined;
    /** Images are still being looked up: a spinner after the title. */
    loading?: boolean;
    /** Names the spinner for screen readers, such as "Looking for images". */
    loadingLabel?: string | undefined;
    /** What the images are and where they come from, in a sentence. */
    description?: ReactNode;
    /** The one notice above the header, only when the change reaches beyond this item: a compact info Alert. */
    notice?: ReactNode;
    /** Drops the staged change: a quiet button at the end of the `pending` line. */
    undo?: ImagePickerAction | undefined;
    /** Lets Lar pick the image again: "Use automatic", in the ⋯ menu. */
    automatic?: ImagePickerAction | undefined;
    /** Shows no image: "Remove", in the ⋯ menu. */
    remove?: ImagePickerAction | undefined;
    /** Names the ⋯ menu holding `automatic` and `remove`, such as "More image actions". */
    actionsLabel: string;
    /** The ways to add an image: an ImageUpload, and an app's URL button beside it. */
    upload?: ReactNode;
    /** The staged change: what it is ("folder.jpg") and that it isn't saved ("Not saved yet"). */
    pending?: { label: string; detail: string } | undefined;
}) {
    const actions = [automatic, remove].filter((action): action is ImagePickerAction => Boolean(action));

    return (
        <div data-slot="image-picker-header" className="flex flex-col gap-2">
            {notice}
            {/* The row is the same staged or not; only a narrow pane (a phone) puts the buttons under the title. */}
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="flex max-w-full min-w-0 items-center gap-2">
                    <TextBase as="p" variant="label" truncate>
                        {title}
                    </TextBase>
                    <Count count={count || undefined} label={countLabel} loading={loading} />
                    {loading ? <Loading label={loadingLabel} /> : null}
                </div>
                {actions.length || upload ? (
                    <div className="ml-auto flex max-w-full shrink-0 items-center gap-2">
                        {upload}
                        {actions.length ? (
                            <DropdownMenu>
                                <DropdownMenu.Trigger asChild>
                                    <IconButton
                                        icon={<EllipsisIcon />}
                                        aria-label={actionsLabel}
                                        title={actionsLabel}
                                    />
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content align="end">
                                    {actions.map((action) => (
                                        <DropdownMenu.Item
                                            key={action.label}
                                            disabled={action.disabled}
                                            onSelect={action.onAction}
                                        >
                                            {action.label}
                                        </DropdownMenu.Item>
                                    ))}
                                </DropdownMenu.Content>
                            </DropdownMenu>
                        ) : null}
                    </div>
                ) : null}
            </div>
            {description ? (
                <TextBase as="p" variant="caption" tone="muted">
                    {description}
                </TextBase>
            ) : null}
            {pending ? (
                <p className="m-0 flex min-h-6 flex-wrap items-center gap-x-2 text-xs">
                    <span className="text-fg font-medium">{pending.label}</span>
                    <span className="text-fg-muted">{pending.detail}</span>
                    {undo ? (
                        <Button
                            type="button"
                            variant="quiet"
                            size="sm"
                            disabled={undo.disabled}
                            onClick={undo.onAction}
                        >
                            {undo.label}
                        </Button>
                    ) : null}
                </p>
            ) : null}
        </div>
    );
}

export function ImagePicker({
    label,
    header,
    children,
}: {
    /** Names the picker for screen readers, such as "Artwork". */
    label: string;
    /** What sits above the choices: an ImagePickerHeader, the same in every picker. */
    header: ReactNode;
    /** The choices, in ImagePickerGrids. */
    children: ReactNode;
}) {
    const { setViewport: fadeRef } = useScrollFade();

    return (
        <section aria-label={label} className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="shrink-0">{header}</div>
            <div
                ref={fadeRef}
                className={`-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain p-1 ${scrollFadeClassName}`}
            >
                {children}
            </div>
        </section>
    );
}

export function ImagePickerGrid({
    children,
    label,
}: {
    /** The grid's ImagePickerOptions. */
    children: ReactNode;
    /** The grid's heading, such as a provider's name. */
    label: string;
}) {
    return (
        <div
            role="group"
            aria-label={label}
            className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))]"
        >
            {children}
        </div>
    );
}

export function ImagePickerOption({
    src,
    pending,
    error,
    label,
    detail,
    year,
    kind,
    errorLabel,
    selected,
    disabled,
    landscape = false,
    aspect,
    onSelect,
}: {
    /** The image's address. */
    src?: string;
    /** The server is still fetching the image. */
    pending?: boolean;
    /** The image failed to load. */
    error?: boolean;
    /** The option's name, such as its source. */
    label: string;
    /** A line under the label, such as the image's size. */
    detail?: string;
    /** Release year, kept on its own line beneath the candidate title. */
    year?: string | number;
    /** The content kind chooses a meaningful placeholder when artwork is missing. */
    kind?: 'music' | 'movie' | 'tv' | 'photo' | 'book' | 'person';
    /** What the option says when the image failed. */
    errorLabel: string;
    /** The image in use now. */
    selected: boolean;
    /** Can't be chosen, such as while a choice saves. */
    disabled?: boolean;
    /** A wide image, drawn at 16:9 when no `aspect` says otherwise. */
    landscape?: boolean;
    /** The image's shape: `square`, `video`, `poster` or `logo`. */
    aspect?: 'square' | 'video' | 'poster' | 'logo';
    /** Called as the reader chooses the image. */
    onSelect: () => void;
}) {
    const Placeholder = kind
        ? { music: Disc3Icon, movie: FilmIcon, tv: TvIcon, photo: ImageIcon, book: BookOpenIcon, person: UserIcon }[
              kind
          ]
        : aspect === 'poster' || aspect === 'video' || landscape
          ? FilmIcon
          : ImageIcon;

    return (
        <Tooltip>
            {/* Keep the native button mounted as disabled changes, preserving its preview and focus state. */}
            <TooltipEngine.Trigger asChild>
                <button
                    {...tabbable}
                    type="button"
                    aria-pressed={selected}
                    title={label}
                    disabled={disabled}
                    onClick={onSelect}
                    className={`group bg-surface-raised focus-ring relative overflow-hidden rounded-lg border pb-2 text-left transition-all disabled:cursor-default disabled:opacity-50 ${selected ? 'border-primary ring-primary-ring ring-2' : 'border-line hover:border-primary-edge hover:shadow-(--shadow-raised)'}`}
                >
                    <Artwork
                        alt=""
                        aspect={aspect ?? (landscape ? 'video' : 'square')}
                        error={error}
                        errorLabel={errorLabel}
                        fallback={<Placeholder />}
                        pending={pending}
                        referrerPolicy="no-referrer"
                        showLoadingIndicator={false}
                        src={src}
                    />
                    {/* The selection mark sits in the caption, beside the name, never on the artwork: a shallow title
                        logo or a poster's corner is part of what the reader is choosing between. */}
                    <span className="flex items-start gap-2 px-3 pt-2">
                        <span className="min-w-0 flex-1 truncate text-xs font-medium">{label}</span>
                        {selected ? (
                            <span
                                aria-hidden="true"
                                data-slot="selection-mark"
                                className="bg-primary text-primary-content mt-px flex shrink-0 rounded-full p-0.5 [&>svg]:size-3"
                            >
                                <CheckIcon />
                            </span>
                        ) : null}
                    </span>{' '}
                    {year != null ? <span className="text-fg-muted block px-3 pb-2 text-xs">{year}</span> : null}
                    {detail ? <span className="text-fg-muted block truncate px-3 pb-2 text-xs">{detail}</span> : null}
                </button>
            </TooltipEngine.Trigger>
            <TooltipPopup>{label}</TooltipPopup>
        </Tooltip>
    );
}

export function ImageUpload({
    label,
    hint,
    disabled,
    onFile,
}: {
    /** The drop zone's text, such as "Upload an image". */
    label: string;
    /** A line under it, such as the formats it accepts. */
    hint: string;
    /** Can't take a file, such as while one uploads. */
    disabled?: boolean;
    /** Called with the file the reader drops or picks. */
    onFile: (file: File) => void;
}) {
    const [dragging, setDragging] = useState(false);
    const input = useRef<HTMLInputElement>(null);

    return (
        <span
            className={`inline-flex shrink-0 rounded-md whitespace-nowrap ${dragging ? 'ring-primary ring-2' : ''}`}
            onDragOver={(event) => {
                event.preventDefault();

                if (!disabled) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
                event.preventDefault();
                setDragging(false);

                const file = event.dataTransfer.files[0];

                if (file && !disabled) onFile(file);
            }}
        >
            <input
                ref={input}
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp,image/gif"
                aria-label={label}
                disabled={disabled}
                onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) onFile(file);

                    event.target.value = '';
                }}
            />
            <Button
                type="button"
                disabled={disabled}
                title={hint}
                aria-description={hint}
                leftIcon={<UploadIcon />}
                onClick={() => input.current?.click()}
                variant="secondary"
            >
                {label}
            </Button>
        </span>
    );
}
