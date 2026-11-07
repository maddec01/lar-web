import { ChevronDownIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';

import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { DropdownMenu } from '../overlays/DropdownMenu';

interface CollectionBrowseSelectorProps extends Pick<ComponentPropsWithoutRef<'button'>, 'aria-label'> {
    children: ReactNode;
    label: string;
    icon?: ReactNode;
    active?: boolean;
}

interface CollectionBrowseTriggerProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'> {
    label: string;
    icon?: ReactNode;
    active?: boolean;
}

export const CollectionBrowseTrigger = forwardRef<HTMLButtonElement, CollectionBrowseTriggerProps>(
    ({ label, icon, active = false, ...props }, ref) => (
        <Button
            ref={ref}
            {...props}
            aria-label={props['aria-label'] ?? label}
            title={label}
            className="data-[state=open]:bg-base-200 max-w-full min-w-0 gap-1.5 px-2 [&>svg]:size-3.5 [&>svg]:shrink-0"
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
}: {
    children: ReactNode;
    count: ReactNode;
    countLabel: string;
    filters?: ReactNode;
}) {
    return (
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1">
                {children}
                <Badge aria-label={countLabel} tone="neutral" radius="md" className="max-w-20 shrink-0 tabular-nums">
                    <span className="truncate">{count}</span>
                </Badge>
            </div>
            {filters ? <div className="flex min-w-0 items-center gap-1 [&>button]:max-w-48">{filters}</div> : null}
        </div>
    );
}
