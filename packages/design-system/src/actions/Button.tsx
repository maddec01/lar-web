import { Button as NinnaButton, type ButtonProps as NinnaButtonProps } from '@ninna-ui/primitives';
import { forwardRef, type ReactNode } from 'react';

import { SpinnerIcon } from '../feedback/Loading';
import { tabbable } from '../foundations/KeyboardFocus';
import { ghostRecipe, outlineRecipe, primaryRecipe } from './ButtonRecipes';

/** T3 Code's button (coss ui): an 8px-radius control, 36px on touch and 32px with a pointer, that dips to
 *  97% while pressed. Every recipe sets its own colours, so ninna-ui only supplies behaviour. */
const base =
    'gap-2 rounded-md border px-2.75 font-medium transition-[background-color,box-shadow,scale,color] duration-(--motion-duration-fast) active:scale-[0.97] focus-ring-inset disabled:opacity-64 [&_[data-slot=icon]>svg]:size-4';
/** The default `md` 36px (32px with a pointer) control, and the `sm` 28px one with 12px text that dense tools use. */
const sizes = { md: 'h-9 text-sm sm:h-8', sm: 'h-7 text-xs sm:h-7' } as const;
/** A label that would clip on a narrow surface wraps instead, growing the button past its height, which stays its
 *  size's height at least. */
const wrapping = {
    nowrap: 'whitespace-nowrap',
    wrap: 'h-auto max-w-full min-w-0 py-1 whitespace-normal wrap-anywhere sm:h-auto',
} as const;
const wrappingHeights = { md: 'min-h-9 sm:min-h-8', sm: 'min-h-7' } as const;

const outline = outlineRecipe;
const ghost = ghostRecipe;

const recipes = {
    primary: primaryRecipe,
    secondary: outline,
    quiet: ghost,
    row: `${ghost} h-auto min-h-8 min-w-0 max-w-full justify-start whitespace-normal px-0 py-1 text-left text-xs font-normal text-fg-muted hover:bg-transparent hover:text-fg sm:h-auto active:scale-100`,
    subtle: 'border-transparent bg-fill-muted text-fg hover:bg-fill-muted-hover',
    /** The primary colour tinted on the card, with no border or shadow, deeper on hover and while its popup is open. */
    tinted: 'border-transparent bg-primary-surface text-primary-fg shadow-none not-disabled:not-aria-disabled:hover:bg-primary-surface-hover data-[state=open]:bg-primary-surface-hover [&_[data-slot=icon]]:text-current',
    destructive:
        'border-danger-fill bg-danger-fill text-danger-on-fill shadow-(--shadow-raised) shadow-danger-ring inset-shadow-(--shadow-highlight) hover:bg-danger-fill-hover active:shadow-none',
    /** The quiet-destructive rule (docs/Introduction.mdx): a ghost in the danger text colour at rest, so it never reads
     *  as a neutral action, on the danger surface on hover or keyboard focus. */
    'destructive-quiet':
        'border-transparent text-danger-fg hover:bg-danger-surface focus-visible:bg-danger-surface [&_[data-slot=icon]]:text-current',
    choice: outline,
    context: `${ghost} h-11 min-w-0 gap-1.5 px-2 lg:max-w-48 lg:pointer-fine:h-8`,
    summary: `${ghost} h-7 min-w-0 px-1.5 sm:h-7`,
    avatar: 'size-7 rounded-full border-transparent p-0 hover:bg-transparent sm:h-7 [&>*]:size-7',
    status: 'h-4 min-w-0 max-w-full justify-start gap-1.5 rounded-sm border-transparent px-0 text-xs font-normal text-fg-muted hover:bg-transparent hover:text-fg sm:h-4 active:scale-100 [&>svg]:size-3 [&>svg]:shrink-0',
} as const;

/** An icon-only button is as wide as it is tall, with no padding. */
const square = { md: 'size-9 px-0 sm:size-8', sm: 'w-7 px-0' } as const;
const pending = 'aria-disabled:cursor-progress aria-disabled:opacity-70';
const heldDisabled = 'aria-disabled:opacity-64';

const selectedChoice =
    'border-primary-edge bg-primary-surface text-fg ring-1 ring-inset ring-primary-ring hover:bg-primary-surface-hover';

/** A button's look is its `variant` and size props, never a class of the caller's. */
export interface ButtonProps extends Omit<
    NinnaButtonProps,
    'color' | 'radius' | 'size' | 'variant' | 'className' | 'style'
