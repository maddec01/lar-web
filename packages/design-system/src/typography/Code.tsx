import { Code as NinnaCode, type CodeProps as NinnaCodeProps } from '@ninna-ui/primitives';
import { forwardRef, type ReactNode } from 'react';

const wrapping = { anywhere: 'break-all', never: 'whitespace-nowrap' } as const;

/** Inline code's look is the chip or its `wrap`, never a class of the caller's. */
export interface CodeProps extends Omit<NinnaCodeProps, 'className' | 'style' | 'color' | 'size'> {
    /** The code: a path, a command or a value. */
    children?: ReactNode;
    /** A path or command inside a sentence, in the page's plain inline code with no chip: a path may break `anywhere`,
     *  a command `never`. Without it, the code chip. */
    wrap?: keyof typeof wrapping;
}

/** Inline code: ninna-ui's code chip, or with `wrap`, plain inline code that breaks anywhere or never. */
export const Code = forwardRef<HTMLElement, CodeProps>(({ wrap, ...props }, ref) => {
    if (wrap)
        return (
            <code ref={ref} className={wrapping[wrap]}>
                {props.children}
            </code>
        );

    return <NinnaCode ref={ref} {...props} />;
});

Code.displayName = 'Code';
