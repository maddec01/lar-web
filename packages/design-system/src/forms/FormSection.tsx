import { ChevronDownIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, useId, useState } from 'react';

import { Button, type ButtonProps } from '../actions/Button';
import { InsetPanel } from '../display/InsetPanel';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { Stack } from '../layout/Flow';
import { HelpTip } from '../overlays/HelpTip';
import { Heading, Text } from '../typography/Typography';
import { Field, type FieldProps } from './Field';

const contentSpacing = 'px-4 py-3.5 sm:px-5';
const rowClasses = `grid min-w-0 gap-x-6 gap-y-3 sm:items-center ${contentSpacing}`;

export function FormContent({ children }: { children: ReactNode }) {
    return (
        <Stack space="group" className={contentSpacing}>
            {children}
        </Stack>
    );
}

export function FormStack({ children }: { children: ReactNode }) {
    return <Stack space="page">{children}</Stack>;
}

interface FormSectionProps {
    action?: ReactNode;
    badges?: ReactNode;
    children: ReactNode;
    description?: string;
    loading?: boolean;
    loadingLabel?: string;
    title: ReactNode;
}

export function FormSection({
    action,
    badges,
    children,
    description,
    loading = false,
    loadingLabel,
    title,
}: FormSectionProps) {
    const titleId = useId();
    const content = (
        <section aria-labelledby={titleId}>
            <div className="flex min-h-5 items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <Heading id={titleId} as="h3" className="text-base-700" variant="label">
                        {title}
                    </Heading>
                    {badges}
                </div>
                {action}
            </div>
            <div className="mt-3">
                <InsetPanel presentation="settings">
                    {description ? (
                        <FormContent>
                            <Text variant="caption" tone="muted">
                                {description}
                            </Text>
                        </FormContent>
                    ) : null}
                    {children}
                </InsetPanel>
            </div>
        </section>
    );

    return loading ? (
        <SkeletonLoader label={loadingLabel ?? (typeof title === 'string' ? title : '')}>{content}</SkeletonLoader>
    ) : (
        content
    );
}

type DataAttributes = { [key: `data-${string}`]: string | undefined };

interface FormRowColumnsProps {
    badges?: ReactNode;
    children: ReactNode;
    description: string;
    /** The row's element id, for linking or scrolling to it; a row with one can take focus when it is opened. */
    id?: string;
    label: ReactNode;
    layout?: 'columns';
}

/** A dense tool's settings row: the label (with an optional help popover) and description, then its controls flowing
 *  beside them and wrapping under them when they don't fit, then content below and an error. */
interface FormRowFlowProps extends DataAttributes {
    layout: 'flow';
    label: ReactNode;
    /** Explains the setting in a popover from a help button after the label; `helpLabel` names that button. */
    help?: ReactNode;
    helpLabel?: string;
    description?: ReactNode;
    children?: ReactNode;
    /** Full-width content under the label and controls, such as a list the setting governs. */
    below?: ReactNode;
    error?: string | undefined;
    /** The error's element id, for a control's aria-describedby. */
    errorId?: string;
}

type FormRowProps = FormRowColumnsProps | FormRowFlowProps;

export function FormRow(props: FormRowProps) {
    if (props.layout === 'flow') return <FormRowFlow {...props} />;

    const { badges, children, description, id, label } = props;

    return (
        <div
            id={id}
            tabIndex={id ? -1 : undefined}
            className={`${rowClasses} sm:grid-cols-[minmax(0,1fr)_13rem] sm:has-[[role=switch]]:grid-cols-[minmax(0,1fr)_auto]`}
        >
            <Stack space="tight" className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <Text as="span" variant="label">
                        {label}
                    </Text>
                    {badges}
                </div>
                <Text variant="caption" tone="muted">
                    {description}
                </Text>
            </Stack>
            <div className="min-w-0 sm:flex sm:justify-end [&>[role=status]]:w-full">{children}</div>
        </div>
    );
}

function FormRowFlow({
    layout: _layout,
    label,
    help,
    helpLabel,
    description,
    children,
    below,
    error,
    errorId,
    ...data
}: FormRowFlowProps) {
    const fallbackErrorId = useId();

    return (
        <div {...data} className="settings-row grid min-w-0 gap-2 px-4 py-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2">
                <div className="min-w-32 flex-1">
                    <div className="settings-row-title flex min-w-0 items-center gap-1.5 text-[13px] font-medium wrap-anywhere">
                        {label}
                        {help && (
                            <HelpTip label={helpLabel ?? (typeof label === 'string' ? label : '')}>{help}</HelpTip>
                        )}
                    </div>
                    {description && <div className="text-base-700 text-xs wrap-anywhere">{description}</div>}
                </div>
                {children && (
                    <div className="settings-row-control flex max-w-full min-w-0 flex-wrap items-center gap-2 sm:max-w-[60%] [&_button]:max-w-full [&>span]:max-w-full">
                        {children}
                    </div>
                )}
            </div>
            {below}
            {error && (
                <p id={errorId ?? fallbackErrorId} role="alert" className="m-0 text-xs text-(--lar-danger-text)">
                    {error}
                </p>
            )}
        </div>
    );
}

