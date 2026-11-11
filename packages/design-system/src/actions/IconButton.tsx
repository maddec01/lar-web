import { IconButton as NinnaIconButton, type IconButtonProps as NinnaIconButtonProps } from '@ninna-ui/primitives';
import { forwardRef, type ReactNode } from 'react';

import { SpinnerIcon } from '../feedback/Loading';
import { StatusIndicatorBase, type StatusTone } from '../feedback/StatusIndicator';
import { tabbable } from '../foundations/KeyboardFocus';

/** An icon button's look is its variant and tone, never a class or style of the caller's. */
export interface IconButtonProps extends Omit<
    NinnaIconButtonProps,
    'color' | 'radius' | 'size' | 'variant' | 'icon' | 'className' | 'style'
> {
    /** The icon it shows; its `aria-label` names it. */
    icon: ReactNode;
    /** Where it sits: `quiet` (default) a 32px ghost button, `header` a pane's or dialog's header (a dialog's close),
     *  28px with a 16px muted icon, `title-bar` the title bar's 28px row with 16px icons in the header's icon colour,
     *  `inline` a 20px control inside a line of text. */
    variant?: 'header' | 'quiet' | 'title-bar' | 'inline';
    /** A status tone; `danger` follows the quiet-destructive rule: the danger colour at rest, on the danger surface on
     *  hover or keyboard focus. */
    tone?: StatusTone | 'accent';
    /** Something waiting behind it, such as an update: a warning light on its corner, and this text as its
     *  accessible description. */
    notification?: string;
    /** Its action is in flight: a spinner takes the icon's place, it reads as busy and ignores presses, keeping the
     *  focus. `false` leaves out the busy state altogether. */
    busy?: boolean;
    /** Like `busy`, as ninna-ui draws it, for a button whose action it doesn't start itself. */
    loading?: boolean;
}

type IconButtonBaseProps = IconButtonProps & Pick<NinnaIconButtonProps, 'className' | 'style'>;

/** The icon button for the design system's own compositions, which may fit it to their layout with a class. */
export const IconButtonBase = forwardRef<HTMLButtonElement, IconButtonBaseProps>(
    (
        { variant = 'quiet', tone = 'neutral', className = '', notification, icon, busy, onClick, onKeyDown, ...props },
        ref,
    ) => (
        <NinnaIconButton
            ref={ref}
            {...tabbable}
            aria-description={notification}
            {...props}
            {...(busy === undefined ? {} : { 'aria-busy': busy || props.loading || undefined })}
            aria-disabled={busy || props['aria-disabled']}
            onClick={(event) => {
                if (busy || props['aria-disabled'] === true || props['aria-disabled'] === 'true') {
                    event.preventDefault();
                    event.stopPropagation();

                    return;
                }

                onClick?.(event);
            }}
            onKeyDown={(event) => {
                if (
                    (busy || props['aria-disabled'] === true || props['aria-disabled'] === 'true') &&
                    (event.key === 'Enter' || event.key === ' ')
                ) {
                    event.preventDefault();
                    event.stopPropagation();

                    return;
                }

                onKeyDown?.(event);
            }}
            icon={
                busy ? (
                    <SpinnerIcon motion="always" />
                ) : notification ? (
                    <span className="relative block size-full">
                        {icon}
                        <StatusIndicatorBase
                            tone="warning"
                            size="sm"
                            overlay
                            className="absolute -top-0.5 -right-0.5"
                        />
                    </span>
                ) : (
                    icon
                )
            }
            variant="ghost"
            color={tone === 'accent' ? 'primary' : tone === 'danger' ? 'neutral' : tone}
            size="sm"
            radius="lg"
            className={
                // T3 Code's ghost icon button: muted until hovered, on an accent fill.
                (variant === 'header'
                    ? 'text-fg-muted hover:bg-fill-hover hover:text-fg data-[state=open]:bg-fill-hover data-[state=open]:text-fg size-7 rounded-md p-0 before:-inset-1.5 **:data-[slot=icon]:size-4 '
                    : variant === 'title-bar'
                      ? // The title bar's 28px row of controls, with 16px icons in the header's icon colour, like its
                        // status items and menu buttons.
                        'hover:bg-fill-hover hover:text-fg data-[state=open]:bg-fill-hover data-[state=open]:text-fg size-7 rounded-md p-0 text-(--color-header-icon) before:-inset-1.5 **:data-[slot=icon]:size-4 '
                      : variant === 'inline'
                        ? // A 20px control inside a line of text, such as the pencil beside a list of labels, with a 12px icon.
                          'text-fg-muted hover:bg-fill-hover grid size-5 place-items-center rounded-xs p-0 disabled:opacity-50 disabled:hover:bg-transparent **:data-[slot=icon]:size-3 '
                        : tone === 'danger'
                          ? 'text-danger-fg hover:bg-danger-surface focus-visible:bg-danger-surface rounded-md '
                          : tone === 'neutral'
                            ? 'text-fg-muted hover:bg-fill-hover hover:text-fg data-[state=open]:bg-fill-hover rounded-md '
                            : 'rounded-md ') +
                'data-[state=open]:bg-fill-hover! data-[state=open]:text-fg! aria-pressed:bg-fill-hover! aria-pressed:text-fg! transition-[background-color,color,scale] duration-(--motion-duration-fast) active:scale-[0.97] [&_svg]:size-full ' +
                (tone === 'danger'
                    ? 'text-danger-fg! hover:bg-danger-surface! focus-visible:bg-danger-surface! '
                    : '') +
                className
            }
        />
    ),
);

IconButtonBase.displayName = 'IconButtonBase';

/** A square button that shows an icon alone, named by its `aria-label`: T3 Code's ghost icon button. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => (
    <IconButtonBase ref={ref} {...props} />
));

IconButton.displayName = 'IconButton';
