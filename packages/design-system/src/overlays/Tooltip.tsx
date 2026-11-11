import { Tooltip as NinnaTooltip, type TooltipContentProps, type TooltipTriggerProps } from '@ninna-ui/overlays';
import { Slot, TooltipEngine } from '@ninna-ui/react-internal';
import {
    type ComponentProps,
    type ComponentPropsWithoutRef,
    type FocusEvent,
    forwardRef,
    isValidElement,
    type ReactNode,
} from 'react';

import { isFocusReturn } from './FocusReturn';

interface TooltipProviderProps {
    /** The tooltips that share the delay. */
    children: ReactNode;
    /** How long, in milliseconds, the pointer rests on a trigger before its tooltip opens. */
    delayDuration?: number;
    /** How long, in milliseconds, after one tooltip closes another opens at once, without the delay. */
    skipDelayDuration?: number;
    /** Closes a tooltip as the pointer leaves its trigger, even onto the tooltip. */
    disableHoverableContent?: boolean;
}

/** Shares one open delay across the tooltips inside it. */
export function TooltipProvider(props: TooltipProviderProps & ComponentProps<typeof TooltipEngine.Provider>) {
    return <TooltipEngine.Provider {...props} />;
}

interface TooltipProps {
    /** The trigger and its popup: a TooltipTrigger and a TooltipPopup. */
    children: ReactNode;
    /** Shown, for a controlled tooltip. */
    open?: boolean;
    /** Shown at first, for an uncontrolled tooltip. */
    defaultOpen?: boolean;
    /** Called as the tooltip opens or closes. */
    onOpenChange?: (open: boolean) => void;
    /** How long, in milliseconds, the pointer rests on the trigger before the tooltip opens. */
    delayDuration?: number;
    /** Never opens, such as while the control it explains is busy. */
    disabled?: boolean;
}

/** A short label for a control, shown on hover and keyboard focus. */
export function Tooltip({ disabled, ...props }: TooltipProps & ComponentProps<typeof TooltipEngine.Root>) {
    return <TooltipEngine.Root {...props} open={disabled ? false : props.open} />;
}

type TooltipTriggerPublicProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'color' | 'style'> & {
    /** Makes its only child, such as an IconButton, the trigger, instead of wrapping it in a button. */
    asChild?: boolean;
    /** The control the tooltip explains. */
    children?: ReactNode;
};

/** Focus a closing menu, popover or dialog hands back to the trigger doesn't open its tooltip (the engine skips a
 *  focus whose default is prevented); hover and focus the reader moves still do. */
function skipReturnedFocus(onFocus?: (event: FocusEvent<HTMLButtonElement>) => void) {
    return (event: FocusEvent<HTMLButtonElement>) => {
        onFocus?.(event);

        if (isFocusReturn()) event.preventDefault();
    };
}

/** What opens the tooltip on hover or keyboard focus, never on the focus an overlay hands back as it closes: a
 *  disabled control still does, through a focusable wrapper. */
export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerPublicProps>(
    ({ asChild, children, onFocus, ...props }, ref) => {
        const childProps = asChild && isValidElement<TooltipTriggerProps>(children) ? children.props : undefined;

        if (props.disabled || childProps?.disabled) {
            const Trigger = asChild ? Slot : 'button';

            return (
                <NinnaTooltip.Trigger asChild onFocus={skipReturnedFocus()}>
                    <span
                        tabIndex={0}
                        role="button"
                        aria-disabled="true"
                        aria-label={props['aria-label'] ?? childProps?.['aria-label']}
                        aria-labelledby={props['aria-labelledby'] ?? childProps?.['aria-labelledby']}
                        className="inline-flex [&>*]:pointer-events-none"
                    >
                        <Trigger type="button" {...props} onFocus={onFocus} ref={ref}>
                            {children}
                        </Trigger>
                    </span>
                </NinnaTooltip.Trigger>
            );
        }

        return (
            <NinnaTooltip.Trigger {...props} onFocus={skipReturnedFocus(onFocus)} ref={ref} asChild={asChild}>
                {children}
            </NinnaTooltip.Trigger>
        );
    },
);

TooltipTrigger.displayName = 'TooltipTrigger';

/** The bare trigger, for a composition that keeps its own native control mounted as it is enabled and disabled
 *  (TooltipTrigger wraps a disabled control instead): `asChild` makes its only child the trigger. */
export const TooltipTriggerBase = forwardRef<
    HTMLButtonElement,
    Omit<ComponentPropsWithoutRef<'button'>, 'color'> & { asChild?: boolean }
>((props, ref) => <TooltipEngine.Trigger {...props} ref={ref} />);

TooltipTriggerBase.displayName = 'TooltipTriggerBase';

type TooltipPopupProps = Omit<TooltipContentProps, 'className' | 'color' | 'hasArrow' | 'style'> & {
    /** The tooltip's text. */
    children?: ReactNode;
    /** The side of the trigger it opens on; `top` by default. */
    side?: TooltipContentProps['side'];
    /** How far from the trigger it opens, in pixels. */
    sideOffset?: number;
    /** How it lines up with the trigger along that side; `center` by default. */
    align?: TooltipContentProps['align'];
    /** Moves it to stay inside the window; on by default. */
    avoidCollisions?: boolean;
};

interface TooltipPopupBaseProps extends TooltipPopupProps {
    /** The design system's own layout on the popup, such as a wider measure for a long note. */
    className?: string;
}

/** A tooltip keeps 8px from the window's edges (half a popup's page gutter, as it is smaller and closer to its
 *  trigger): one by a window's edge, such as Settings at a title bar's end, shifts along it rather than touching it. */
const tooltipGutterProps: object = { collisionPadding: 8 };

/** The popup for the design system's own compositions, which may fit it to their layout with a class. */
export const TooltipPopupBase = forwardRef<HTMLDivElement, TooltipPopupBaseProps>((props, ref) => (
    <NinnaTooltip.Content {...tooltipGutterProps} {...props} ref={ref} />
));

TooltipPopupBase.displayName = 'TooltipPopupBase';

/** The tooltip's text, beside its trigger. */
export const TooltipPopup = forwardRef<HTMLDivElement, TooltipPopupProps>((props, ref) => (
    <TooltipPopupBase {...props} ref={ref} />
));

TooltipPopup.displayName = 'TooltipPopup';
