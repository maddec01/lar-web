import { type ReactNode, useId } from 'react';

import { ghostEdgeClassName } from '../actions/GhostEdge';
import { Alert } from '../feedback/Alert';
import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { StackBase } from '../layout/Flow';
import { HelpTip } from '../overlays/HelpTip';
import { Text } from '../typography/Typography';

type DataAttributes = { [key: `data-${string}`]: string | undefined };

const rowClasses = 'grid min-w-0 gap-x-6 gap-y-3 sm:items-center px-4 py-3.5 sm:px-5';

interface FormRowColumnsProps {
    /** Badges after the label, such as "Restart needed". */
    badges?: ReactNode;
    /** The row's control, in the 13rem column at its end (a switch takes its own width). */
    children: ReactNode;
    /** What the setting does, in a muted line under the label. */
    description: string;
    /** The row's element id, for linking or scrolling to it; a row with one can take focus when it is opened. */
    id?: string;
    /** The setting's name. */
    label: ReactNode;
    /** `columns` (the default) puts the control in a column at the row's end; `flow` is a dense tool's row. */
    layout?: 'columns';
}

/** A dense tool's settings row: the label (with an optional help popover) and description, then its controls flowing
 *  beside them and wrapping under them when they don't fit, then content below and an error. */
interface FormRowFlowProps extends DataAttributes {
    /** An action in the label column; its ghost button's label aligns with other row labels. */
    variant?: 'default' | 'action';
    /** Keeps this row's exact layout, replacing its content with inert skeleton shapes. */
    loading?: boolean;
    /** Names the pending row; the label by default. */
    loadingLabel?: string;
    /** A dense tool's row, its controls flowing beside the label and wrapping under it. */
    layout: 'flow';
    /** The row's element id, for linking or scrolling to it; a row with one can take focus when it is opened. */
    id?: string;
    /** Badges after the label. */
    badges?: ReactNode;
    /** The setting's name. */
    label: ReactNode;
    /** Explains the setting in a popover from a help button after the label; `helpLabel` names that button. */
    help?: ReactNode;
    /** Names the help button; the label by default. */
    helpLabel?: string;
    /** What the setting does, in a muted line under the label. */
    description?: ReactNode;
    /** The row's controls, beside the label, wrapping under it when they don't fit. */
    children?: ReactNode;
    /** Full-width content under the label and controls, such as a list the setting governs. */
    below?: ReactNode;
    /** What is wrong with the setting's value, under the row in the danger colour. */
    error?: string | undefined;
    /** The error's element id, for a control's aria-describedby. */
    errorId?: string;
}

type FormRowProps = FormRowColumnsProps | FormRowFlowProps;

/** A settings row in a FormSection's panel: the setting's label and description, and its control. */
export function FormRow(props: FormRowProps) {
    if (props.layout === 'flow') return <SettingsRow {...props} />;

    const { badges, children, description, id, label } = props;

    return (
        <div
            id={id}
            tabIndex={id ? -1 : undefined}
            className={`${rowClasses} sm:grid-cols-[minmax(0,1fr)_13rem] sm:has-[[role=switch]]:grid-cols-[minmax(0,1fr)_auto]`}
        >
            <StackBase space="tight" className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <Text as="span" variant="label">
                        {label}
                    </Text>
                    {badges}
                </div>
                <Text variant="caption" tone="muted">
                    {description}
                </Text>
            </StackBase>
            <div className={`min-w-0 sm:flex sm:justify-end [&>[role=status]]:w-full ${ghostEdgeClassName}`}>
                {children}
            </div>
        </div>
    );
}

/** A shared settings row: 14px title, optional explanation/help, trailing controls and full-width feedback. */
export function SettingsRow({
    layout: _layout,
    variant = 'default',
    loading = false,
    loadingLabel,
    badges,
    id,
    label,
    help,
    helpLabel,
    description,
    children,
    below,
    error,
    errorId,
    ...data
}: Omit<FormRowFlowProps, 'layout'> & { layout?: 'flow' }) {
    const fallbackErrorId = useId();

    return (
        <div
            {...data}
            id={id}
            role={loading ? 'status' : undefined}
            aria-busy={loading || undefined}
            aria-label={loading ? (loadingLabel ?? (typeof label === 'string' ? label : undefined)) : undefined}
            tabIndex={id ? -1 : undefined}
            className="settings-row grid min-w-0 gap-2 px-4 py-3.5 sm:px-5"
        >
            <div
                aria-hidden={loading || undefined}
                inert={loading || undefined}
                className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2"
            >
                <div className="min-w-32 flex-1">
                    <div
                        className={`settings-row-title flex min-w-0 items-center gap-1.5 text-sm font-medium wrap-anywhere ${variant === 'action' ? '[&>button]:-my-1 [&>button]:-ms-3' : ''} ${loading ? 'settings-loading' : ''}`}
                    >
                        {label}
                        {badges}
                        {help && (
                            <HelpTip label={helpLabel ?? (typeof label === 'string' ? label : '')}>{help}</HelpTip>
                        )}
                    </div>
                    {description && (
                        <div className={`text-fg-muted text-xs wrap-anywhere ${loading ? 'settings-loading' : ''}`}>
                            {description}
                        </div>
                    )}
                </div>
                {children && (
                    <div
                        className={`settings-row-control flex max-w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:max-w-[60%] [&_[role=combobox]]:w-52 [&_button]:max-w-full ${ghostEdgeClassName} [&>span]:max-w-full ${loading ? 'settings-loading' : ''}`}
                    >
                        {children}
                    </div>
                )}
            </div>
            {below && (
                <div
                    aria-hidden={loading || undefined}
                    inert={loading || undefined}
                    className={loading ? 'settings-loading' : undefined}
                >
                    {below}
                </div>
            )}
            {error && !loading && <Alert id={errorId ?? fallbackErrorId} size="sm" tone="danger" message={error} />}
        </div>
    );
}

/** A row-shaped placeholder. Match its control and description to the loaded row; repeat N times in a section. */
export function SettingsRowSkeleton({
    description = true,
    control = 'button',
}: {
    /** Reserve the loaded row's description line. */
    description?: boolean;
    /** The loaded control's footprint. */
    control?: 'button' | 'switch' | 'input' | 'value';
}) {
    return (
        <SettingsRow
            label={
                <span className="flex h-5 w-32 items-center">
                    <SkeletonLoader.Shape />
                </span>
            }
            description={
                description ? (
                    <span className="flex h-4 w-64 max-w-full items-center">
                        <SkeletonLoader.Shape width="wide" />
                    </span>
                ) : undefined
            }
        >
            <span
                aria-hidden="true"
                data-slot="skeleton"
                className={`lar-skeleton rounded-md ${control === 'switch' ? 'block h-5 w-9' : control === 'input' ? 'block h-8 w-52' : control === 'value' ? 'block h-5 w-20' : 'block h-8 w-24'}`}
            />
        </SettingsRow>
    );
}
