import type { ReactNode } from 'react';

import { HeadingBase, TextBase } from '../typography/Typography';

export interface Step {
    label: string;
    title: string;
    body: string;
    icon: ReactNode;
}

/** A workflow: compact numbered rows on phones, and on wide screens five stops joined by a line. */
export function StepFlow({
    steps,
    label,
}: {
    /** The workflow's steps, in order. */
    steps: readonly Step[];
    /** Names the workflow for screen readers. */
    label: string;
}) {
    return (
        <ol aria-label={label} className="relative grid gap-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5 lg:gap-0">
            <span
                aria-hidden="true"
                className="absolute top-6.5 right-[10%] left-[10%] hidden h-px bg-[linear-gradient(90deg,transparent,var(--color-line-control)_12%,var(--color-line-control)_88%,transparent)] lg:block"
            />
            {steps.map((step, index) => (
                <li
                    key={step.label}
                    className="relative grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1 sm:rounded-2xl sm:p-5 lg:flex lg:flex-col lg:items-center lg:gap-3 lg:text-center"
                >
                    <span className="border-line bg-surface-raised text-fg-soft relative z-10 row-span-2 inline-flex size-10 items-center justify-center rounded-xl border shadow-(--shadow-showcase-tile) sm:size-13 sm:rounded-xl [&>svg]:size-4.5 sm:[&>svg]:size-5.5">
                        {step.icon}
                        <span className="bg-primary text-primary-content text-2xs absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full font-semibold tabular-nums">
                            {index + 1}
                        </span>
                    </span>
                    <TextBase as="span" variant="overline" tone="muted" className="hidden lg:mt-2 lg:block">
                        {step.label}
                    </TextBase>
                    <HeadingBase as="h3" variant="subsection" className="self-center lg:self-auto">
                        {step.title}
                    </HeadingBase>
                    <TextBase variant="body" tone="lead" className="col-start-2 leading-6 lg:max-w-55">
                        {step.body}
                    </TextBase>
                </li>
            ))}
        </ol>
    );
}
