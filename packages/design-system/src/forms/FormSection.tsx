import { Children, cloneElement, Fragment, isValidElement, type ReactNode, useContext, useId } from 'react';

import { Button, type ButtonProps } from '../actions/Button';
import { ghostEdgeClassName } from '../actions/GhostEdge';
import { Count } from '../display/Count';
import { InsetPanel } from '../display/InsetPanel';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { StackBase } from '../layout/Flow';
import { HelpTip } from '../overlays/HelpTip';
import { HeadingBase, Text, TextBase } from '../typography/Typography';
import { FieldBase, type FieldProps } from './Field';
import { FormRowsContext } from './FormRows';

type DataAttributes = { [key: `data-${string}`]: string | undefined };

const contentSpacing = 'px-4 py-3.5 sm:px-5';

/** A field's row: its label tops the control (offset to the control's first line, so a label beside a textarea, a
 *  tag list or a field with help still reads with its first line), help 8px under the control. Inside a panel the
 *  row takes the panel's padding; on a dialog's surface (a FormStack) it is flush with the dialog's text. */
function rowClasses(rows: 'panel' | 'plain') {
    return `grid min-w-0 gap-x-6 gap-y-2 sm:items-start sm:[&>div:first-child]:pt-2 ${rows === 'panel' ? 'px-4 py-2 sm:px-5' : ''}`;
}

/** A form section's padded content inside its panel, its children spaced as a group. */
export function FormContent({
    children,
}: {
    /** The fields, notes or rows it holds. */
    children: ReactNode;
}) {
    return (
        <StackBase space="group" className={contentSpacing}>
            {children}
        </StackBase>
    );
}

/** A page of form sections, spaced as a page's sections are. FormFields placed in it directly (a dialog's editor, not
 *  inside a FormSection's panel) are flush with the dialog's text, the full width of the body, one 20px gap apart
 *  whether or not they have help under them. */
export function FormStack({
    children,
}: {
    /** The FormSections (or, in a dialog, FormFields), in order. */
    children: ReactNode;
}) {
    return (
        <FormRowsContext value="plain">
            <StackBase space="page" className="[&>[data-form-row]+[data-form-row]]:-mt-1">
                {children}
            </StackBase>
        </FormRowsContext>
    );
}

interface FormSectionProps {
    /** Number of items in this settings group, using the shared quiet count. */
    count?: number;
    /** Says what `count` counts for screen readers, such as "3 folders". */
    countLabel?: string;
    /** A control at the title's end, such as an Add button. */
    action?: ReactNode;
    /** Badges after the title, such as a "Beta" category; a state such as "Healthy" is a StatusIndicator with its
     *  word (the status-word rule). */
    badges?: ReactNode;
    /** The section's rows, inside its panel. */
    children: ReactNode;
    /** A muted note at the top of the panel, before the rows. */
    description?: string;
    /** Draws the section as a skeleton while its values load. */
    loading?: boolean;
    /** Names what is loading for screen readers; the title by default. */
    loadingLabel?: string;
    /** The app's settings group (the default): a title over a panel of rows; `dense` is a dense tool's group. */
    presentation?: 'default';
    /** The group's title, such as "Libraries". */
    title: ReactNode;
}

/** A dense tool's settings group: its title (with an optional help popover) and description over the content as
 *  given, such as one or more settings panels and their notes. */
interface DenseFormSectionProps extends DataAttributes {
    /** A dense tool's settings group, such as Lar Factory's settings. */
    presentation: 'dense';
    /** The group's title, in the dense tools' 13px semibold. */
    title?: ReactNode;
    /** Explains the group in a popover from a help button after the title; `helpLabel` names that button. */
    help?: ReactNode;
    /** Names the help button; the title by default. */
    helpLabel?: string;
    /** A muted line under the title. */
    description?: ReactNode;
    /** Names the group when its title doesn't, or when it has none. */
    'aria-label'?: string;
    /** The group's content as given, such as settings panels and their notes. */
    children?: ReactNode;
}

export function FormSection(props: FormSectionProps | DenseFormSectionProps) {
    if (props.presentation === 'dense') return <DenseFormSection {...props} />;

    return <PanelFormSection {...props} />;
}

function DenseFormSection({
    presentation: _presentation,
    title,
    help,
    helpLabel,
    description,
    'aria-label': label,
    children,
    ...data
}: DenseFormSectionProps) {
    const titleId = useId();

    return (
        <section
            {...data}
            aria-label={label}
            aria-labelledby={label || !title ? undefined : titleId}
            className="grid min-w-0 gap-3"
        >
            {(title || description) && (
                <div>
                    {title && (
                        <h3 id={titleId} className="text-fg-muted m-0 flex items-center gap-1.5 text-sm font-semibold">
                            {title}
                            {help && (
                                <HelpTip label={helpLabel ?? (typeof title === 'string' ? title : '')}>{help}</HelpTip>
                            )}
                        </h3>
                    )}
                    {description && <p className="text-fg-muted m-0 mt-0.5 text-xs">{description}</p>}
                </div>
            )}
            {children}
        </section>
    );
}

