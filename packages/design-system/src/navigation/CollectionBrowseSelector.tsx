import { ChevronDownIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';

import { ButtonBase as Button } from '../actions/Button';
import { Count } from '../display/Count';
import { DropdownMenu } from '../overlays/DropdownMenu';

interface CollectionBrowseSelectorProps extends Pick<ComponentPropsWithoutRef<'button'>, 'aria-label'> {
    /** The menu's choices, as DropdownMenu items. */
    children: ReactNode;
    /** What is browsed now, such as "All genres": the trigger's text and accessible name. */
    label: string;
    /** An icon that stands for the label on a phone, where the label hides. */
    icon?: ReactNode;
    /** A filter is applied: the trigger shows selected, with a dot on a phone. */
    active?: boolean;
    /** `toolbar` (the default) is a quiet button in a toolbar row, its text optically on the row's edge and a fill on
     *  hover and while open. `inline` is a ghost for a choice on the page itself, such as a search's scope under the
     *  page title: no fill ever (a fill would poke past the page's gutter), its text on the gutter, the words
     *  brightening and the chevron turning while open. */
    presentation?: 'toolbar' | 'inline';
}

interface CollectionBrowseTriggerProps extends Omit<
    ComponentPropsWithoutRef<'button'>,
    'children' | 'className' | 'color' | 'style'
> {
    /** What is browsed now, such as "All genres": the trigger's text and accessible name. */
    label: string;
    /** An icon that stands for the label on a phone, where the label hides. */
    icon?: ReactNode;
    /** A filter is applied: the trigger shows selected, with a dot on a phone. */
    active?: boolean;
    /** `toolbar` (the default) or `inline`, the ghost for a choice on the page itself; see CollectionBrowseSelector. */
    presentation?: 'toolbar' | 'inline';
}

const triggerLooks = {
    toolbar: 'data-[state=open]:bg-fill-hover -ml-2 px-2',
    inline: 'text-fg-soft hover:text-fg data-[state=open]:text-fg px-0 hover:bg-transparent active:scale-100 data-[state=open]:[&>svg]:rotate-180 aria-pressed:bg-transparent aria-pressed:text-primary-fg [&>svg]:transition-transform',
} as const;

export const CollectionBrowseTrigger = forwardRef<HTMLButtonElement, CollectionBrowseTriggerProps>(
    ({ label, icon, active = false, presentation = 'toolbar', ...props }, ref) => (
        <Button
            ref={ref}
            {...props}
            aria-label={props['aria-label'] ?? label}
            title={label}
            className={`max-w-full min-w-0 gap-1.5 [&>svg]:size-3.5 [&>svg]:shrink-0 ${triggerLooks[presentation]}`}
            selected={active}
            variant="quiet"
        >
            {icon ? (
                <span aria-hidden="true" className="size-4 shrink-0 [&>svg]:size-full">
                    {icon}
                </span>
            ) : null}
            <span className={icon ? 'hidden truncate sm:block' : 'truncate'}>{label}</span>
            {icon ? (
                <span aria-hidden="true" className="hidden size-3.5 shrink-0 sm:block [&>svg]:size-full">
                    <ChevronDownIcon />
                </span>
            ) : (
                <ChevronDownIcon />
            )}
            {active ? (
                <span
                    aria-hidden="true"
                    className="bg-primary absolute top-1 right-1 size-1.5 rounded-full sm:hidden"
                />
            ) : null}
        </Button>
    ),
);

CollectionBrowseTrigger.displayName = 'CollectionBrowseTrigger';

export function CollectionBrowseSelector({ children, ...trigger }: CollectionBrowseSelectorProps) {
    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <CollectionBrowseTrigger {...trigger} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">{children}</DropdownMenu.Content>
        </DropdownMenu>
    );
}

export function CollectionBrowseControls({
    children,
    count,
    countLabel,
    filters,
    loading,
}: {
    /** The browse selector, at the row's start. */
    children: ReactNode;
    /** How many items show, as a figure. */
    count?: ReactNode;
    /** Hide the count until the collection has loaded. */
    loading?: boolean;
    /** The count in words for screen readers, such as "312 albums". */
    countLabel: string;
    /** Further controls at the row's end, such as a sort menu and a view toggle. */
    filters?: ReactNode;
}) {
    return (
        <div className="flex w-full min-w-0 flex-1 items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1">
                {children}
                <Count count={count} label={countLabel} loading={loading} />
            </div>
            {filters ? <div className="flex min-w-0 items-center gap-1 [&>button]:max-w-48">{filters}</div> : null}
        </div>
    );
}
