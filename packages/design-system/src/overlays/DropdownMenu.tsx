/* oxlint-disable react/only-export-components -- Compound members are exported through DropdownMenu. */

import {
    DropdownMenu as NinnaDropdownMenu,
    type DropdownMenuCheckboxItemProps,
    type DropdownMenuContentProps,
    type DropdownMenuGroupProps,
    type DropdownMenuItemProps,
    type DropdownMenuLabelProps,
    type DropdownMenuRadioGroupProps,
    type DropdownMenuRadioItemProps,
    type DropdownMenuSeparatorProps,
    type DropdownMenuSubContentProps,
    type DropdownMenuSubTriggerProps,
    type DropdownMenuTriggerProps,
} from '@ninna-ui/overlays';
import { CheckIcon } from 'lucide-react';
import {
    type ComponentProps,
    createContext,
    type ForwardRefExoticComponent,
    forwardRef,
    type ReactNode,
    type RefAttributes,
    useContext,
    useId,
    useLayoutEffect,
    useState,
} from 'react';

import { segment, segmentTrack } from '../actions/SegmentRecipes';
import { StatusIndicator } from '../feedback/StatusIndicator';
import type { StatusColour } from '../feedback/StatusState';

/** A menu part's look is the design system's: its parts take no class or style. */
type Unstyled<Props> = Omit<Props, 'className' | 'color' | 'style'>;

import { quietFocusReturn } from './FocusReturn';
import { useInertBackground } from './InertBackground';
import { scrollFadeClassName, useScrollFade } from './useScrollFade';
import { windowGutterProps } from './WindowGutter';

interface DropdownMenuContentPolicyProps extends Unstyled<DropdownMenuContentProps> {
    /** `sm` is 15rem (the default), `md` 16rem, for longer entries; either stays inside the window. */
    width?: 'sm' | 'md' | 'lg';
    /** Keep long model/account menus at a steady height with their choices scrolling. */
    height?: 'window' | 'capped';
}

const contentWidthClasses: Record<NonNullable<DropdownMenuContentPolicyProps['width']>, string> = {
    sm: 'w-60',
    md: 'w-64',
    lg: 'w-88',
};

/** The menu's scrolling region: a long menu fades where its entries run past an edge, never a hard cut, while the
 *  glass box itself stays whole. */
function MenuScroll({ children }: { children: ReactNode }) {
    const { setViewport } = useScrollFade();

    return (
        <div
            ref={setViewport}
            data-slot="menu-scroll"
            className={`relative min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-[inherit] p-1 ${scrollFadeClassName}`}
        >
            {children}
        </div>
    );
}

/** Where a menu's Status registers its id, so the menu is described by it. */
const MenuStatusContext = createContext<(id: string | undefined) => void>(() => {});

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentPolicyProps>(
    ({ side = 'bottom', sideOffset = 8, width = 'sm', height = 'window', children, ...props }, ref) => {
        const [statusId, setStatusId] = useState<string>();

        return (
            <NinnaDropdownMenu.Content
                ref={ref}
                {...windowGutterProps}
                side={side}
                sideOffset={sideOffset}
                aria-describedby={statusId}
                {...props}
                {...quietFocusReturn(props)}
                className={`${contentWidthClasses[width]} ${height === 'capped' ? 'max-h-[min(32rem,var(--radix-dropdown-menu-content-available-height))]' : 'max-h-(--radix-dropdown-menu-content-available-height)'} flex max-w-[calc(100vw-2rem)] flex-col overflow-clip p-0`}
            >
                <MenuStatusContext value={setStatusId}>
                    <MenuScroll>{children}</MenuScroll>
                </MenuStatusContext>
            </NinnaDropdownMenu.Content>
        );
    },
);

DropdownMenuContent.displayName = 'DropdownMenu.Content';

interface DropdownMenuLabelPolicyProps extends Unstyled<DropdownMenuLabelProps> {
    /** `section` heads a group of entries in small capitals; `identity` names who is signed in, in plain case. */
    presentation?: 'section' | 'identity';
}

const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelPolicyProps>(
    ({ presentation = 'section', ...props }, ref) => (
        <NinnaDropdownMenu.Label
            ref={ref}
            {...props}
            className={presentation === 'identity' ? 'tracking-normal normal-case' : undefined}
        />
    ),
);

DropdownMenuLabel.displayName = 'DropdownMenu.Label';

/** A menu's entries either all lead with an icon or none do, across the whole menu (identity labels and control rows
 *  aside): a lone icon, such as only "Sign out" with one, reads as a different kind of entry. Leave icons out unless
 *  every entry has one. */
