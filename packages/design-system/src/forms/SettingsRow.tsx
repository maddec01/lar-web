import { type ReactNode, useId } from 'react';

import { ghostEdgeClassName } from '../actions/GhostEdge';
import { Alert } from '../feedback/Alert';
import { HelpTip } from '../overlays/HelpTip';

type DataAttributes = { [key: `data-${string}`]: string | undefined };

/**
 * The one settings row, T3 Code's: the setting's title (14/500) with its badges and help, a muted 12px description
 * under it, and its control at the row's end in a column that fits it (a dropdown or a text field 13rem, a switch its
 * own width). Where the row is narrow (under 28rem, a phone) the control drops under the description and a dropdown
 * fills the row; a switch or a lone quiet text action stays beside the title, while a group of controls drops too.
 * Content the setting governs goes `below`, across the whole row, and an error under everything. Rows sit in a
 * SettingsGroup's panel, 16px in from its edge, divided by its lines; a single-line row is 48px.
 */
interface SettingsRowProps extends DataAttributes {
    /** `action` makes the title an action, such as a quiet "Clear generated music" button, its label aligned with the
     *  other rows' titles. */
    variant?: 'default' | 'action';
    /** Keeps this row's exact layout, drawing skeleton shapes over its title, description and control (as wide as each
     *  really is) and making them inert, until the value arrives. */
    loading?: boolean;
    /** Names the pending row; the title by default. */
    loadingLabel?: string;
    /** @deprecated Every row has one layout now; `flow` (and `columns`) are accepted and ignored. */
    layout?: 'flow' | 'columns';
    /** The row's element id, for linking or scrolling to it; a row with one can take focus when it is opened. */
    id?: string;
    /** Badges after the title, such as "Restart needed". */
    badges?: ReactNode;
    /** A mark before the title and description, such as a sign-in provider's logo on a 32px tile; the description and,
     *  on a narrow row, the control line up with the title after it. */
    leading?: ReactNode;
    /** The setting's name. */
    label: ReactNode;
    /** Explains the setting in a popover from a help button after the title; `helpLabel` names that button. */
    help?: ReactNode;
    /** Names the help button; the title by default. */
    helpLabel?: string;
    /** What the setting does, in a muted line under the title. */
    description?: ReactNode;
    /** The row's control (or controls), at its end. A switch, a select or a segmented control applies at once; a typed
     *  value is a draft (useSettingsDraft) that the settings' footer saves. */
    children?: ReactNode;
    /** Full-width content under the title and control, such as a list the setting governs or a SettingsDetails. */
    below?: ReactNode;
    /** What is wrong with the setting's value: a compact danger Alert 8px under the row's last line. */
    error?: string | undefined;
    /** The error's element id, for a control's aria-describedby. */
    errorId?: string;
    /** The width of a text field or dropdown in the control column: `default` 208px for every kind, `wide` 320px for a
     *  value that runs long, such as an email address, a URL or a path. A numeric field is always 96px. On a narrow
     *  row the control fills the row either way. */
    controlWidth?: 'default' | 'wide';
}

/** One width for a row's text field and dropdown (13rem, or 20rem `wide`); a numeric field is 6rem at every width. */
const controlWidths = {
    default:
        '@md:[&_[role=combobox]]:w-52 @md:[&_input:not([type=checkbox]):not([type=radio]):not([type=number])]:w-52',
    wide: '@md:[&_[role=combobox]]:w-80 @md:[&_input:not([type=checkbox]):not([type=radio]):not([type=number])]:w-80',
} as const;
const numberWidth = '[&_input[type=number]]:w-24 [&_input[type=number]]:shrink-0';

/** A ghost action (Remove, Leave) stays beside the title on a narrow row, as a switch does; where one still drops under
 *  the description (among other controls), it pulls its 12px inset past the start, so its label lines up with the
 *  title. */
const ghostStartClassName = [
    '@max-md:[&:has(>[data-settings-edge=ghost]:first-child)]:-ms-3',
    '@max-md:[&:has(>:first-child>[data-settings-edge=ghost]:first-child)]:-ms-3',
    '@max-md:[&:has(>:first-child>:first-child>[data-settings-edge=ghost]:first-child)]:-ms-3',
].join(' ');

