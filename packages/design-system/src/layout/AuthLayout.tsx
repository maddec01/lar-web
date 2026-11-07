import { type ReactNode, useId } from 'react';

import { BrandMark } from '../display/BrandMark';
import { Heading, Text } from '../typography/Typography';
import { Inline, Stack } from './Flow';

interface AuthLayoutProps {
    brandLabel: string;
    children: ReactNode;
    description?: string;
    title: string;
}

/** A page-centered card for signing in or first-run setup, shown before the app shell exists. */
export function AuthLayout({ brandLabel, children, description, title }: AuthLayoutProps) {
    const titleId = useId();

    return (
        <main className="flex min-h-dvh items-center justify-center px-4 py-10">
            <section
                aria-labelledby={titleId}
                className="border-base-300 bg-base-100 w-full max-w-sm rounded-2xl border p-6 shadow-[0_24px_64px_-32px_rgb(0_0_0/35%)] sm:p-8"
            >
                <Stack space="page">
                    <Stack space="related" className="items-center text-center">
                        <Inline align="baseline" space="tight" className="text-xl leading-none">
                            <BrandMark label={brandLabel} />
                            <span className="font-medium">Server</span>
                        </Inline>
                        <Heading id={titleId} as="h1" variant="section">
                            {title}
                        </Heading>
                        {description ? <Text tone="muted">{description}</Text> : null}
                    </Stack>
                    {children}
                </Stack>
            </section>
        </main>
    );
}
