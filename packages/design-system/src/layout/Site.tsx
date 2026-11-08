import { MenuIcon, XIcon } from 'lucide-react';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { tabbable } from '../foundations/KeyboardFocus';
import { GlassBar } from './GlassBar';
import { useScrolled } from './useScrolled';

export interface SiteLink {
    label: string;
    href: string;
    current?: boolean;
    external?: boolean;
}

interface SiteShellProps {
    /** The skip link's text, such as "Skip to content", shown on keyboard focus. */
    skipLabel: string;
    /** The site's header, a SiteHeader. */
    header: ReactNode;
    /** The site's footer, a SiteFooter. */
    footer: ReactNode;
    /** The page. */
    children: ReactNode;
}

/** The website frame: a glass header that stays on top while the document scrolls under it, then the footer. */
export function SiteShell({ skipLabel, header, footer, children }: SiteShellProps) {
    const scrolled = useScrolled();

    return (
        <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
            <a
                href="#content"
                className="bg-surface-raised sr-only z-[60] rounded-md px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                {skipLabel}
            </a>
            <GlassBar scrolled={scrolled}>{header}</GlassBar>
            <main id="content" className="flex-1">
                {children}
            </main>
            {footer}
        </div>
    );
}

interface SiteHeaderProps {
    /** The site's mark, linking home. */
    brand: ReactNode;
    /** The main navigation's pages, the current one marked. */
    links: readonly SiteLink[];
    /** The page's calls to action, such as Download: in the bar from 40rem, and at the foot of the menu below it. */
    actions: ReactNode;
    /** Secondary controls, such as the theme switch: in the bar on wide screens and in the menu on narrow ones. */
    utilities?: ReactNode;
    /** Labelled controls for the mobile panel; defaults to utilities. */
    mobileUtilities?: ReactNode;
    /** The menu button's accessible name on narrow screens, such as "Menu". */
    menuLabel: string;
    /** The menu's close button's accessible name. */
    closeMenuLabel: string;
    /** Names the open phone menu, a modal dialog, such as "Menu"; defaults to the navigation's name. */
    menuTitle?: string;
    /** Names the navigation landmark, such as "Main". */
    navigationLabel: string;
    /** Called with a link's href as it is followed, for client-side routing. */
    onNavigate: (href: string) => void;
}

