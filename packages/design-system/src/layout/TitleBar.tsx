import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { tabbable } from '../foundations/KeyboardFocus';

interface TitleBarProps {
    actions?: ReactNode;
    /** The brand, a link home, before a divider and the title. */
    brand: ReactNode;
    search?: ReactNode;
    title: ReactNode;
}

/** T3 Code's 52px title bar: the brand and where you are on the left, tools on the right. Its own width,
 *  not the window's, decides when search folds to an icon; narrow screens close the gaps so the title keeps
 *  the room left. */
export function TitleBar({ actions, brand, search, title }: TitleBarProps) {
    const labels = useDesignSystemLabels();

    return (
        <header
            aria-label={labels.toolbar}
            className="@container relative flex h-13 min-w-0 items-center gap-1 px-3 sm:gap-2 sm:px-4"
        >
            <div className="[&_a]:focus-visible:ring-primary flex shrink-0 items-center [&_a]:rounded-sm [&_a]:outline-none [&_a]:focus-visible:ring-2">
                {brand}
            </div>
            <span aria-hidden="true" className="bg-base-300 mx-1 h-5 w-px shrink-0 max-sm:hidden" />
            <div className="flex min-w-0 flex-1 items-center gap-1">{title}</div>
            {search ? <div className="flex shrink-0">{search}</div> : null}
            {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
        </header>
    );
}

export interface TitleBarTrailItem {
    key: string;
    icon?: ReactNode;
    label: string;
    /** Makes the step a button, such as one switching to its siblings; `selectLabel` says where it leads. */
    onSelect?: () => void;
    selectLabel?: string;
}

/** The title bar's location, T3's "project / thread": each step muted and chevron-separated, the current one
 *  in the foreground. Steps that switch somewhere are buttons with a chevron. Narrow screens show only the
 *  current step. */
export function TitleBarTrail({ items }: { items: readonly TitleBarTrailItem[] }) {
    return (
        <ol className="flex min-w-0 items-center gap-0.5 text-sm">
            {items.map((item, index) => {
                const last = index === items.length - 1;
                const content = (
                    <>
                        {item.icon ? (
                            <span className="text-base-700 flex shrink-0 [&_svg]:size-4">{item.icon}</span>
                        ) : null}
                        <span className="truncate">{item.label}</span>
                    </>
                );

                return (
                    <li
                        key={item.key}
                        aria-current={last ? 'page' : undefined}
                        className={`flex min-w-0 items-center gap-0.5 ${last ? 'text-base-content font-medium' : 'text-base-700 hidden shrink-0 sm:flex'}`}
                    >
                        {index > 0 ? (
                            <span aria-hidden="true" className="text-base-500 flex shrink-0 [&>svg]:size-3.5">
                                <ChevronRightIcon />
                            </span>
                        ) : null}
                        {item.onSelect ? (
                            <button
                                {...tabbable}
                                type="button"
                                aria-haspopup="dialog"
                                aria-description={item.selectLabel}
                                title={item.selectLabel}
                                onClick={item.onSelect}
                                className="hover:bg-base-200 hover:text-base-content focus-visible:outline-primary dark:hover:bg-base-300 flex h-7 min-w-0 items-center gap-2 rounded-lg px-2 transition-colors focus-visible:outline-2"
                            >
                                {content}
                                <span aria-hidden="true" className="text-base-500 flex shrink-0 [&>svg]:size-3.5">
                                    <ChevronDownIcon />
                                </span>
                            </button>
                        ) : (
                            <span className="flex min-w-0 items-center gap-2 px-2">{content}</span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