> {
    /** The button's label. */
    children?: ReactNode;
    /** Its role among the buttons around it: `primary` (the default) for the one main action, `secondary`, `quiet`,
     *  `subtle`, `tinted`, `destructive`, `destructive-quiet`, `choice` for one of a set of options, and the dense
     *  tools' `row`, `context`, `summary`, `avatar` and `status`. `destructive-quiet` is the destructive ghost
     *  for every inline trigger that opens a confirmation (Delete, Abandon, Remove): danger text at rest, the danger
     *  surface on hover/focus. Solid `destructive` is reserved for the confirm action itself (ConfirmDialog's). */
    variant?: keyof typeof recipes;
    /** Drawn as the chosen one of a set (`aria-pressed`), such as a `choice` among options or a toggled tool. */
    selected?: boolean;
    /** An icon before the label (or alone, with `iconOnly`). */
    leftIcon?: ReactNode;
    /** An icon after the label, such as a menu's chevron. */
    rightIcon?: ReactNode;
    /** ninna-ui's own loading state: disabled, with its spinner. Prefer `busy`, which keeps the focus. */
    loading?: boolean;
    /** Fills its container's width, as a narrow form's stacked actions do. */
    fullWidth?: boolean;
    /** The native button type; `button` unless it submits a form. */
    type?: 'button' | 'submit' | 'reset';
    /** Out of reach, and drawn so. While an action runs, use `busy` instead. */
    disabled?: boolean;
    /** `md` (the default) is the 36px (32px with a pointer) control; `sm` the dense 28px one with 12px text, as Lar
     *  Factory's board draws every button. */
    size?: keyof typeof sizes;
    /** Lets a long label wrap, anywhere in a long word if it must, growing the button, which never grows past its
     *  container, where it would otherwise clip. */
    wrap?: boolean;
    /** A square button showing its `leftIcon` alone, named by its `aria-label`. */
    iconOnly?: boolean;
    /** Lets the button shrink in a crowded row: its label truncates, while its `mark` (a trailing character, such as ▾
     *  or ✓) stays. */
    shrinks?: boolean;
    /** A trailing character that stays while the label truncates, such as ▾ or ✓ (with `shrinks`). */
    mark?: string;
    /** Its action is in flight: a spinner, turning even under reduced motion, takes its left icon's place, and it reads
     *  as busy. `false` leaves out the busy state altogether. */
    busy?: boolean;
    /** Draws the button as waiting, with the progress cursor at 70%, while `aria-disabled` holds it for an action in
     *  flight; `'disabled'` draws it as a disabled button instead, while it keeps its focus (a save with nothing to
     *  save, say). */
    pendingLook?: boolean | 'disabled';
}

type ButtonBaseProps = ButtonProps & Pick<NinnaButtonProps, 'className' | 'style'>;

/** The button for the design system's own compositions, which may fit it to their layout with a class. */
export const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
    (
        {
            variant = 'primary',
            selected,
            size = 'md',
            wrap = false,
            iconOnly = false,
            shrinks = false,
            mark,
            busy,
            pendingLook = false,
            onClick,
            onKeyDown,
            className = '',
            children,
            leftIcon,
            rightIcon,
            ...props
        },
        ref,
    ) => {
        const context = variant === 'context';
        const held = busy || props['aria-disabled'] === true || props['aria-disabled'] === 'true';

        return (
            <NinnaButton
                ref={ref}
                {...tabbable}
                {...props}
                size="sm"
                radius="lg"
                variant="ghost"
                color="neutral"
                aria-disabled={held || props['aria-disabled']}
                onClick={(event) => {
                    if (held) {
                        event.preventDefault();
                        event.stopPropagation();

                        return;
                    }

                    onClick?.(event);
                }}
                onKeyDown={(event) => {
                    if (held && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        event.stopPropagation();

                        return;
                    }

                    onKeyDown?.(event);
                }}
                aria-pressed={selected ?? props['aria-pressed']}
                {...(busy === undefined ? {} : { 'aria-busy': busy || undefined })}
                data-wrap={wrap || undefined}
                data-settings-edge={variant === 'quiet' || variant === 'destructive-quiet' ? 'ghost' : undefined}
                {...(iconOnly ? { 'data-icon-only': '' } : {})}
                className={`${base} ${sizes[size]} ${wrap ? `${wrapping.wrap} ${wrappingHeights[size]}` : wrapping.nowrap} ${variant === 'choice' && selected ? selectedChoice : recipes[variant]} ${selected && variant !== 'choice' ? 'bg-fill-selected' : ''} ${iconOnly ? square[size] : ''} ${shrinks ? 'max-w-full min-w-0 shrink' : ''} ${pendingLook === 'disabled' ? heldDisabled : pendingLook ? pending : ''} ${className}`}
                leftIcon={
                    busy ? (
                        <SpinnerIcon motion="always" className="size-4" />
                    ) : context ? (
                        <span className="text-(--color-header-icon) [&>svg]:size-4">{leftIcon}</span>
                    ) : (
                        leftIcon
                    )
                }
                rightIcon={context ? <span className="text-fg-muted [&>svg]:size-3.5">{rightIcon}</span> : rightIcon}
            >
                {iconOnly ? null : context ? (
                    <span className="truncate">{children}</span>
                ) : shrinks ? (
                    <>
                        <span className="truncate">{children}</span>
                        {mark !== undefined && <> {mark}</>}
                    </>
                ) : (
                    children
                )}
            </NinnaButton>
        );
    },
);

ButtonBase.displayName = 'ButtonBase';

/** T3 Code's button, in one of Lar's recipes. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => <ButtonBase ref={ref} {...props} />);

Button.displayName = 'Button';