export function SiteHeader({
    brand,
    links,
    actions,
    utilities,
    mobileUtilities = utilities,
    menuLabel,
    closeMenuLabel,
    navigationLabel,
    menuTitle = navigationLabel,
    onNavigate,
}: SiteHeaderProps) {
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const header = useRef<HTMLElement>(null);
    const dialog = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLElement>(null);

    function follow(href: string) {
        setOpen(false);
        onNavigate(href);
    }

    // The open menu covers the page, so it is a modal dialog: the bar (brand, close button) and the menu under it,
    // named by menuTitle. Everything outside the header is inert while it is open, focus moves to the menu's first
    // link, and Tab and Shift+Tab wrap inside the dialog instead of leaving for the browser's chrome. It closes on
    // Escape, handing focus back to its button, on a press outside the header, and once the window is wide enough
    // for the bar's own links, where the menu has no place. The page behind it doesn't scroll while it is open (the
    // menu itself scrolls when it is taller than the window), and it is where the reader left it once the menu closes.
    useEffect(() => {
        if (!open || !header.current) return;

        const root = document.documentElement;
        const scrollY = window.scrollY;
        const locked = { overflow: root.style.overflow, overscrollBehavior: root.style.overscrollBehavior };

        root.style.overflow = 'hidden';
        root.style.overscrollBehavior = 'none';

        panel.current?.querySelector<HTMLElement>('a[href]')?.focus({ preventScroll: true });

        const page: Element[] = [];

        for (
            let node: Element = header.current;
            node.parentElement && node !== document.body;
            node = node.parentElement
        )
            for (const sibling of node.parentElement.children)
                if (sibling !== node && !sibling.hasAttribute('inert')) {
                    sibling.setAttribute('inert', '');
                    page.push(sibling);
                }

        const wide = typeof matchMedia === 'function' ? matchMedia('(min-width: 48rem)') : undefined;
        const onWide = () => {
            if (wide?.matches) setOpen(false);
        };

        wide?.addEventListener('change', onWide);

        return () => {
            for (const element of page) element.removeAttribute('inert');

            wide?.removeEventListener('change', onWide);
            root.style.overflow = locked.overflow;
            root.style.overscrollBehavior = locked.overscrollBehavior;

            if (window.scrollY !== scrollY) window.scrollTo({ top: scrollY, behavior: 'instant' });
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                wrapFocus(event);

                return;
            }

            if (event.key !== 'Escape') return;

            setOpen(false);
            trigger.current?.focus();
        };
        const wrapFocus = (event: KeyboardEvent) => {
            const stops = [...(dialog.current?.querySelectorAll<HTMLElement>(focusStops) ?? [])].filter(
                (element) => element.getClientRects().length > 0,
            );
            const first = stops[0];
            const last = stops.at(-1);

            if (!first || !last) return;

            const active = document.activeElement;
            const outside = !(active instanceof Node) || !dialog.current?.contains(active);

            if (event.shiftKey ? active === first || outside : active === last || outside) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }
        };
        const onPointerDown = (event: PointerEvent) => {
            if (!header.current?.contains(event.target as Node)) setOpen(false);
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('pointerdown', onPointerDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerdown', onPointerDown);
        };
    }, [open]);

    return (
        <header ref={header} className="max-w-page mx-auto w-full">
            <div
                ref={dialog}
                {...(open ? { role: 'dialog', 'aria-modal': true, 'aria-label': menuTitle } : {})}
                // While the menu is open its bar is opaque too, so a page scrolled under the glass header never shows.
                className={`flex h-14 items-center gap-6 px-5 sm:px-8 ${open ? 'bg-surface-page' : ''}`}
            >
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
                    ref={trigger}
                    type="button"
                    aria-expanded={open}
                    aria-controls={menuId}
                    aria-label={open ? closeMenuLabel : menuLabel}
                    onClick={() => setOpen((value) => !value)}
                    className="text-fg-soft hover:bg-fill-hover -mr-2 inline-flex size-9 items-center justify-center rounded-md transition-colors md:hidden [&_svg]:size-5"
                >
                    {open ? <XIcon /> : <MenuIcon />}
                </button>
                {open ? (
                    <>
                        <div
                            aria-hidden="true"
                            onPointerDown={() => {
                                setOpen(false);
                                trigger.current?.focus();
                            }}
                            // Opaque, not a dialog's dim: the page under it is busy (a hero, artwork), and nothing of it
                            // may read through around the menu (a backdrop blur can't work under the glass header).
                            className="bg-surface-page fixed inset-x-0 top-full h-dvh touch-none md:hidden"
                        />
                        <nav
                            ref={panel}
                            onClick={(event) => {
                                const target = event.target;

                                if (target instanceof Element && target.closest('a[href]:not([aria-disabled="true"])'))
                                    setOpen(false);
                            }}
                            id={menuId}
                            aria-label={navigationLabel}
                            className="border-line bg-surface-raised absolute inset-x-3 top-[calc(100%+0.5rem)] flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto overscroll-contain rounded-2xl border p-2 shadow-(--shadow-popup) md:hidden"
                        >
                            {links.map((link) => (
                                <NavLink key={link.href} link={link} onNavigate={follow} large />
                            ))}
                            {mobileUtilities ? (
                                <div className="border-line mt-1 border-t pt-3 pb-1">{mobileUtilities}</div>
                            ) : null}
                            <div className="flex flex-col gap-2 pt-2 sm:hidden [&>a]:w-full">{actions}</div>
                        </nav>
                    </>
                ) : null}
            </div>
        </header>
    );
}

// What Tab can reach inside the open menu; hidden and disabled controls are skipped.
const focusStops =
    'a[href]:not([aria-disabled="true"]), button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

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
            className={`text-fg-muted hover:text-fg aria-[current=page]:text-fg focus-ring rounded-md font-medium transition-colors ${large ? 'hover:bg-fill-hover aria-[current=page]:bg-fill-selected px-3 py-2.5 text-base' : 'px-2.5 py-1.5 text-sm'}`}
        >
            {link.label}
        </a>
    );
}

interface SiteFooterProps {
    /** The site's mark, above the tagline. */
    brand: ReactNode;
    /** A line under the mark that says what Lar is. */
    tagline: string;
    /** The footer's link columns, each with a title. */
    columns: readonly { title: string; links: readonly SiteLink[] }[];
    /** The copyright line. */
    legal: string;
    /** A short line beside the legal one, such as where Lar is made. */
    note: ReactNode;
    /** Called with a link's href as it is followed, for client-side routing. */
    onNavigate: (href: string) => void;
}

export function SiteFooter({ brand, tagline, columns, legal, note, onNavigate }: SiteFooterProps) {
    return (
        <footer className="border-line bg-surface-page border-t">
            <div className="max-w-page mx-auto grid w-full grid-cols-2 gap-x-6 gap-y-10 px-5 pt-14 pb-10 sm:px-8 md:grid-cols-[1.4fr_repeat(4,1fr)]">
                <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
                    {brand}
                    <p className="text-fg-muted max-w-64 text-sm leading-6">{tagline}</p>
                </div>
                {columns.map((column) => (
                    <div key={column.title} className="flex flex-col gap-3">
                        <h2 className="text-fg-soft text-xs font-semibold">{column.title}</h2>
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
                                        className="text-fg-muted hover:text-fg text-sm transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="max-w-page mx-auto w-full px-5 sm:px-8">
                <div className="border-line/70 text-fg-muted flex flex-col gap-2 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <span>{legal}</span>
                    <span>{note}</span>
                </div>
            </div>
        </footer>
    );
}