/** A value and its unit beside it in a row's controls, such as a number field and "days". */
export function FormUnit({ children, unit }: { children: ReactNode; unit: ReactNode }) {
    return (
        <span className="flex items-center gap-2 text-sm [&_input]:w-20">
            {children}
            {unit}
        </span>
    );
}

type FormFieldProps = Omit<FieldProps, 'children' | 'className'> & { action?: ReactNode } & (
        | { children: ReactNode; loading?: false; loadingLabel?: never }
        | { children?: never; loading: true; loadingLabel: string }
    );

export function FormField({ action, children, loading = false, loadingLabel, ...props }: FormFieldProps) {
    if (loading)
        return (
            <SkeletonLoader label={loadingLabel ?? ''}>
                <div className={`${rowClasses} sm:grid-cols-[9rem_minmax(0,1fr)]`}>
                    <Text variant="label" className="w-3/4" loading />
                    <SkeletonLoader.Shape presentation="control" />
                </div>
            </SkeletonLoader>
        );

    const content = children;

    if (action) {
        return (
            <div className={`${rowClasses} grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[9rem_minmax(0,1fr)_auto]`}>
                <Field
                    {...props}
                    className="contents [&>div]:min-w-0 [&>div:first-child]:col-span-2 [&>div:first-child]:mb-0 sm:[&>div:first-child]:col-span-1 [&>p]:col-span-2 [&>p]:mt-0 sm:[&>p]:col-start-2"
                >
                    {content}
                </Field>
                <div className="col-start-2 row-start-2 flex items-center gap-2 sm:col-start-3 sm:row-start-1">
                    {action}
                </div>
            </div>
        );
    }

    return (
        <Field
            {...props}
            className={`${rowClasses} sm:grid-cols-[9rem_minmax(0,1fr)] [&>div]:min-w-0 [&>div:first-child]:mb-0 [&>p]:mt-0 sm:[&>p]:col-start-2`}
        >
            {content}
        </Field>
    );
}

export function FormAction(props: Omit<ButtonProps, 'type' | 'size' | 'variant' | 'color'>) {
    return <Button {...props} type="button" variant="subtle" />;
}

export function Disclosure({ children, label, lazy = false }: { children: ReactNode; label: string; lazy?: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <details className="group px-1" onToggle={(event) => setOpen(event.currentTarget.open)}>
            <summary className="text-base-700 hover:text-base-content focus-visible:outline-primary flex w-fit cursor-pointer list-none items-center gap-1.5 rounded py-1 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="-rotate-90 transition-transform group-open:rotate-0 [&>svg]:size-3">
                    <ChevronDownIcon />
                </span>
                {label}
            </summary>
            <div className="text-base-700 mt-2 space-y-2 text-xs leading-relaxed">
                {!lazy || open ? children : null}
            </div>
        </details>
    );
}

type FormFieldsetProps = Omit<ComponentProps<'fieldset'>, 'style'> & {
    /** The legend over the group. */
    legend?: ReactNode;
    /** `group` only groups and disables its fields, with no frame. */
    presentation?: 'bordered' | 'group';
};

/** The form section's fieldset: a bordered group of controls under a legend, on the native fieldset, which also
 *  disables every control inside it. As a `group`, it only groups and disables its fields. */
export function FormFieldset({
    legend,
    presentation = 'bordered',
    className = '',
    children,
    ...props
}: FormFieldsetProps) {
    return (
        <fieldset
            className={`m-0 min-w-0 ${presentation === 'group' ? 'border-0 p-0' : 'border-base-300 mb-3 rounded-lg border px-3 pt-2 pb-0 [&>legend]:mb-2 [&>legend]:font-semibold'} ${className}`}
            data-slot="fieldset"
            {...props}
        >
            {legend ? (
                <legend className="text-base-content p-0 text-sm leading-5 font-medium" data-slot="fieldset-legend">
                    {legend}
                </legend>
            ) : null}
            {children}
        </fieldset>
    );
}
