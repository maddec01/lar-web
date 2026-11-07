import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { Popover } from '../overlays/Popover';
import { Tooltip, TooltipPopup, TooltipTrigger } from '../overlays/Tooltip';
import { buttonKind } from './ButtonKinds';

/** The title bar's counters, in its status strip after the Refreshed time. */
export function BoardCounters({ children }: { children: ReactNode }) {
    return <div className="counters flex shrink-0 items-center gap-0.5 whitespace-nowrap">{children}</div>;
}

/** How wide a counter's value stays from dash or loader to number: a count, a count over a limit, or a spend under
 *  $1,000 with its plus. */
const valueWidths = { count: 'min-w-[2ch]', limit: 'min-w-[4ch]', spend: 'min-w-[8ch]' };

/** Which counters the title bar's width folds away: Shaping and Shipped below 54rem, then Spend below 66rem. */
const folds = { never: '', medium: 'hidden @min-[54rem]:inline-flex', wide: 'hidden @min-[66rem]:inline-flex' };

interface BoardCounterProps {
    /** The status's glyph, in its own colour. */
    icon: ReactNode;
    value: ReactNode;
    width?: keyof typeof valueWidths;
    /** Names the counter for screen readers, with `hint`: "need you: 2 items waiting on your answer". */
    label: string;
    /** What the number means, in the tooltip. */
    hint: string;
    fold?: keyof typeof folds;
    /** The panel's head: its title and, at its right, a figure such as the count. */
    title: string;
    sub?: ReactNode;
    /** A note under the panel's list. */
    foot?: ReactNode;
    /** The panel's list, which scrolls. */
    children: ReactNode;
}

/** One counter: an App control with a glyph and a tabular value, its tooltip, and the panel it opens, padded as a
 *  menu, of everything behind the number. */
export function BoardCounter({
    icon,
    value,
    width = 'count',
    label,
    hint,
    fold = 'never',
    title,
    sub,
    foot,
    children,
}: BoardCounterProps) {
    return (
        <Popover>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Popover.Trigger asChild>
                        <Button
                            {...buttonKind('control')}
                            aria-label={`${label}: ${hint}`}
                            className={`text-base-700 hover:text-base-content data-[state=open]:bg-base-300/60 data-[state=open]:text-base-content min-w-0 gap-1.5 ${folds[fold]}`}
                        >
                            <span className="counter-icon grid size-4 shrink-0 place-items-center [&_svg]:size-4">
                                {icon}
                            </span>
                            <span
                                className={`counter-value text-base-content inline-flex items-center leading-4 font-medium tabular-nums [&_[data-loader]]:w-full [&_[data-loader]]:justify-center [&_svg]:size-3 ${valueWidths[width]}`}
                            >
                                {value}
                            </span>
                        </Button>
                    </Popover.Trigger>
                </TooltipTrigger>
                <TooltipPopup side="bottom">{hint}</TooltipPopup>
            </Tooltip>
            <Popover.Content side="bottom" align="end" layout="fill" presentation="menu">
                <div className="counter-popup flex max-h-112 min-h-0 w-96 max-w-full flex-col">
                    <div className="counter-head text-base-700 flex h-7 shrink-0 items-center gap-2 px-2 text-xs font-medium">
                        <span className="min-w-0 flex-1 truncate">{title}</span>
                        {sub !== undefined && <span className="shrink-0 font-normal tabular-nums">{sub}</span>}
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
                    {foot !== undefined && (
                        <div className="mt-1 shrink-0 border-t border-(--border) px-2 pt-1.5 pb-1 text-xs text-(--muted-foreground)">
                            {foot}
                        </div>
                    )}
                </div>
            </Popover.Content>
        </Popover>
    );
}

/** The divider before the spend counter, which folds with it. */
export function CounterDivider() {
    return <span aria-hidden="true" className="mx-1 hidden h-4 w-px shrink-0 bg-(--border) @min-[66rem]:block" />;
}

/** A panel's list split by status, each part under its name and count. */
export function CounterGroups({ children }: { children: ReactNode }) {
    return <div className="grid gap-1">{children}</div>;
}

