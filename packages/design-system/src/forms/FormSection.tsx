import { Children, cloneElement, Fragment, isValidElement, type ReactNode, useContext } from 'react';

import { Button, type ButtonProps } from '../actions/Button';
import { ghostEdgeClassName } from '../actions/GhostEdge';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { StackBase } from '../layout/Flow';
import { TextBase } from '../typography/Typography';
import { FieldBase, type FieldProps } from './Field';
import { FormRowsContext } from './FormRows';
import { SettingsGroup, SettingsSurfaceContext } from './SettingsGroup';
import { SettingsRowSkeleton } from './SettingsRow';

type DataAttributes = { [key: `data-${string}`]: string | undefined };

const contentSpacing = 'px-4 py-3.5';

/** A field's row: its label tops the control (offset to the control's first line, so a label beside a textarea, a
 *  tag list or a field with help still reads with its first line), help 8px under the control. Inside a panel the
 *  row takes the panel's padding; on a dialog's surface (a FormStack) it is flush with the dialog's text. */
function rowClasses(rows: 'panel' | 'plain') {
    return `grid min-w-0 gap-x-6 gap-y-2 sm:items-start sm:[&>div:first-child]:pt-2 ${rows === 'panel' ? 'px-4 py-2' : ''}`;
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
    // On a settings surface the groups stand T3 Code's 32px apart.
    const settings = useContext(SettingsSurfaceContext);

    return (
        <FormRowsContext value="plain">
            {settings ? (
                <div className="grid min-w-0 gap-8">{children}</div>
            ) : (
                <StackBase space="page" className="[&>[data-form-row]+[data-form-row]]:-mt-1">
                    {children}
                </StackBase>
            )}
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
    /** A muted line under the title. */
    description?: string;
    /** Draws the section as a skeleton while its values load. */
    loading?: boolean;
    /** Names what is loading for screen readers; the title by default. */
    loadingLabel?: string;
    /** The app's settings group (the default): a title over a panel of rows; `dense` shows its content as given. */
    presentation?: 'default';
    /** The group's title, such as "Libraries". */
    title: ReactNode;
}

/** A group whose content is shown as given, such as one or more settings panels and their notes. */
interface DenseFormSectionProps extends DataAttributes {
    /** Shows the content as given, under the title. */
    presentation: 'dense';
    /** The group's title. */
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

/**
 * Prefer SettingsGroup, the one settings group, in new code. A FormSection draws exactly its anatomy: by default a title
 * over a panel of rows (SettingsGroup), `dense` a title over its content as given (SettingsGroup `panel={false}`).
 */
export function FormSection(props: FormSectionProps | DenseFormSectionProps) {
    if (props.presentation === 'dense') {
        const { presentation: _presentation, ...group } = props;

        return <SettingsGroup {...group} panel={false} />;
    }

    const { presentation: _presentation, loading = false, ...group } = props;

    return <SettingsGroup {...group} loading={loading} />;
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

/** A field's parts on a settings panel's row, laid out as a SettingsRow: the label (14/500) and its help (12px muted)
 *  at the start, the control at the end in a 16rem column, the error under the control. Narrower than 28rem the
 *  control and its error drop under the help. The Field's own elements are placed on the row's grid. */
function panelFieldClasses(labelled: boolean) {
    return [
        'contents',
        '[&>*]:min-w-0 [&>*]:col-start-1 [&>*]:row-start-3 [&>*]:mt-2.5',
        '@md:[&>*]:col-start-2 @md:[&>*]:row-start-1 @md:[&>*]:row-span-2 @md:[&>*]:mt-0',
        labelled
            ? '[&>div:first-child]:col-start-1 [&>div:first-child]:row-start-1 [&>div:first-child]:row-span-1 [&>div:first-child]:m-0 [&>div:first-child>label]:text-fg [&>div:first-child>label]:leading-5'
            : '',
        '[&>p]:col-start-1 [&>p]:row-start-2 [&>p]:row-span-1 [&>p]:mt-0.5 [&>p]:leading-4.5',
        '[&>p[role=alert]]:row-start-4 [&>p[role=alert]]:mt-1.5 @md:[&>p[role=alert]]:col-start-2 @md:[&>p[role=alert]]:row-start-3',
    ].join(' ');
}

/** A labelled field in a form section's row. In a settings panel it is a settings row (SettingsRow's anatomy: the
 *  label and help at the start, the control at the end, the error under it); on a dialog's surface (a FormStack) the
 *  label sits in a 9rem column beside its control, topping it, the help and the error under the control. Either takes
 *  an optional action at the end. */
export function FormField({ action, children, loading = false, loadingLabel, ...props }: FormFieldProps) {
    const rows = useContext(FormRowsContext);
    const row = rowClasses(rows);

    if (loading && rows === 'panel')
        return (
            <SkeletonLoader label={loadingLabel ?? ''}>
                <div data-form-row="">
                    <SettingsRowSkeleton label={props.label} description={Boolean(props.helperText)} control="input" />
                </div>
            </SkeletonLoader>
        );

    if (loading)
        return (
            <SkeletonLoader label={loadingLabel ?? ''}>
                <div data-form-row="" className={`${row} sm:grid-cols-[9rem_minmax(0,1fr)]`}>
                    <TextBase variant="label" className="w-3/4" loading />
                    <SkeletonLoader.Shape presentation="control" />
                </div>
            </SkeletonLoader>
        );

    if (rows === 'panel') {
        // As below, an action keeps one tree whatever it holds; an empty one only collapses its column.
        const filled = action !== undefined && hasContent(action);

        return (
            // The row is the container; its grid inside queries the row's width (an element can't query its own).
            <div data-form-row="" className="settings-row @container min-w-0 px-4 py-3.5">
                <div
                    className={`grid min-w-0 items-center gap-x-6 ${filled ? 'grid-cols-[minmax(0,1fr)_auto] @md:grid-cols-[minmax(0,1fr)_16rem_auto] [&>[data-slot=field]>div:first-child]:col-span-2 @md:[&>[data-slot=field]>div:first-child]:col-span-1 [&>[data-slot=field]>p]:col-span-2 @md:[&>[data-slot=field]>p]:col-span-1' : 'grid-cols-[minmax(0,1fr)] @md:grid-cols-[minmax(0,1fr)_16rem]'}`}
                >
                    <FieldBase {...props} className={panelFieldClasses(Boolean(props.label))}>
                        {children}
                    </FieldBase>
                    {action !== undefined ? (
                        <div
                            data-slot="form-field-action"
                            hidden={!filled}
                            className={`col-start-2 row-start-3 mt-2.5 items-center gap-2 @md:col-start-3 @md:row-span-2 @md:row-start-1 @md:mt-0 ${filled ? 'flex' : 'hidden'} ${ghostEdgeClassName}`}
                        >
                            {action}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

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
