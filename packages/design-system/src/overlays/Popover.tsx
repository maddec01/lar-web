/* oxlint-disable react/only-export-components -- Compound members are exported through Popover. */

import {
    Popover as NinnaPopover,
    type PopoverArrowProps,
    type PopoverCloseProps,
    type PopoverContentProps,
    type PopoverTriggerProps,
} from '@ninna-ui/overlays';
import {
    type ComponentProps,
    type ForwardRefExoticComponent,
    forwardRef,
    type ReactNode,
    type RefAttributes,
} from 'react';

import { scrollFadeClassName, useScrollFade } from './useScrollFade';
import { windowGutterProps } from './WindowGutter';

/** A popover part's look is the design system's: its parts take no class or style. */
type Unstyled<Props> = Omit<Props, 'className' | 'color' | 'style'>;

interface PopoverContentPolicyProps extends Unstyled<PopoverContentProps> {
    /** `scroll` (the default) scrolls content past the window's height (or the `capped` height) in a region that fades
     *  where content runs past an edge; `fill` lets the content manage its own (and its own fade, as
     *  StatusPopoverContent does). */
    layout?: 'fill' | 'scroll';
    /** Runs as it opens; preventing its default keeps focus on the trigger. */
    onOpenAutoFocus?: (event: Event) => void;
    /** Runs as it closes; preventing its default keeps focus from returning to the trigger. */
    onCloseAutoFocus?: (event: Event) => void;
    /** `menu` pads it tightly for a list of choices; `flush` drops the padding, for content that runs to the edges,
     *  such as a PopoverHeader over rows; `default` pads it evenly. */
    presentation?: 'default' | 'menu' | 'flush';
    /** `sm` is 16rem and `md` 22rem, such as a chooser with a list; either stays inside the window. */
    width?: 'content' | 'sm' | 'md' | 'trigger';
    /** `window` (the default) grows to the room the window has; `capped` stops at 32rem, so a long status list scrolls
     *  inside a popover of a steady height. */
    height?: 'window' | 'capped';
}

type PopoverContentBaseProps = Omit<PopoverContentPolicyProps, 'width'> & {
    /** The design system's own sizing class, in place of a `width`. */
    className?: string;
};

const popoverWidthClasses: Record<NonNullable<PopoverContentPolicyProps['width']>, string | undefined> = {
    content: undefined,
    sm: 'w-64',
    md: 'w-88',
    trigger: 'w-(--radix-popover-trigger-width)',
};

/** The padding by presentation; with `layout="scroll"` it moves inside the scrolling region, so the fade reaches the
 *  box's edges while the box itself never fades. */
const presentationPadding = { default: 'p-4', menu: 'p-1', flush: 'p-0' } as const;

/** The scrolling region of a `scroll` popover: a hard cut never ends a long list, its edges fade instead. */
function PopoverScroll({ padding, children }: { padding: string; children: ReactNode }) {
    const { setViewport } = useScrollFade();

    return (
        <div
            ref={setViewport}
            data-slot="popover-scroll"
            className={`relative min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-[inherit] ${padding} ${scrollFadeClassName}`}
        >
            {children}
        </div>
    );
}

/** The popover content for the design system's own compositions, which may size it with a class. */
export const PopoverContentBase = forwardRef<HTMLDivElement, PopoverContentBaseProps>(
    ({ layout = 'scroll', presentation = 'default', height = 'window', className = '', children, ...props }, ref) => (
        <NinnaPopover.Content
            ref={ref}
            {...windowGutterProps}
            {...props}
            data-layout={layout}
            data-height={height}
            className={`${layout === 'scroll' ? 'p-0' : presentationPadding[presentation]} ${className}`}
        >
            {layout === 'scroll' ? (
                <PopoverScroll padding={presentationPadding[presentation]}>{children}</PopoverScroll>
            ) : (
                children
            )}
        </NinnaPopover.Content>
    ),
);

PopoverContentBase.displayName = 'PopoverContentBase';

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentPolicyProps>(({ width = 'content', ...props }, ref) => (
    <PopoverContentBase ref={ref} {...props} className={popoverWidthClasses[width]} />
));

PopoverContent.displayName = 'Popover.Content';

function PopoverRoot(props: ComponentProps<typeof NinnaPopover>) {
    return <NinnaPopover {...props} />;
}

const PopoverTrigger: ForwardRefExoticComponent<Unstyled<PopoverTriggerProps> & RefAttributes<HTMLButtonElement>> =
    NinnaPopover.Trigger;
const PopoverClose: ForwardRefExoticComponent<Unstyled<PopoverCloseProps> & RefAttributes<HTMLButtonElement>> =
    NinnaPopover.Close;
const PopoverArrow: ForwardRefExoticComponent<
    Omit<Unstyled<PopoverArrowProps>, 'radius'> & RefAttributes<SVGSVGElement>
> = NinnaPopover.Arrow;

export const Popover = Object.assign(PopoverRoot, {
    ...NinnaPopover,
    Trigger: PopoverTrigger,
    Close: PopoverClose,
    Arrow: PopoverArrow,
    Content: PopoverContent,
});
