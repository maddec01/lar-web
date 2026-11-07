import { MenuIcon, XIcon } from 'lucide-react';
import { type ReactNode, useEffect, useId, useState } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';

export interface SiteLink {
    label: string;
    href: string;
    current?: boolean;
    external?: boolean;
}

interface SiteShellProps {
    skipLabel: string;
    header: ReactNode;
    footer: ReactNode;
    children: ReactNode;
}

/** The website frame: a glass header that stays on top while the document scrolls under it, then the footer. */
export function SiteShell({ skipLabel, header, footer, children }: SiteShellProps) {
    const scrolled = useScrolled();

    return (
        <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
            <a
                href="#content"
                className="bg-base-100 sr-only z-[60] rounded-md px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                {skipLabel}
            </a>
            <div
                data-scrolled={scrolled || undefined}
                className="glass-bar data-scrolled:border-base-300 sticky top-0 z-50 shrink-0 border-b border-transparent pt-[env(safe-area-inset-top)] transition-[border-color] duration-300"
            >
                {header}
            </div>
            <main id="content" className="flex-1">
                {children}
            </main>
            {footer}
        </div>
    );
}

interface SiteHeaderProps {
    brand: ReactNode;
    links: readonly SiteLink[];
    actions: ReactNode;
    /** Secondary controls, such as the theme switch: in the bar on wide screens and in the menu on narrow ones. */
    utilities?: ReactNode;
    menuLabel: string;
    closeMenuLabel: string;
    navigationLabel: string;
    onNavigate: (href: string) => void;
}

export function SiteHeader({
    brand,
    links,
    actions,
    utilities,
    menuLabel,
    closeMenuLabel,
    navigationLabel,
    onNavigate,
}: SiteHeaderProps) {
    const [open, setOpen] = useState(false);
    const menuId = useId();

    function follow(href: string) {
        setOpen(false);
        onNavigate(href);
    }

    return (
        <header className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-6 px-5 sm:px-8">
            {brand}
            <nav aria-label={navigationLabel} className="hidden items-center gap-1 md:flex">
                {links.map((link) => (
                    <NavLink key={link.href} link={link} onNavigate={follow} />
                ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 max-sm:[&>a]:hidden">
                {utilities ? <div className="hidden md:contents">{utilities}</div> : null}
                {actions}
            </div>
            <button
                {...tabbable}
                type="button"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? closeMenuLabel : menuLabel}
                onClick={() => setOpen((value) => !value)}
                className="text-base-800 hover:bg-base-200 -mr-2 inline-flex size-9 items-center justify-center rounded-md transition-colors md:hidden [&_svg]:size-5"
            >
                {open ? <XIcon /> : <MenuIcon />}
            </button>
            {open ? (
                <nav
                    id={menuId}
                    aria-label={navigationLabel}
                    className="glass-menu absolute inset-x-3 top-[calc(100%+0.5rem)] flex flex-col gap-1 rounded-2xl p-2 md:hidden"
                >
                    {links.map((link) => (
                        <NavLink key={link.href} link={link} onNavigate={follow} large />
                    ))}
                    {utilities ? <div className="border-base-300 mt-1 border-t px-3 pt-3 pb-1">{utilities}</div> : null}
                </nav>
            ) : null}
        </header>
    );
}

function NavLink({ link, onNavigate, large }: { link: SiteLink; onNavigate: (href: string) => void; large?: boolean }) {
    return (
        <a
            {...tabbable}
            href={link.href}
            aria-current={link.current ? 'page' : undefined}
            {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            onClick={(event) => {
                if (link.external || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

                event.preventDefault();
                onNavigate(link.href);
            }}
            className={`text-base-700 hover:text-base-content aria-[current=page]:text-base-content focus-visible:outline-primary rounded-md font-medium transition-colors focus-visible:outline-2 ${large ? 'hover:bg-base-200 px-3 py-2.5 text-base' : 'px-2.5 py-1.5 text-sm'}`}
        >
            {link.label}
        </a>
    );
}

interface SiteFooterProps {
    brand: ReactNode;
    tagline: string;
    columns: readonly { title: string; links: readonly SiteLink[] }[];
    legal: string;
    note: ReactNode;
    onNavigate: (href: string) => void;
}

export function SiteFooter({ brand, tagline, columns, legal, note, onNavigate }: SiteFooterProps) {
    return (
        <footer className="border-base-300 bg-base-50 border-t">
            <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-x-6 gap-y-10 px-5 pt-14 pb-10 sm:px-8 md:grid-cols-[1.4fr_repeat(4,1fr)]">
                <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
                    {brand}
                    <p className="text-base-700 max-w-64 text-sm leading-6">{tagline}</p>
                </div>
                {columns.map((column) => (
                    <div key={column.title} className="flex flex-col gap-3">
                        <h2 className="text-base-800 text-xs font-semibold tracking-[0.06em] uppercase">
                            {column.title}
                        </h2>
                        <ul className="flex flex-col gap-2">
                            {column.links.map((link) => (
                                <li key={link.href}>
                                    <a
                                        {...tabbable}
                                        href={link.href}
                                        {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                                        onClick={(event) => {
                                            if (link.external || !link.href.startsWith('/')) return;

                                            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
                                                return;

                                            event.preventDefault();
                                            onNavigate(link.href);
                                        }}
                                        className="text-base-700 hover:text-base-content text-sm transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
                <div className="border-base-300/70 text-base-700 flex flex-col gap-2 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <span>{legal}</span>
                    <span>{note}</span>
                </div>
            </div>
        </footer>
    );
}

function useScrolled() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 4);

        update();
        window.addEventListener('scroll', update, { passive: true });

        return () => window.removeEventListener('scroll', update);
    }, []);

    return scrolled;
}
