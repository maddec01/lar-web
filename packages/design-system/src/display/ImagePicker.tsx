import { CheckIcon, Disc3Icon } from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';

import { Button } from '../actions/Button';
import { tabbable } from '../foundations/KeyboardFocus';
import { Artwork } from './Artwork';

export function ImagePicker({ label, header, children }: { label: string; header: ReactNode; children: ReactNode }) {
    return (
        <section aria-label={label} className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="shrink-0">{header}</div>
            <div className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain p-1">{children}</div>
        </section>
    );
}

export function ImagePickerGrid({ children, label }: { children: ReactNode; label: string }) {
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
    errorLabel,
    selected,
    disabled,
    landscape = false,
    aspect,
    onSelect,
}: {
    src?: string;
    pending?: boolean;
    error?: boolean;
    label: string;
    detail?: string;
    errorLabel: string;
    selected: boolean;
    disabled?: boolean;
    landscape?: boolean;
    aspect?: 'square' | 'video' | 'poster' | 'logo';
    onSelect: () => void;
}) {
    return (
        <button
            {...tabbable}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            disabled={disabled}
            onClick={onSelect}
            className={`group bg-base-100 focus-visible:outline-primary relative overflow-hidden rounded-lg border text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-50 ${selected ? 'border-primary ring-primary/20 ring-2' : 'border-base-300 hover:border-primary/50 hover:shadow-md'}`}
        >
            <Artwork
                alt=""
                aspect={aspect ?? (landscape ? 'video' : 'square')}
                error={error}
                errorLabel={errorLabel}
                fallback={<Disc3Icon />}
                pending={pending}
                referrerPolicy="no-referrer"
                showLoadingIndicator={false}
                src={src}
            />
            {selected ? (
                <span
                    aria-hidden="true"
                    className="bg-primary text-primary-content absolute top-2 right-2 rounded-full p-1 shadow [&>svg]:size-4"
                >
                    <CheckIcon />
                </span>
            ) : null}
            <span className="block truncate px-3 pt-2 text-xs font-medium">{label}</span>
            <span className="text-base-600 block truncate px-3 pb-2 text-xs">{detail ?? '\u00a0'}</span>
        </button>
    );
}

export function ImageUpload({
    label,
    hint,
    disabled,
    onFile,
}: {
    label: string;
    hint: string;
    disabled?: boolean;
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
                leftIcon={<Disc3Icon />}
                onClick={() => input.current?.click()}
                variant="secondary"
            >
                {label}
            </Button>
        </span>
    );
}
