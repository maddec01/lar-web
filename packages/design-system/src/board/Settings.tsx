// Lar Factory's settings: the title bar's button that opens them, the sections' sidebar, the column of a page's groups,
// the short reason a setting can't be changed, and the parts its rows show under and beside their controls.

import { ExternalLinkIcon, SettingsIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { SidebarPane } from '../layout/sidebar/SidebarPane';
import { HelpTip } from '../overlays/HelpTip';
import { buttonKind } from './ButtonKinds';
import type { DataAttributes } from './DataAttributes';

/** The title bar's last button, which opens Settings: an icon-only App control named by its `label`, its 20px icon in
 *  the text colour rather than the muted one, so it holds its own beside the labelled controls. */
export function OpenSettingsButton({ label, onOpen }: { label: string; onOpen: () => void }) {
    return (
        <Button
            {...buttonKind('control')}
            iconOnly
            className="open-settings text-base-content [&_svg]:size-5"
            aria-label={label}
            title={label}
            onClick={onOpen}
        >
            <SettingsIcon />
        </Button>
    );
}

/**
 * Settings' sidebar: the `search` field over the sections' groups (SidebarNavigationGroup), and `empty`, announced,
 * when a search leaves none. `label` names the navigation.
 */
export function SettingsNav({
    label,
    search,
    empty,
    children,
    ...data
}: {
    label: string;
    search: ReactNode;
    empty?: string | undefined;
    children: ReactNode;
} & DataAttributes) {
    return (
        <div {...data} className="contents">
            <SidebarPane label={label}>
                <div className="w-44 shrink-0 md:mb-3 md:w-auto">{search}</div>
                {empty && (
                    <p role="status" data-no-match className="text-base-700 m-0 px-2 py-1 text-xs">
                        {empty}
                    </p>
                )}
                {children}
            </SidebarPane>
        </div>
    );
}

/** A settings page's groups, one under the other with room between them. */
export function SettingsGroups({ children, ...data }: { children: ReactNode } & DataAttributes) {
    return (
        <div {...data} className="grid min-w-0 gap-7">
            {children}
        </div>
    );
}

/**
 * Why a setting can't be changed, in a short muted line that wraps: the `reason`, a help popover with the whole
 * `explanation` (`helpLabel` names its button), then the `action` that checks again, such as an InlineButton.
 */
export function ReasonNote({
    reason,
    explanation,
    helpLabel,
    action,
}: {
    reason: string;
    explanation: ReactNode;
    helpLabel: string;
    action?: ReactNode;
}) {
    return (
        <span className="inline-flex min-w-0 flex-wrap items-center gap-1 text-xs text-(--muted-foreground)">
            <span>{reason}</span>
            <HelpTip label={helpLabel}>{explanation}</HelpTip>
            {action}
        </span>
    );
}

/** A settings group's note under its panel, such as what the group's last call did: small lines, stacked. `busy` marks
 *  it as still loading for assistive technology. */
export function SettingsNote({ busy, children, ...data }: { busy?: boolean; children: ReactNode } & DataAttributes) {
    return (
        <div {...data} className="grid gap-2 px-1" aria-busy={busy}>
            {children}
        </div>
    );
}

/** What a setting row shows under its control, such as an install's progress, in small stacked lines; `breaks` lets a
 *  long path break anywhere. */
export function SettingDetails({ breaks = false, children }: { breaks?: boolean; children: ReactNode }) {
    return <div className={`grid gap-2 text-xs${breaks ? ' [overflow-wrap:anywhere]' : ''}`}>{children}</div>;
}

/** A setting's control with its error under it, at most 20rem wide. */
export function SettingControl({ children }: { children: ReactNode }) {
    return <div className="grid max-w-80 gap-2">{children}</div>;
}

/** A small list of each Project's value for a setting, the Project left and its value muted right, wrapping. */
export function ProjectValueList({
    label,
    rows,
}: {
    label: string;
    rows: readonly { key: string; name: string; value: string }[];
}) {
    return (
        <ul className="m-0 grid list-none gap-1 p-0 text-xs" aria-label={label}>
            {rows.map(({ key, name, value }) => (
                <li key={key} className="flex flex-wrap justify-between gap-x-3">
                    <span className="[overflow-wrap:anywhere]">{name}</span>{' '}
                    <span className="[overflow-wrap:anywhere] text-(--muted-foreground)">{value}</span>
                </li>
            ))}
        </ul>
    );
}

/** A link to where something comes from, such as a bundled skill's source, opening in a new tab: small, with the
 *  external-link icon, underlined on hover. `label` is its accessible name. */
export function SourceLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
    return (
        <a
            className="inline-flex items-center gap-1 text-xs font-medium text-(--foreground) underline-offset-2 hover:underline [&_svg]:size-3.5"
            aria-label={label}
            href={href}
            target="_blank"
            rel="noopener"
        >
            <ExternalLinkIcon /> {children}
        </a>
    );
}
