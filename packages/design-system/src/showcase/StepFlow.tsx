import type { ReactNode } from 'react';

import { Heading, Text } from '../typography/Typography';

export interface Step {
    label: string;
    title: string;
    body: string;
    icon: ReactNode;
}

/** A workflow: compact numbered rows on phones, and on wide screens five stops joined by a line. */
export function StepFlow({ steps, label }: { steps: readonly Step[]; label: string }) {
    return (
        <ol aria-label={label} className="relative grid gap-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5 lg:gap-0">
            <span
                aria-hidden="true"
                className="absolute top-[26px] right-[10%] left-[10%] hidden h-px bg-[linear-gradient(90deg,transparent,var(--color-base-400)_12%,var(--color-base-400)_88%,transparent)] lg:block"
            />
            {steps.map((step, index) => (
                <li
                    key={step.label}
                    className="relative grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1 sm:rounded-2xl sm:p-5 lg:flex lg:flex-col lg:items-center lg:gap-3 lg:text-center"
                >
                    <span className="border-base-300 bg-base-100 text-base-800 relative z-10 row-span-2 inline-flex size-10 items-center justify-center rounded-[0.75rem] border shadow-[0_8px_24px_-12px_rgb(0_0_0/35%)] sm:size-[52px] sm:rounded-[0.9rem] [&>svg]:size-[18px] sm:[&>svg]:size-[22px]">
                        {step.icon}
                        <span className="bg-primary text-primary-content absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums">
                            {index + 1}
                        </span>
                    </span>
                    <Text as="span" variant="overline" tone="muted" className="hidden lg:mt-2 lg:block">
                        {step.label}
                    </Text>
                    <Heading as="h3" variant="subsection" className="self-center lg:self-auto">
                        {step.title}
                    </Heading>
                    <Text
                        variant="body"
                        tone="muted"
                        className="col-start-2 leading-6 lg:max-w-[220px] dark:text-[#a3a3aa]"
                    >
                        {step.body}
                    </Text>
                </li>
            ))}
        </ol>
    );
}