export function CounterGroup({ title, count, children }: { title: string; count: number; children: ReactNode }) {
    return (
        <section>
            <h3 className="m-0 flex h-7 items-center gap-1 px-2 text-xs font-medium text-(--muted-foreground)">
                {title} <span className="tabular-nums">{count}</span>
            </h3>
            {children}
        </section>
    );
}

/** What a panel says when its list is empty, or what is still loading. */
export function CounterEmpty({ children }: { children: ReactNode }) {
    return (
        <p className="m-0 flex min-h-20 items-center justify-center px-2 py-4 text-center text-xs text-(--muted-foreground)">
            {children}
        </p>
    );
}

export function CounterList({ children }: { children: ReactNode }) {
    return <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-px p-0">{children}</ul>;
}

interface CounterItemProps {
    /** The item's id, as `data-item`. */
    item: string;
    /** The row's accessible name, the item's name. */
    label: string;
    /** The item's status glyph and source icon. */
    leading: ReactNode;
    title: ReactNode;
    /** At the right: CounterAge, or a figure such as its spend. */
    trailing: ReactNode;
    onOpen: () => void;
}

/** One item in a panel, as a menu's row; picking it closes the panel and opens the item. */
export function CounterItem({ item, label, leading, title, trailing, onOpen }: CounterItemProps) {
    return (
        <li>
            <Popover.Close asChild aria-label={label}>
                <button
                    type="button"
                    onClick={onOpen}
                    data-item={item}
                    className="text-base-content hover:bg-base-200 focus-visible:bg-base-200 flex min-h-7 w-full cursor-default items-center gap-2 rounded-[0.375rem] px-2 py-1 text-left text-sm outline-none max-lg:min-h-11 pointer-coarse:min-h-11"
                >
                    {leading}
                    <span className="min-w-0 flex-1 truncate">{title}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-(--muted-foreground) tabular-nums">
                        {trailing}
                    </span>
                </button>
            </Popover.Close>
        </li>
    );
}

/** A row's repository icon and age. */
export function CounterAge({ icon, age }: { icon: ReactNode; age: string }) {
    return (
        <>
            {icon}
            <span className="min-w-7 text-right whitespace-nowrap">{age}</span>
        </>
    );
}

/** A row's figure, such as its spend. */
export function CounterFigure({ children }: { children: ReactNode }) {
    return <span className="font-medium text-(--foreground)">{children}</span>;
}

/** A value not known yet, as nothing has been read. */
export function CounterDash() {
    return <span className="font-normal text-(--muted-foreground)">–</span>;
}

/** A count over a limit, such as builds at work over the build limit: "2/3". */
export function CounterOfLimit({ count, limit }: { count: ReactNode; limit: number }) {
    return (
        <>
            {count}
            <span className="font-normal text-(--muted-foreground)">/{limit}</span>
        </>
    );
}

/** A figure that covers only part of what it sums, marked with a plus: amber while some of it is unavailable, muted
 *  while some is still loading. */
export function CounterPartial({ figure, unavailable }: { figure: string; unavailable: boolean }) {
    return (
        <>
            {figure}
            <span className={`font-normal ${unavailable ? 'text-(--you)' : 'text-(--muted-foreground)'}`}>+</span>
        </>
    );
}

/** The build limit as bars, then the count over it: one bar per build it allows, filled for each build at work, and
 *  extra builds past it after a gap. */
export function LimitBars({ used, limit }: { used: number; limit: number }) {
    const bar = (n: number, on: boolean) => (
        <span key={n} className={`h-1.5 w-3 rounded-full ${on ? 'bg-(--thread)' : 'bg-(--border)'}`} />
    );

    return (
        <span className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-[3px]">
                {Array.from({ length: limit }, (_, n) => bar(n, n < used))}
                {used > limit && (
                    <span className="ml-1 inline-flex gap-[3px]">
                        {Array.from({ length: used - limit }, (_, n) => bar(limit + n, true))}
                    </span>
                )}
            </span>
            {used}/{limit}
        </span>
    );
}