interface DropdownMenuItemPolicyProps extends Unstyled<DropdownMenuItemProps> {
    /** Opens a destructive confirmation (the quiet-destructive rule): danger text at rest, on the danger surface while
     *  hovered or highlighted. */
    destructive?: boolean;
    /** Forward the underlying menu item's behavior to a link without a second tab stop. */
    asChild?: boolean;
}

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemPolicyProps>(({ destructive, ...props }, ref) => (
    <NinnaDropdownMenu.Item
        ref={ref}
        {...props}
        data-destructive-trigger={destructive || undefined}
        className="aria-[current=page]:bg-primary-surface aria-[current=page]:text-primary-fg max-lg:min-h-11 pointer-coarse:min-h-11 [&>svg]:size-4 [&>svg]:shrink-0"
    />
));

DropdownMenuItem.displayName = 'DropdownMenu.Item';

/** The tick at the end of a chosen radio or checkbox entry. Every such entry keeps its room, so labels line up; the
 *  chosen ones show it in the accent colour. Selection is never a fill alone, which reads as the pointer's highlight. */
function MenuCheck() {
    return (
        <span
            aria-hidden="true"
            data-slot="menu-check"
            className="text-primary-fg invisible ml-auto flex size-4 shrink-0 items-center group-data-[state=checked]:visible [&>svg]:size-4"
        >
            <CheckIcon />
        </span>
    );
}

const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, Unstyled<DropdownMenuCheckboxItemProps>>(
    ({ children, ...props }, ref) => (
        <NinnaDropdownMenu.CheckboxItem
            ref={ref}
            {...props}
            data-presentation="default"
            className="group max-lg:min-h-11 pointer-coarse:min-h-11 [&>svg]:size-4 [&>svg]:shrink-0"
        >
            {children}
            <MenuCheck />
        </NinnaDropdownMenu.CheckboxItem>
    ),
);

DropdownMenuCheckboxItem.displayName = 'DropdownMenu.CheckboxItem';

/** A group's heading, read as the group's name: a section label over its entries. */
function GroupLabel({ id, label }: { id: string; label: string }) {
    return <NinnaDropdownMenu.Label id={id}>{label}</NinnaDropdownMenu.Label>;
}

interface DropdownMenuGroupPolicyProps extends Unstyled<DropdownMenuGroupProps> {
    /** The group's heading, such as "Show", which also names it for screen readers. */
    label?: string;
}

const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupPolicyProps>(({ label, ...props }, ref) => {
    const labelId = useId();

    return (
        <>
            {label ? <GroupLabel id={labelId} label={label} /> : null}
            <NinnaDropdownMenu.Group ref={ref} aria-labelledby={label ? labelId : undefined} {...props} />
        </>
    );
});

DropdownMenuGroup.displayName = 'DropdownMenu.Group';

interface DropdownMenuRadioGroupPolicyProps extends Unstyled<DropdownMenuRadioGroupProps> {
    /** `segmented` lays its choices side by side as icon segments in ThemeSwitch's pill, such as the theme choice
     *  (ThemeSwitch `placement="menu"` is that, ready made); `default` lists them. */
    presentation?: 'default' | 'segmented';
    /** The group's heading, such as "Sort by" or "Order", which also names it for screen readers. */
    label?: string;
}

const DropdownMenuRadioGroup = forwardRef<HTMLDivElement, DropdownMenuRadioGroupPolicyProps>(
    ({ presentation = 'default', label, ...props }, ref) => {
        const labelId = useId();

        return (
            <>
                {label ? <GroupLabel id={labelId} label={label} /> : null}
                <NinnaDropdownMenu.RadioGroup
                    ref={ref}
                    aria-labelledby={label ? labelId : undefined}
                    {...props}
                    className={presentation === 'segmented' ? segmentTrack : undefined}
                />
            </>
        );
    },
);

DropdownMenuRadioGroup.displayName = 'DropdownMenu.RadioGroup';

interface DropdownMenuRadioItemPolicyProps extends Unstyled<DropdownMenuRadioItemProps> {
    /** `segmented` for a choice inside a segmented group, which keeps the menu open as it is chosen. */
    presentation?: 'default' | 'segmented';
}

const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemPolicyProps>(
    ({ onSelect, presentation = 'default', children, ...props }, ref) => (
        <NinnaDropdownMenu.RadioItem
            ref={ref}
            {...props}
            data-presentation={presentation}
            onSelect={
                presentation === 'segmented'
                    ? (event) => {
                          event.preventDefault();
                          onSelect?.(event);
                      }
                    : onSelect
            }
            className={
                presentation === 'segmented'
                    ? segment.menuItem
                    : 'group max-lg:min-h-11 pointer-coarse:min-h-11 [&>svg]:size-4 [&>svg]:shrink-0'
            }
        >
            {children}
            {presentation === 'segmented' ? null : <MenuCheck />}
        </NinnaDropdownMenu.RadioItem>
    ),
);