/** A lone ghost action (one Remove, one Leave) stays beside the title on a narrow row, as a switch does: the ghost is
 *  the control's only element (in the Skeletal wrappers, or in one wrapper of the app's). Among other controls (Enter
 *  code and Decline) the group drops under the description, so a long title keeps the row's width. */
const loneGhostClassName = [
    'has-[>[data-slot=settings-row-control]>*>*>[data-settings-edge=ghost]:only-child]:grid-cols-[minmax(0,1fr)_auto]',
    'has-[>[data-slot=settings-row-control]>*>*>:only-child>[data-settings-edge=ghost]:only-child]:grid-cols-[minmax(0,1fr)_auto]',
].join(' ');

/** A shape over content that keeps its footprint (settings' one skeleton mechanism, also a loading group's action): the
 *  content stays laid out but invisible, and one skeleton bar (the design system's `lar-skeleton`, as
 *  SkeletonLoader.Shape draws it) covers it, as wide as the content really is. */
export function Skeletal({
    loading,
    shape = 'line',
    children,
}: {
    loading: boolean;
    /** `line` is a bar in the middle of a line of text; `control` covers a control's whole box. */
    shape?: 'line' | 'control';
    children: ReactNode;
}) {
    // One tree whether loading or not (the wrappers are `contents` once loaded), so a control keeps its element, and
    // its focus, as the value arrives.
    return (
        <span className={loading ? 'relative inline-flex max-w-full min-w-0 align-top' : 'contents'}>
            <span className={loading ? 'invisible min-w-0' : 'contents'}>{children}</span>
            {loading ? (
                <span aria-hidden="true" className={`absolute inset-0 flex ${shape === 'line' ? 'items-center' : ''}`}>
                    <span
                        data-slot="skeleton"
                        className={`lar-skeleton block w-full ${shape === 'line' ? 'h-3 rounded-full' : 'h-full rounded-md'}`}
                    />
                </span>
            ) : null}
        </span>
    );
}

/** A settings row's controls are the form's 32px (`md`) ones, as every setting's switch, select and field are: a
 *  labelled `sm` button put in the row (Enter code, Decline beside a sign-in request) grows to 32px with them. Icon
 *  buttons keep their 28px box; a group's header action and its footer stay `sm`. */
const mdControlsClassName = '[&_[data-slot=button][data-size=sm]:not([data-icon-only])]:min-h-8';

/** A shared settings row: the title, an optional description and help, its control at the end and content below. */
export function SettingsRow(props: SettingsRowProps) {
    return <SettingsRowBase {...props} announce />;
}

