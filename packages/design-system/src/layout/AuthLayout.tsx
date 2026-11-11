import { type ReactNode, useId } from 'react';

import { Heading, Text } from '../typography/Typography';
import { StackBase } from './Flow';
import { ProductLockup } from './toolbar/HomeLockup';

/** The product hues a halo comes in (theme.css's halo-* recipes): Factory amber, Server and Account navy. */
const halos = { factory: 'halo-factory', server: 'halo-server', account: 'halo-account' } as const;

interface AuthLayoutProps {
    /** The lockup's accessible name, such as "Lar Server" (a `window` card's; under a title bar the bar names it). */
    brandLabel: string;
    /** The product's word after the Lar mark, such as "Server" or "Account"; left out, just "Lar". */
    product?: string;
    /** The product's hue, glowing softly behind the mark: `server` (navy, the default), `account` (navy) or
     *  `factory` (amber). */
    halo?: keyof typeof halos;
    /** `window` (the default) fills the window, before the app shell exists, as a server's sign-in; `shell` fills
     *  the app shell's area under its title bar, as the account's sign-in, and leaves the lockup to that bar (the halo
     *  stays, behind the title). */
    placement?: 'window' | 'shell';
    /** The card's form: fields and `md` (32px) buttons, 16px apart. */
    children: ReactNode;
    /** A line under the title that says what to do. */
    description?: string;
    /** The card's heading, such as "Sign in", the page's h1 at 22/600. */
    title: string;
    /** The secondary ways out, such as "Can't sign in? Recover your account": one place and one look in every
     *  product, centred at the card's foot over a hairline. Pass quiet `sm` buttons or links; a recovery flow opens
     *  in place of the form or on its own page, not as a disclosure. */
    footer?: ReactNode;
}

/**
 * Every Lar sign-in and first-run card, the same for each product: a 384px card centred in the window (or under the
 * app's title bar), the product's lockup over the title with the product's halo glowing behind it, the title at 22/600
 * and a muted line, then the form, its parts 16px apart, and the secondary ways out (`footer`, such as Recover) centred
 * at its foot. Under a title bar the bar already shows the lockup, so the card shows it once, not twice.
 */
export function AuthLayout({
    brandLabel,
    product,
    halo = 'server',
    placement = 'window',
    children,
    description,
    title,
    footer,
}: AuthLayoutProps) {
    const titleId = useId();

    return (
        <main
            aria-labelledby={titleId}
            className={`flex min-w-0 items-center justify-center px-4 py-10 ${placement === 'shell' ? 'flex-1' : 'min-h-dvh'}`}
        >
            <section
                data-slot="auth-card"
                className="surface-card relative isolate w-full max-w-sm overflow-hidden rounded-2xl border p-6 sm:p-8"
            >
                {/* The product's halo: a soft glow from the card's top centre, behind the mark. */}
                <div
                    aria-hidden="true"
                    className={`halo ${halos[halo]} pointer-events-none absolute inset-x-0 top-0 -z-10 h-56`}
                />
                <StackBase space="page">
                    <StackBase space="related" className="items-center text-center">
                        {placement === 'window' ? (
                            <div className="mb-2 flex justify-center">
                                <ProductLockup label={brandLabel} product={product} size="lg" productFolds={false} />
                            </div>
                        ) : null}
                        <Heading id={titleId} as="h1" variant="page">
                            {title}
                        </Heading>
                        {description ? <Text tone="muted">{description}</Text> : null}
                    </StackBase>
                    <StackBase space="section">{children}</StackBase>
                    {footer ? (
                        <div
                            data-slot="auth-footer"
                            className="border-line -mx-6 -mb-2 flex flex-wrap items-center justify-center gap-2 border-t px-6 pt-4 sm:-mx-8 sm:px-8"
                        >
                            {footer}
                        </div>
                    ) : null}
                </StackBase>
            </section>
        </main>
    );
}
