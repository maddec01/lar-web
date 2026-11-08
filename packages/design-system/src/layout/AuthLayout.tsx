import { type ReactNode, useId } from 'react';

import { BrandMark } from '../display/BrandMark';
import { Heading, Text } from '../typography/Typography';
import { InlineBase, StackBase } from './Flow';

interface AuthLayoutProps {
    /** The Lar mark's accessible name, such as the app's name. */
    brandLabel: string;
    /** The card's form. */
    children: ReactNode;
    /** A line under the title that says what to do. */
    description?: string;
    /** The card's heading, such as "Sign in". */
    title: string;
}

/** A page-centered card for signing in or first-run setup, shown before the app shell exists. */
export function AuthLayout({ brandLabel, children, description, title }: AuthLayoutProps) {
    const titleId = useId();

    return (
        <main className="flex min-h-dvh items-center justify-center px-4 py-10">
            <section
                aria-labelledby={titleId}
                className="border-line bg-surface-raised w-full max-w-sm rounded-2xl border p-6 shadow-(--shadow-dialog) sm:p-8"
            >
                <StackBase space="page">
                    <StackBase space="related" className="items-center text-center">
                        <InlineBase align="baseline" space="tight" className="text-xl leading-none">
                            <BrandMark label={brandLabel} />
                            <span className="font-medium">Server</span>
                        </InlineBase>
                        <Heading id={titleId} as="h1" variant="page">
                            {title}
                        </Heading>
                        {description ? <Text tone="muted">{description}</Text> : null}
                    </StackBase>
                    {children}
                </StackBase>
            </section>
        </main>
    );
}