function PanelFormSection({
    count,
    countLabel,
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
                    <HeadingBase id={titleId} as="h3" className="text-fg-muted" variant="label">
                        {title}
                    </HeadingBase>
                    <Count count={count} label={countLabel} loading={loading} />
                    {badges}
                </div>
                {action ? <div className={`flex min-w-0 items-center ${ghostEdgeClassName}`}>{action}</div> : null}
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

/** What a Field gives the control it wraps: the label's target id, the help or error it is described by, and its
 *  invalid, required and disabled states (and its size, which the field sets and every control already shares). */
type FieldControlProps = {
    id?: string;
    disabled?: boolean;
    'aria-invalid'?: boolean | 'true' | 'false';
    'aria-describedby'?: string;
    'aria-required'?: boolean | 'true' | 'false';
};

/** A value and its unit beside it in a row's controls, such as a number field and "days". Inside a Field or FormField
 *  it passes on what the field gives its control (the label's id, the error it is described by, invalid, required,
 *  disabled) to the field inside it, so a unit never unwires the label or the error. */
export function FormUnit({
    children,
    unit,
    ...field
}: {
    /** The field, such as a number Input. */
    children: ReactNode;
    /** The unit after it, such as "days". */
    unit: ReactNode;
} & FieldControlProps) {
    const given = Object.fromEntries(
        Object.entries(field).filter(([, value]) => value !== undefined && value !== false),
    );
    const control = Children.map(children, (child) =>
        isValidElement<FieldControlProps>(child) && Object.keys(given).length ? cloneElement(child, given) : child,
    );

    return (
        <span className="flex items-center gap-2 text-sm [&_input]:w-20">
            {control}
            {unit}
        </span>
    );
}

type FormFieldProps = Omit<FieldProps, 'children'> & {
    /** A control at the row's end, after the field, such as a "Test connection" button. */
    action?: ReactNode;
} & (
        | {
              /** The control: an Input, Select, Textarea or the like. */
              children: ReactNode;
              /** Draws a skeleton label and control while the value loads. */
              loading?: false;
              loadingLabel?: never;
          }
        | {
              children?: never;
              loading: true;
              /** Names what is loading for screen readers. */
              loadingLabel: string;
          }
    );

/** A labelled field in a form section's row: the label in a 9rem column beside its control, topping it, the help and
 *  the error under the control, and an optional action at the end. */
export function FormField({ action, children, loading = false, loadingLabel, ...props }: FormFieldProps) {
    const rows = useContext(FormRowsContext);
    const row = rowClasses(rows);

    if (loading)
        return (
            <SkeletonLoader label={loadingLabel ?? ''}>
                <div data-form-row="" className={`${row} sm:grid-cols-[9rem_minmax(0,1fr)]`}>
                    <TextBase variant="label" className="w-3/4" loading />
                    <SkeletonLoader.Shape presentation="control" />
                </div>
            </SkeletonLoader>
        );

    const content = children;

    // Given an `action`, the row keeps one tree whatever the action holds, so an action that comes and goes as the
    // reader types (Restore) never remounts the control; an empty one (nothing, an empty list or fragment) only
    // collapses its column.
    if (action !== undefined) {
        const filled = hasContent(action);

        return (
            <div
                data-form-row=""
                className={`${row} ${filled ? 'grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[9rem_minmax(0,1fr)_auto]' : 'grid-cols-[minmax(0,1fr)_0] max-sm:gap-x-0 sm:grid-cols-[9rem_minmax(0,1fr)]'}`}
            >
                <FieldBase
                    {...props}
                    className={`contents [&>div]:min-w-0 [&>div:first-child]:col-span-2 [&>div:first-child]:mb-0 sm:[&>div:first-child]:col-span-1 sm:[&>div:first-child]:pt-2 [&>p]:col-span-2 [&>p]:mt-0 sm:[&>p]:col-start-2 ${filled ? '' : 'sm:[&>p]:col-span-1'}`}
                >
                    {content}
                </FieldBase>
                <div
                    data-slot="form-field-action"
                    hidden={!filled}
                    className={`col-start-2 row-start-2 items-center gap-2 sm:col-start-3 sm:row-start-1 ${filled ? 'flex' : 'hidden'} ${ghostEdgeClassName}`}
                >
                    {action}
                </div>
            </div>
        );
    }

    return (
        <FieldBase
            {...props}
            data-form-row=""
            className={`${row} sm:grid-cols-[9rem_minmax(0,1fr)] [&>div]:min-w-0 [&>div:first-child]:mb-0 [&>p]:mt-0 sm:[&>p]:col-start-2`}
        >
            {content}
        </FieldBase>
    );
}

function hasContent(node: ReactNode): boolean {
    return Children.toArray(node).some((child) =>
        isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
            ? hasContent(child.props.children)
            : true,
    );
}

/** A form's secondary action inside its content, such as "Add another", as a subtle button. */
export function FormAction(props: Omit<ButtonProps, 'type' | 'variant'>) {
    return <Button {...props} type="button" variant="secondary" />;
}

export { FormRow, SettingsRow } from './SettingsRow';
export { Disclosure, FormFieldset, FormFieldsetBase } from './FormDisclosure';
