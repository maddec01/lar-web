import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { ButtonLink } from '../actions/ButtonLink';
import { InlineBase, StackBase } from '../layout/Flow';
import { Text, TextBase } from '../typography/Typography';
import { StatusIndicator } from './StatusIndicator';
import { resolveStatusTone, type StatusColour } from './StatusState';

/** The way to what a row reports, such as "Review": a link (`href`, with `onNavigate` for the app's router) or a
 *  button (`onClick`). */
export interface StatusRowAction {
    /** The action's words, such as "Review". */
    label: string;
    /** Where it goes, for a link. */
    href?: string;
    /** Called with the `href` on a plain left click, for the app's router. */
    onNavigate?: (href: string) => void;
    /** Called on a click, for a button. */
    onClick?: () => void;
}

/** The light's colour: what the row's state means (`state`, preferred) or a `tone`. */
type StatusRowProps = StatusColour & {
    /** Draws skeleton lines in place of the label and details while they load. */
    loading?: boolean;
    /** `sm` is a 20px light and caption text, for a popover or a dense list; `md` (the default) a page's row. */
    size?: 'sm' | 'md';
    /** A muted line under the label. */
    detail?: string;
    /** Something of the caller's in place of the status light, such as an app icon. */
    indicator?: ReactNode;
    /** What the row is about, such as a service's name. */
    label: string;
    /** The way to what the row reports, such as "Review": the one look every app's status rows and attention rows
     *  share for it, a small tinted button at the row's end, centred on the row. The row's `value` then reads under
     *  the label, before any `detail`, so the action never wraps onto a line of its own in a narrow popover. Never a
     *  text link of the caller's in `trailing`. */
    action?: StatusRowAction;
    /** Controls or a badge at the row's end, in place of `value`; a control taller than the label's line reaches into
     *  the row's padding, so the row keeps the list's rhythm. */
    trailing?: ReactNode;
    /** A muted value at the row's end, such as "12 ms". */
    value?: string;
    /** A second muted line; an empty string keeps its room, so rows line up. */
    secondaryDetail?: string;
};

/** One state in a list of them: a status light, a label and its details, and a value or controls at the end. With
 *  details under the label, the light (and the value) align to the label's first line, as in every status list.
 *  The label wraps rather than truncates; when the end holds more than the row can spare beside it (a link and a
 *  state in a narrow popover), the end moves under the label, at the row's end. */
export function StatusRow({
    size = 'md',
    loading = false,
    detail,
    indicator,
    label,
    action,
    trailing,
    value,
    secondaryDetail,
    ...colour
}: StatusRowProps) {
    const tone = resolveStatusTone(colour);
    // With an action at the end, the value joins the line under the label: "On, confirming · Your router hasn't…".
    const shownDetail = action && value ? [value, detail].filter(Boolean).join(' · ') : detail;
    const shownValue = action ? undefined : value;
    // One rule wherever a status has lines under it: the light sits on the centre of the label's first line, never
    // centred across the lines; a value reads with that line too. A caller's indicator (an app icon) is a box of its
    // own and tops the text.
    const lines = Boolean(shownDetail) || secondaryDetail !== undefined;

    return (
        <InlineBase align="center" justify="between" space="section" wrap className="min-w-0 rounded-lg px-2 py-2">
            <InlineBase align={lines ? 'start' : 'center'} space="related" className="min-w-0 flex-1 basis-32">
                {indicator ? (
                    <span
                        className={`flex shrink-0 items-center justify-center [&>[data-slot=skeleton]]:size-full ${size === 'sm' ? 'size-5' : 'size-8'}`}
                    >
                        {indicator}
                    </span>
                ) : (
                    <span
                        data-slot="status-row-light"
                        className={`flex shrink-0 items-center justify-center ${size === 'sm' ? 'h-4 w-5' : 'h-5'}`}
                    >
                        <StatusIndicator tone={tone} />
                    </span>
                )}
                <StackBase space="none" className="min-w-0 flex-1">
                    <TextBase
                        as="span"
                        variant={size === 'sm' ? 'caption' : 'body'}
                        className="wrap-break-word"
                        loading={loading}
                    >
                        {label}
                    </TextBase>
                    {shownDetail ? (
                        <Text as="span" title={shownDetail} variant="caption" tone="muted" loading={loading}>
                            {shownDetail}
                        </Text>
                    ) : null}
                    {secondaryDetail !== undefined ? (
                        <Text as="span" title={secondaryDetail} variant="caption" tone="muted" loading={loading}>
                            {secondaryDetail || '\u00a0'}
                        </Text>
                    ) : null}
                </StackBase>
            </InlineBase>
            {action || trailing ? (
                // A control (a row button, an icon button) may be taller than the label's line; it reaches into the
                // row's own padding rather than growing the row, so every row in a list keeps one rhythm.
                <span data-slot="status-row-trailing" className="-my-2 ml-auto flex shrink-0 items-center gap-3">
                    {action ? <StatusRowActionButton {...action} /> : null}
                    {trailing ??
                        (shownValue ? (
                            <TextBase as="span" variant={size === 'sm' ? 'caption' : 'body'} tone="muted">
                                {shownValue}
                            </TextBase>
                        ) : null)}
                </span>
            ) : (
                <TextBase
                    as="span"
                    variant={size === 'sm' ? 'caption' : 'body'}
                    tone="muted"
                    // A value reads with the label's first line; controls (`trailing`) stay centred on the row.
                    className={`ml-auto ${size === 'sm' ? 'w-20 shrink-0 text-end' : ''} ${lines ? 'self-start' : ''}`}
                >
                    {value}
                </TextBase>
            )}
        </InlineBase>
    );
}

function StatusRowActionButton({ label, href, onNavigate, onClick }: StatusRowAction) {
    return href ? (
        <ButtonLink href={href} variant="tinted" size="sm" onNavigate={onNavigate} onClick={onClick}>
            {label}
        </ButtonLink>
    ) : (
        <Button type="button" variant="tinted" size="sm" onClick={onClick}>
            {label}
        </Button>
    );
}