DropdownMenuRadioItem.displayName = 'DropdownMenu.RadioItem';

/** A row of the menu with a control at its end, such as the account menu's Appearance segmented choice: the label
 *  and the control keep the entries' 12px inset from the menu's edges (never the menu's own 4px), so the control
 *  lines up with the entries' text and ticks above and below it. */
function DropdownMenuControlRow({
    label,
    children,
}: {
    /** The row's name, such as "Appearance". */
    label: ReactNode;
    /** The control at the row's end, such as a `segmented` RadioGroup (which names itself with `aria-label`). */
    children: ReactNode;
}) {
    return (
        <div data-slot="menu-control-row" className="flex min-h-9 items-center justify-between gap-3 px-2 py-0.5">
            <span className="text-fg min-w-0 truncate text-(length:--text-ui) font-medium">{label}</span>
            {children}
        </div>
    );
}

/** The menu's first row when what it acts on is in a state worth knowing before choosing, such as a library that is
 *  scanning: a status light in the entries' icon slot, the state in words and an optional detail, then a separator.
 *  It is not an entry (never a disabled item standing in for a status) and it describes the menu to a screen reader. */
function DropdownMenuStatus({
    label,
    detail,
    ...colour
}: StatusColour & {
    /** The state in words, such as "Scanning". */
    label: string;
    /** A smaller line under it, such as "1,204 of 3,310 files". */
    detail?: ReactNode;
}) {
    const id = useId();
    const register = useContext(MenuStatusContext);

    useLayoutEffect(() => {
        register(id);

        return () => register(undefined);
    }, [id, register]);

    return (
        <>
            <div id={id} data-slot="menu-status" className="flex min-w-0 items-start gap-2 px-2 py-1.5">
                <span className="flex h-5 w-4 shrink-0 items-center justify-center">
                    <StatusIndicator {...colour} />
                </span>
                <span className="min-w-0 flex-1 text-(length:--text-ui) leading-5">
                    <span className="text-fg block font-medium wrap-break-word">{label}</span>
                    {detail ? <span className="text-fg-muted block text-xs wrap-break-word">{detail}</span> : null}
                </span>
            </div>
            <NinnaDropdownMenu.Separator />
        </>
    );
}

/** An entry's label, truncating to the menu's width, with an optional smaller `detail` line under it. */
function DropdownMenuItemText({
    children,
    detail,
}: {
    /** The entry's label. */
    children: ReactNode;
    /** A smaller line under the label, such as an account's address. */
    detail?: ReactNode;
}) {
    return (
        <span className="min-w-0 flex-1 truncate">
            {children}
            {detail && <span className="block truncate text-xs font-normal">{detail}</span>}
        </span>
    );
}

function DropdownMenuRoot(props: ComponentProps<typeof NinnaDropdownMenu>) {
    useInertBackground();

    return <NinnaDropdownMenu {...props} />;
}

type Part<Props, Element> = ForwardRefExoticComponent<Unstyled<Props> & RefAttributes<Element>>;

const DropdownMenuTrigger: Part<DropdownMenuTriggerProps, HTMLButtonElement> = NinnaDropdownMenu.Trigger;
const DropdownMenuSeparator: Part<DropdownMenuSeparatorProps, HTMLDivElement> = NinnaDropdownMenu.Separator;
const DropdownMenuSubTrigger: Part<DropdownMenuSubTriggerProps, HTMLDivElement> = NinnaDropdownMenu.SubTrigger;
const DropdownMenuSubContent: Part<DropdownMenuSubContentProps, HTMLDivElement> = NinnaDropdownMenu.SubContent;

export const DropdownMenu = Object.assign(DropdownMenuRoot, NinnaDropdownMenu, {
    Trigger: DropdownMenuTrigger,
    CheckboxItem: DropdownMenuCheckboxItem,
    Separator: DropdownMenuSeparator,
    Group: DropdownMenuGroup,
    SubTrigger: DropdownMenuSubTrigger,
    SubContent: DropdownMenuSubContent,
    Content: DropdownMenuContent,
    Item: DropdownMenuItem,
    Label: DropdownMenuLabel,
    RadioGroup: DropdownMenuRadioGroup,
    RadioItem: DropdownMenuRadioItem,
    ItemText: DropdownMenuItemText,
    ControlRow: DropdownMenuControlRow,
    Status: DropdownMenuStatus,
});
