import { ArrowRightIcon } from 'lucide-react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { type StatusDotTone, StatusIndicator, StatusIndicatorBase } from '../feedback/StatusIndicator';
import type { StatusColour } from '../feedback/StatusState';
import { tabbable } from '../foundations/KeyboardFocus';

/** Where a product or feature stands: out now, being built, or planned. */
export type Readiness = 'available' | 'development' | 'planned';

/** Each readiness on the apps' one status map: out now is ready, planned is off, and being built takes the accent the
 *  status light keeps for "In development". */
const readinessColours: Record<Readiness, StatusColour<StatusDotTone>> = {
    available: { state: 'ready' },
    development: { tone: 'accent' },
    planned: { state: 'off' },
};

/** A readiness in words beside its light: the apps' StatusIndicator dot and label, in the readiness's tone. */
export function ReadinessStatus({
    status,
    children,
}: {
    /** The readiness: `available`, `development` or `planned`. */
    status: Readiness;
    /** The readiness in words. */
    children: string;
}) {
    return <StatusIndicatorBase {...readinessColours[status]} size="sm" label={children} className="shrink-0" />;
}

/** A readiness as the design system's status light; the label beside it says what it means. */
export function StatusLight({
    status,
    pulse,
}: {
    /** The readiness: `available`, `development` or `planned`. */
    status: Readiness;
    /** Breathes slowly, for something in development. */
    pulse?: boolean;
}) {
    return <StatusIndicator {...readinessColours[status]} size="sm" pulse={pulse} />;
}

interface AnnouncementProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'color' | 'style'> {
    /** The news's page. */
    href: string;
    /** A short tag before the text, such as "New". */
    tag: string;
    /** The readiness whose light the tag carries; `available` by default. */
    status?: Readiness;
    /** The news, in a few words. */
    children: ReactNode;
    /** Opens in a new tab, for news on another site. */
    external?: boolean;
    /** Called with the href as the link is followed, for client-side routing. */
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
            className="group/announcement border-line bg-surface-glass text-fg-soft hover:border-line-hover hover:text-fg focus-ring text-ui inline-flex h-8 max-w-full items-center gap-2 rounded-full border py-1 pr-3 pl-3 shadow-(--shadow-raised) backdrop-blur transition-colors"
        >
            <StatusIndicatorBase {...readinessColours[status]} size="sm" label={tag} pulse />
            <span aria-hidden="true" className="bg-line h-3.5 w-px shrink-0" />
            <span className="truncate">{children}</span>
            <span className="text-fg-muted inline-flex transition-transform duration-(--motion-duration-base) group-hover/announcement:translate-x-0.5 [&_svg]:size-3.5">
                <ArrowRightIcon />
            </span>
        </a>
    );
}

/** A Lar app icon, cut to the platform's continuous corner. */
export function AppIcon({
    src,
    alt,
    size = 'md',
}: {
    /** The icon's image. */
    src: string;
    /** The app's name. */
    alt: string;
    /** `sm` 36px, `md` 48px (the default) or `lg` 64px. */
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizes = { sm: 'size-9 rounded-md', md: 'size-12 rounded-xl', lg: 'size-16 rounded-xl' };

    return (
        <img
            src={src}
            alt={alt}
            width={128}
            height={128}
            loading="lazy"
            className={`shrink-0 shadow-(--shadow-showcase-app-icon) ${sizes[size]}`}
        />
    );
}