/** The row; a skeleton row inside a group that is already announced as loading doesn't announce itself. */
function SettingsRowBase({
    announce,
    layout: _layout,
    variant = 'default',
    loading = false,
    loadingLabel,
    badges,
    leading,
    id,
    label,
    help,
    helpLabel,
    description,
    children,
    below,
    error,
    errorId,
    controlWidth = 'default',
    ...data
}: SettingsRowProps & { announce: boolean }) {
    const fallbackErrorId = useId();
    const hasControl = children !== undefined && children !== null && children !== false;

    return (
        <div
            {...data}
            id={id}
            role={loading && announce ? 'status' : undefined}
            aria-busy={loading || undefined}
            aria-label={
                loading && announce ? (loadingLabel ?? (typeof label === 'string' ? label : undefined)) : undefined
            }
            tabIndex={id ? -1 : undefined}
            // A single-line row (a title and its control) is 48px: its 32px control 8px from the lines; a row with a
            // description, or content below, keeps 14px above and below its text.
            className={`settings-row @container grid min-w-0 gap-3 px-4 ${description || below ? 'py-3.5' : 'min-h-12 content-center py-2'}`}
        >
            <div
                aria-hidden={loading || undefined}
                inert={loading || undefined}
                className={leading ? 'flex min-w-0 items-start gap-3' : 'contents'}
            >
                {leading ? (
                    <span data-slot="settings-row-leading" className="flex shrink-0 items-center self-start">
                        <Skeletal loading={loading} shape="control">
                            {leading}
                        </Skeletal>
                    </span>
                ) : null}
                <div
                    className={`grid min-w-0 flex-1 grid-cols-1 items-center gap-x-6 gap-y-2.5 has-[>[data-slot=settings-row-control]_[role=switch]]:grid-cols-[minmax(0,1fr)_auto] @md:grid-cols-[minmax(0,1fr)_auto] ${loneGhostClassName}`}
                >
                    <div className="min-w-0">
                        <div
                            className={`settings-row-title flex min-w-0 items-center gap-1.5 text-sm leading-5 font-medium wrap-anywhere ${variant === 'action' ? '[&>span>span>button]:-my-1 [&>span>span>button]:-ms-3' : ''}`}
                        >
                            <Skeletal loading={loading}>{label}</Skeletal>
                            {badges}
                            {help && !loading && (
                                <HelpTip label={helpLabel ?? (typeof label === 'string' ? label : '')}>{help}</HelpTip>
                            )}
                        </div>
                        {description && (
                            <div className="text-fg-muted mt-0.5 text-xs leading-4.5 wrap-anywhere">
                                <Skeletal loading={loading}>{description}</Skeletal>
                            </div>
                        )}
                    </div>
                    {hasControl && (
                        <div
                            data-slot="settings-row-control"
                            className={`flex max-w-full min-w-0 flex-wrap items-center gap-2 @md:max-w-[60cqw] @md:justify-end [&_[role=combobox]]:w-full ${controlWidths[controlWidth]} ${numberWidth} [&_button]:max-w-full [&_span]:max-w-full @max-md:[&_span:has([role=combobox])]:w-full ${ghostEdgeClassName} ${ghostStartClassName} ${mdControlsClassName}`}
                        >
                            <Skeletal loading={loading} shape="control">
                                {children}
                            </Skeletal>
                        </div>
                    )}
                </div>
            </div>
            {below && (
                <div aria-hidden={loading || undefined} inert={loading || undefined} className="min-w-0">
                    <Skeletal loading={loading} shape="control">
                        {below}
                    </Skeletal>
                </div>
            )}
            {/* The compact alert, 8px under the row's last line (the row's 12px step less 4px), with no line held
                for it while there is no error. */}
            {error && !loading && (
                <div className="-mt-1">
                    <Alert id={errorId ?? fallbackErrorId} presentation="inline" tone="danger" message={error} />
                </div>
            )}
        </div>
    );
}

/** @deprecated The two-column row of the older FormSection: renders a SettingsRow, the one settings row. */
export function FormRow({
    badges,
    children,
    description,
    id,
    label,
    layout: _layout,
    ...rest
}: Omit<SettingsRowProps, 'layout' | 'description'> & {
    /** What the setting does, in a muted line under the label. */
    description?: ReactNode;
    /** @deprecated Ignored: every row has one layout. */
    layout?: 'columns' | 'flow';
}) {
    return (
        <SettingsRow {...rest} id={id} label={label} badges={badges} description={description}>
            {children}
        </SettingsRow>
    );
}

/** A row-shaped placeholder, for a list whose rows aren't known yet. Give it the `label` (and `description`) the
 *  loaded row will show where you know them, so the shapes are as wide as the real text; match its control. */
export function SettingsRowSkeleton({
    label,
    description = true,
    control = 'button',
}: {
    /** The loaded row's title, measured for its shape's width; a typical title's width otherwise. */
    label?: string;
    /** Reserve the loaded row's description line: its text, or true for a typical line. */
    description?: boolean | string;
    /** The loaded control's footprint. */
    control?: 'button' | 'switch' | 'input' | 'select' | 'value' | 'none';
}) {
    return (
        <SettingsRowBase
            announce={false}
            loading
            label={label ?? <span className="inline-block w-32" />}
            description={
                description === false ? undefined : typeof description === 'string' ? (
                    description
                ) : (
                    <span className="inline-block w-64 max-w-full">&nbsp;</span>
                )
            }
        >
            {control === 'none' ? undefined : (
                <span
                    className={`block ${control === 'switch' ? 'h-5 w-9' : control === 'input' || control === 'select' ? 'h-8 w-52 max-w-full' : control === 'value' ? 'h-5 w-20' : 'h-8 w-24'}`}
                />
            )}
        </SettingsRowBase>
    );
}
