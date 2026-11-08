import type { ReactNode } from 'react';

import { Heading, Text, TextBase } from '../typography/Typography';

const MARK_L = 'M0 0H27.52V72.48H100V100H3a3 3 0 0 1-3-3z';
const MARK_S =
    'M50.68 0H91.97a8.03 8.03 0 0 1 8.03 8.03V49.32a8.03 8.03 0 0 1-8.03 8.03H50.68a8.03 8.03 0 0 1-8.03-8.03V8.03a8.03 8.03 0 0 1 8.03-8.03z';

interface CallToActionProps {
    /** The last invitation, as the panel's title. */
    title: ReactNode;
    /** A sentence under the title. */
    lead: ReactNode;
    /** The ways in, such as Download and Learn more. */
    actions: ReactNode;
    /** A small line under the actions, such as what Lar runs on. */
    note?: ReactNode;
}

/** The closing panel of a page: the Lar mark drawn large and faint behind one last invitation. */
export function CallToAction({ title, lead, actions, note }: CallToActionProps) {
    return (
        <div className="border-line bg-surface-raised relative isolate overflow-hidden rounded-3xl border px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,var(--lar-glow),transparent_70%)]"
            />
            <div className="mx-auto flex max-w-160 flex-col items-center gap-5">
                <svg aria-hidden="true" viewBox="0 0 100 100" className="mb-1 size-9 text-(--color-brand-ink)">
                    <path d={MARK_L} fill="currentColor" />
                    <path d={MARK_S} fill="var(--color-brand-mark)" />
                </svg>
                <Heading as="h2" variant="headline">
                    {title}
                </Heading>
                <Text variant="lead" tone="muted">
                    {lead}
                </Text>
                <div className="mt-3 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap max-sm:[&>a]:w-full max-sm:[&>a]:max-w-80">
                    {actions}
                </div>
                {note ? (
                    <TextBase variant="caption" tone="lead" className="text-balance">
                        {note}
                    </TextBase>
                ) : null}
            </div>
        </div>
    );
}
