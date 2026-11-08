import { ChevronDownIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, type SyntheticEvent, useState } from 'react';

import { BadgeBase as Badge } from '../display/Badge';

type DataAttributes = { [key: `data-${string}`]: string | undefined };

/** Content folded behind a summary the reader opens, on the native details element. Every presentation leads its
 *  summary with the same turning chevron (never the browser's own ▶ marker). */
export function Disclosure({
    children,
    label,
    lazy = false,
    presentation = 'note',
    defaultOpen = false,
    badge,
    onOpenChange,
    ...data
}: {
    /** What it folds away. */
    children: ReactNode;
    /** The summary the reader opens it by, such as "Technical details". */
    label: string;
    /** Renders the content only once it is open, for content that costs something to draw. */
    lazy?: boolean;
    /** `note` folds small muted text behind a chevron; `section` folds a section's own content, such as an earlier
     *  version of a text, behind a muted label in the body size; `group` folds a form's optional group behind its
     *  heading, such as optional settings; `framed` folds a short list in a frame, such as entries that can't be
     *  picked. */
    presentation?: 'note' | 'section' | 'group' | 'framed';
    /** Starts open, such as a group whose kept answers may need a look. */
    defaultOpen?: boolean;
    /** A `group`'s badge after its heading, such as "Optional". */
    badge?: string | undefined;
    /** Hears each time it opens or closes, such as to read what it shows once it opens. */
    onOpenChange?: (open: boolean) => void;
} & DataAttributes) {
    const [open, setOpen] = useState(defaultOpen);
    const shown = !lazy || open ? children : null;
    const toggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
        setOpen(event.currentTarget.open);
        onOpenChange?.(event.currentTarget.open);
    };

    if (presentation === 'group')
        return (
            <details {...data} open={open} onToggle={toggle} className="group min-w-0">
                <summary className={`${summaryClasses} text-ui text-fg font-semibold`}>
                    <Chevron />
                    {label}
                    {badge && (
                        <>
                            {' '}
                            <Badge className="ms-1">{badge}</Badge>
                        </>
                    )}
                </summary>
                {shown && <div className="mt-3 grid min-w-0 gap-3">{shown}</div>}
            </details>
        );

    if (presentation === 'framed')
        return (
            <details
                {...data}
                open={open}
                onToggle={toggle}
                className="group border-line min-w-0 rounded-lg border px-3 py-2"
            >
                <summary className={`${summaryClasses} text-fg text-sm font-medium`}>
                    <Chevron />
                    {label}
                </summary>
                <div className="mt-2">{shown}</div>
            </details>
        );

    if (presentation === 'section')
        return (
            <details {...data} open={open} className="group min-w-0" onToggle={toggle}>
                <summary className="text-fg-muted hover:text-fg focus-ring flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-xs py-1 text-sm [&::-webkit-details-marker]:hidden">
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="size-3.5 shrink-0 -rotate-90 transition-transform group-open:rotate-0"
                    />
                    {label}
                </summary>
                <div className="pt-2">{shown}</div>
            </details>
        );

    return (
        <details {...data} className="group px-1" onToggle={toggle}>
            <summary className="text-fg-muted hover:text-fg focus-ring flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-xs py-1 text-xs [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="-rotate-90 transition-transform group-open:rotate-0 [&>svg]:size-3">
                    <ChevronDownIcon />
                </span>
                {label}
            </summary>
            <div className="text-fg-muted mt-2 space-y-2 text-xs leading-relaxed">{shown}</div>
        </details>
    );
}

const summaryClasses =
    'focus-ring flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-xs [&::-webkit-details-marker]:hidden';

function Chevron() {
    return (
        <ChevronDownIcon
            aria-hidden="true"
            className="text-fg-muted size-3.5 shrink-0 -rotate-90 transition-transform group-open:rotate-0"
        />
    );
}

/** A fieldset's look is its presentation, never a class of the caller's. */
interface FormFieldsetProps extends Omit<ComponentProps<'fieldset'>, 'className' | 'style' | 'color'> {
    /** Disables every control inside it, natively. */
    disabled?: boolean;
    /** The grouped controls. */
    children?: ReactNode;
    /** The legend over the group. */
    legend?: ReactNode;
    /** Names the group for assistive technology only, where what's around it already says what it is. */
    hiddenLegend?: boolean;
    /** `group` only groups and disables its fields, with no frame. */
    presentation?: 'bordered' | 'group';
}

type FormFieldsetBaseProps = FormFieldsetProps & Pick<ComponentProps<'fieldset'>, 'className'>;

/** The fieldset for the design system's own compositions, which may lay it out with a class. */
export function FormFieldsetBase({
    legend,
    hiddenLegend = false,
    presentation = 'bordered',
    className = '',
    children,
    ...props
}: FormFieldsetBaseProps) {
    return (
        <fieldset
            className={`m-0 min-w-0 ${presentation === 'group' ? 'border-0 p-0' : 'border-line mb-3 rounded-lg border px-3 pt-2 pb-0 [&>legend]:mb-2 [&>legend]:font-semibold'} ${className}`}
            data-slot="fieldset"
            {...props}
        >
            {legend ? (
                <legend
                    className={hiddenLegend ? 'sr-only' : 'text-fg p-0 text-sm leading-5 font-medium'}
                    data-slot="fieldset-legend"
                >
                    {legend}
                </legend>
            ) : null}
            {children}
        </fieldset>
    );
}

/** The form section's fieldset: a bordered group of controls under a legend, on the native fieldset, which also
 *  disables every control inside it. As a `group`, it only groups and disables its fields. */
export function FormFieldset(props: FormFieldsetProps) {
    return <FormFieldsetBase {...props} />;
}
