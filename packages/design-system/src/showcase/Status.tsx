import { ArrowRightIcon } from 'lucide-react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

/** Where a product or feature stands: out now, being built, or planned. */
export type Readiness = 'available' | 'development' | 'planned';

const readinessClasses: Record<Readiness, { pill: string; dot: string }> = {
    available: {
        pill: 'bg-success/10 text-(--lar-success-text) ring-success/20 dark:bg-success/14',
        dot: 'bg-success shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-success)_22%,transparent)]',
    },
    development: {
        pill: 'bg-primary/10 text-primary ring-primary/20 dark:bg-primary/22 dark:text-[color-mix(in_srgb,var(--color-primary)_42%,white)] dark:ring-primary/35',
        dot: 'bg-primary dark:bg-[color-mix(in_srgb,var(--color-primary)_60%,white)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_24%,transparent)]',
    },
    planned: {
        pill: 'bg-base-200 text-base-800 ring-base-300 dark:bg-base-300/70',
        dot: 'bg-base-500 dark:bg-base-600',
    },
};

/** A readiness label with its light. */
export function StatusPill({ status, children }: { status: Readiness; children: ReactNode }) {
    return (
        <span
            className={`inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${readinessClasses[status].pill}`}
        >
            <StatusLight status={status} />
            {children}
        </span>
    );
}

export function StatusLight({ status, pulse }: { status: Readiness; pulse?: boolean }) {
    return (
        <span
            aria-hidden="true"
            className={`inline-block size-1.5 shrink-0 rounded-full ${readinessClasses[status].dot} ${pulse ? 'lar-led-pulse' : ''}`}
        />
    );
}

interface AnnouncementProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style'> {
    href: string;
    tag: string;
    status?: Readiness;
    children: ReactNode;
    external?: boolean;
    onNavigate?: (href: string) => void;
}

/** The pill above a hero title that points at news. */
export function Announcement({
    href,
    tag,
    status = 'available',
    children,
    external,
    onNavigate,
    ...props
}: AnnouncementProps) {
    return (
        <a
            {...tabbable}
            {...props}
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            onClick={(event) => {
                if (!onNavigate || external || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
                    return;

                event.preventDefault();
                onNavigate(href);
            }}
            className="group/announcement border-base-300 bg-base-100/80 text-base-800 hover:border-base-400 hover:text-base-content focus-visible:outline-primary dark:bg-base-200/60 inline-flex h-8 max-w-full items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-[13px] shadow-xs/5 backdrop-blur transition-colors focus-visible:outline-2"
        >
            <span
                className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-xs font-semibold ${readinessClasses[status].pill}`}
            >
                <StatusLight status={status} pulse />
                {tag}
            </span>
            <span className="truncate">{children}</span>
            <span className="text-base-600 inline-flex transition-transform duration-200 group-hover/announcement:translate-x-0.5 [&_svg]:size-3.5">
                <ArrowRightIcon />
            </span>
        </a>
    );
}

/** A Lar app icon, cut to the platform's continuous corner. */
export function AppIcon({ src, alt, size = 'md' }: { src: string; alt: string; size?: 'sm' | 'md' | 'lg' }) {
    const sizes = { sm: 'size-9 rounded-[0.55rem]', md: 'size-12 rounded-[0.75rem]', lg: 'size-16 rounded-[1rem]' };

    return (
        <img
            src={src}
            alt={alt}
            width={128}
            height={128}
            loading="lazy"
            className={`shrink-0 shadow-[0_6px_16px_-6px_rgb(0_0_0/45%),inset_0_0_0_0.5px_rgb(255_255_255/12%)] ${sizes[size]}`}
        />
    );
}
