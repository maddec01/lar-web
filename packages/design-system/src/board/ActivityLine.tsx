// What a row says its T3 thread is doing, in its second line's text slot: a status mark, then the newest action, its
// age and the agents at work; and the list of agents at work, in its tooltip and the item dialog.

import type { ReactNode } from 'react';

import { Badge } from '../display/Badge';
import { Tooltip, TooltipPopup, TooltipTrigger } from '../overlays/Tooltip';

/** What a thread's activity line says it is doing. */
export type ActivityState = 'working' | 'quiet' | 'waiting' | 'stopped' | 'unavailable';

/** Quiet is hollow and stopped is square, so each reads apart from working without its colour. */
const MARK: Record<ActivityState, string> = {
    working: 'rounded-full bg-(--st-now)',
    quiet: 'rounded-full border-[1.5px] border-(--warning-foreground)',
    waiting: 'rounded-full bg-(--st-amber)',
    stopped: 'rounded-[1px] bg-(--st-idle)',
    unavailable: 'rounded-full border-[1.5px] border-(--st-idle)',
};

/** The line's words for its state, which `data-action` marks. */
function Words({ state, children }: { state: ActivityState; children: ReactNode }) {
    switch (state) {
        case 'working':
            return (
                <span data-action className="min-w-0 truncate text-(--foreground)">
                    {children}
                </span>
            );
        case 'quiet':
            return (
                <span data-action className="min-w-0 truncate font-medium text-(--warning-foreground) tabular-nums">
                    {children}
                </span>
            );
        case 'waiting':
            return (
                <Badge data-action data-activity-badge tone="warning" className="shrink-0">
                    {children}
                </Badge>
            );
        case 'stopped':
            return (
                <Badge data-action data-activity-badge className="shrink-0">
                    {children}
                </Badge>
            );
        case 'unavailable':
            return (
                <span data-action className="min-w-0 truncate">
                    {children}
                </span>
            );
    }
}

/**
 * A thread's activity: its state's mark, its `action`, then its `age` and how many `agents` work, each after a dot. With
 * `agentList`, the line takes focus and its tooltip lists the agents at work.
 */
export function ActivityLine({
    state,
    action,
    age,
    agents,
    agentList,
}: {
    state: ActivityState;
    action: ReactNode;
    age?: string | undefined;
    agents?: string | undefined;
    agentList?: ReactNode;
}) {
    const shown = (
        <span
            data-activity={state}
            tabIndex={agentList ? 0 : undefined}
            className="flex min-w-0 items-center gap-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
        >
            <span data-mark className={`inline-block size-2 shrink-0 ${MARK[state]}`} />
            <Words state={state}>{action}</Words>
            {age !== undefined && (
                <span data-age className="shrink-0 tabular-nums">
                    · {age}
                </span>
            )}
            {agents && (
                <span data-agents className="shrink-0 tabular-nums">
                    · {agents}
                </span>
            )}
        </span>
    );

    if (!agentList) return shown;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{shown}</TooltipTrigger>
            <TooltipPopup side="bottom" align="start" className="max-w-md">
                {agentList}
            </TooltipPopup>
        </Tooltip>
    );
}

/** The agents at work, one AgentRow each. */
export function AgentList({ children }: { children: ReactNode }) {
    return (
        <ul data-agent-list className="m-0 grid min-w-0 list-none gap-1 p-0 text-left">
            {children}
        </ul>
    );
}

/** An agent at work: its title, any `model` after it, its action's `age` at the right, and its `action` under it. */
export function AgentRow({
    title,
    model,
    age,
    action,
}: {
    title: string;
    model?: string | undefined;
    age?: ReactNode;
    action?: string | undefined;
}) {
    return (
        <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-1.5">
            <span className={`inline-block size-2 self-center ${MARK.working}`} />
            <span className="flex min-w-0 gap-1.5">
                <span className="min-w-0 truncate font-medium">{title}</span>
                {model && <span className="shrink-0 opacity-70">· {model}</span>}
            </span>
            {age || <span />}
            {action && (
                <span title={action} className="col-span-2 col-start-2 truncate opacity-70">
                    {action}
                </span>
            )}
        </li>
    );
}

/** An agent's action's age, in AgentRow. */
export function AgentAge({ children }: { children: ReactNode }) {
    return (
        <span data-agent-age className="shrink-0 tabular-nums opacity-70">
            {children}
        </span>
    );
}

/** The agents at work in the item dialog, under `heading`; or, with `unavailable`, why they can't be listed. */
export function WorkingAgents({
    heading,
    unavailable,
    children,
}: {
    heading: string;
    unavailable?: string | undefined;
    children?: ReactNode;
}) {
    return (
        <section data-working-agents className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 text-xs">
            {unavailable ? (
                <p className="m-0 text-(--muted-foreground)">{unavailable}</p>
            ) : (
                <>
                    <p className="m-0 font-medium">{heading}</p>
                    {children}
                </>
            )}
        </section>
    );
}
