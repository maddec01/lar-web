import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import {
    createContext,
    type MouseEvent,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { Button } from '../actions/Button';
import { EmptyState } from '../feedback/EmptyState';
import { SettingsDraftProvider, SettingsSaveBar, useSettingsDrafts } from '../forms/SettingsDraft';
import { SettingsSurfaceContext } from '../forms/SettingsGroup';
import { type DesignSystemLabels, useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Stack } from '../layout/Flow';
import { SettingsNav, SettingsSearch } from '../layout/sidebar/SettingsNav';
import { SidebarNavigationItem } from '../layout/sidebar/SidebarNavigationItem';
import { SidebarNavigationGroup } from '../layout/sidebar/SidebarPane';
import { TextBase } from '../typography/Typography';
import { Modal, useModalClose } from './Modal';

/** One section in the settings sidebar. */
export interface SettingsDialogSection {
    /** The section's id, given back to `onSectionChange`. */
    id: string;
    /** Its name in the sidebar and the header's breadcrumb. */
    label: string;
    /** A 16px monochrome icon (lucide), before the name. */
    icon?: ReactNode;
    /** More words a search finds it by, such as its description and its settings' names. */
    keywords?: string;
    /** The section's address where the app routes settings: the item is then a link, so it opens in a new tab with a
     *  modifier, while a plain click goes through the unsaved-draft question and `onSectionChange`. */
    href?: string;
    /** Something in it needs attention, said to screen readers and shown as a warning light, such as "2 sign-in
     *  requests". */
    notification?: string;
}

/** A titled group of sections in the sidebar, such as "Server" or "Access". */
export interface SettingsDialogGroup {
    /** The group's heading. */
    label: string;
    /** Its sections, in order. */
    sections: readonly SettingsDialogSection[];
}

export interface SettingsDialogProps {
    /** The sidebar's groups of sections. */
    groups: readonly SettingsDialogGroup[];
    /** The open section's id. Change it only through `onSectionChange` (or a request that asks first, useModalClose):
     *  the open section's content holds its unsaved drafts, and is replaced as it changes. */
    section: string;
    /** Opens another section, after the reader has agreed to lose an unsaved draft (if any). */
    onSectionChange: (section: string) => void;
    /** Closes settings, after the reader has agreed to lose an unsaved draft (if any). */
    onClose: () => void;
    /** The open section's description, a muted line over its groups. */
    description?: ReactNode;
    /** Controls in the header before the close button, such as a quiet sm "Restore defaults". */
    actions?: ReactNode;
    /** The search, when the app filters the sidebar (and its content) itself; otherwise the dialog keeps it and lists
     *  the sections whose label or keywords hold it. Pair with `onQueryChange`. */
    query?: string;
    /** Called as the reader types in the search, when the app keeps it. */
    onQueryChange?: (query: string) => void;
    /** Extra unsaved state the app tracks itself, asked about like a draft's. Drafts reported with useSettingsDraft
     *  count already. */
    dirty?: boolean;
    /** An action in flight: the dialog can't close until it ends. */
    loading?: boolean;
    /** Called after the footer's Save saved every draft; by default a "Changes saved" toast. */
    onSaved?: () => void;
    /** The dialog's words where the app wants its own; the design system's (translated) labels otherwise. */
    labels?: Partial<DesignSystemLabels['settings']>;
    /** The open section's content: SettingsGroups of SettingsRows (or a FormStack of FormSections). It stays mounted,
     *  hidden and inert, while a search finds nothing, so a typed draft in it survives the search. An app that keeps
     *  the search (`query`) and shows a matching section in place of the open one gives each section it has shown its
     *  own SettingsSectionPane, keyed by the section's id, so the one it hides keeps its drafts. */
    children: ReactNode;
}

/** Whether `section` matches what was searched: its name or keywords hold the search, in any case. */
function matches(section: SettingsDialogSection, needle: string) {
    return !needle || `${section.label} ${section.keywords ?? ''}`.toLocaleLowerCase().includes(needle);
}

/**
 * Settings, as T3 Code's dialog: 896×704 (a full-height sheet on a phone), the sidebar's glass zone on the left with a
 * search (focused by `/`) over the grouped sections, and the reading zone on the right under a 52px breadcrumb header
 * ("Settings / General", its actions, close), with the open section's groups in a centred column. A search that finds
 * nothing says so in the content, with Clear search. Opening focuses the dialog itself, never the search.
 *
 * The one save model: a switch, select or segment applies at once; a typed value is a draft (useSettingsDraft), and
 * while one is unsaved the footer offers Cancel and Save changes, and closing, changing section or Escape asks first.
 * A search never loses a draft: while it finds nothing the open section's content stays mounted, hidden and inert.
 * On a phone the sections become a sideways row above the content.
 */
export function SettingsDialog({
    groups,
    section,
    onSectionChange,
    onClose,
    description,
    actions,
    query: controlledQuery,
    onQueryChange,
    dirty = false,
    loading = false,
    onSaved,
    labels: ownLabels,
    children,
}: SettingsDialogProps) {
    const labels = { ...useDesignSystemLabels().settings, ...ownLabels };
    const [ownQuery, setOwnQuery] = useState('');
    const controlled = controlledQuery !== undefined;
    const query = controlled ? controlledQuery : ownQuery;
    const setQuery = (value: string) => {
        if (!controlled) setOwnQuery(value);

        onQueryChange?.(value);
    };
    const search = useRef<HTMLInputElement>(null);
    const { registry, summary, setFooter } = useSettingsDrafts({ onSaved });
    // The child pane (SettingsChildPane) that has taken the section, if one has: its title is the header's third step,
    // Escape goes back from it, and the section's description steps aside for its own heading.
    const [childPane, setChildPane] = useState<ChildPane | undefined>(undefined);
    const childPaneRef = useRef<ChildPane | undefined>(undefined);
    const registerChildPane = useCallback((pane: ChildPane | undefined) => {
        childPaneRef.current = pane;
        setChildPane(pane);
    }, []);
    const needle = controlled ? '' : query.trim().toLocaleLowerCase();
    const shown = groups
        .map((group) => ({ ...group, sections: group.sections.filter((item) => matches(item, needle)) }))
        .filter((group) => group.sections.length > 0);
    const empty = query.trim() !== '' && shown.length === 0;
    const open = groups.flatMap((group) => group.sections).find((item) => item.id === section);
    const sectionName = open?.label ?? labels.title;
    const childTitle = empty ? undefined : childPane?.title;
    const childPaneHost = useMemo(
        () => ({ register: registerChildPane, sectionName }),
        [registerChildPane, sectionName],
    );

    useSlashToSearch(search);

    return (
        <Modal dirty={dirty || summary.dirty} loading={loading} onClose={onClose}>
            <Modal.Content
                presentation="paned"
                breadcrumb={childTitle ? [labels.title, sectionName] : labels.title}
                title={empty ? labels.noMatchTitle : (childTitle ?? sectionName)}
                accessibleTitle={`${labels.title}: ${empty ? labels.noMatchTitle : childTitle ? `${sectionName}: ${childTitle}` : (open?.label ?? '')}`}
                headerActions={empty ? undefined : actions}
                // A child pane goes back from the header, before the trail, as every dialog that navigates within
                // itself does.
                back={
                    childPane && !empty
                        ? { label: labels.back, onBack: childPane.back, disabled: childPane.backDisabled }
                        : undefined
                }
                focusFirstField={false}
                // The dialog itself takes the focus as it opens, so the search shows no ring and `/` or Tab reach it.
                onOpenAutoFocus={(event) => {
                    event.preventDefault();

                    if (event.target instanceof HTMLElement) event.target.focus({ preventScroll: true });
                }}
                // Escape in a search that holds something empties it, rather than closing settings; in a child pane
                // it goes Back (asking first about a draft), never closing settings and losing what was typed.
                onEscapeKeyDown={(event) => {
                    if (query && event.target === search.current) {
                        event.preventDefault();
                        setQuery('');

                        return;
                    }

                    const pane = childPaneRef.current;

                    if (pane && !empty) {
                        event.preventDefault();

                        if (!pane.backDisabled) pane.back();
                    }
                }}
                sidebar={
                    <SettingsNav
                        label={labels.navigation}
                        data-settings-nav=""
                        search={
                            <SettingsSearch ref={search} value={query} onValueChange={setQuery} label={labels.search} />
                        }
                    >
                        {shown.map((group) => (
                            <SidebarNavigationGroup key={group.label} label={group.label}>
                                {group.sections.map((item) => (
                                    <SectionItem
                                        key={item.id}
                                        item={item}
                                        active={!empty && item.id === section}
                                        onOpen={onSectionChange}
                                    />
                                ))}
                            </SidebarNavigationGroup>
                        ))}
                    </SettingsNav>
                }
            >
                <SettingsDraftProvider registry={registry} summary={summary}>
                    <SettingsSurfaceContext value="dialog">
                        {/* One body for every section, so a search that finds nothing (or an app's search showing another
                            section) never unmounts the open section's drafts; a new section starts at the top. */}
                        <Modal.Body>
                            <ScrollToTop section={section} />
                            <div data-settings-body="" className="mx-auto grid w-full max-w-212 min-w-0 gap-8 pt-2">
                                {empty ? (
                                    <div role="status" className="pt-8">
                                        <EmptyState
                                            size="compact"
                                            icon={<SearchIcon />}
                                            title={labels.noMatchTitle}
                                            description={labels.noMatchDescription}
                                            actions={
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setQuery('');
                                                        search.current?.focus();
                                                    }}
                                                >
                                                    {labels.clearSearch}
                                                </Button>
                                            }
                                        />
                                    </div>
                                ) : null}
                                {/* Hidden and inert while nothing matches, but mounted: its drafts keep what was typed. */}
                                <SettingsSectionPane shown={!empty}>
                                    {description && !childPane ? (
                                        <TextBase tone="muted" className="-mb-2 px-4">
                                            {description}
                                        </TextBase>
                                    ) : null}
                                    <ChildPaneHost value={childPaneHost}>{children}</ChildPaneHost>
                                </SettingsSectionPane>
                            </div>
                        </Modal.Body>
                        {/* The footer zone: the save bar while a draft is unsaved, and where a part's own SettingsFooter
                            goes; it takes no room while both are empty. */}
                        <div
                            data-slot="modal-footer"
                            data-settings-footer=""
                            className="border-line grid shrink-0 gap-2 border-t px-5 py-4 not-has-[>div>*]:hidden sm:px-6"
                        >
                            <div ref={setFooter} className="empty:hidden" />
                            <div className="empty:hidden">
                                <SettingsSaveBar />
                            </div>
                        </div>
                    </SettingsSurfaceContext>
                </SettingsDraftProvider>
            </Modal.Content>
        </Modal>
    );
}

/**
 * A section's content in SettingsDialog that stays mounted while another shows: hidden and inert, so its typed drafts
 * keep what was typed (and still count as unsaved), and shown again as it was. For an app that keeps the search and
 * shows a matching section in place of the open one: give the open section and each one the search has shown a pane,
 * keyed by its id, with only the shown one `shown`. A change of the open section (through `onSectionChange`, which
 * asks about drafts first) may then let the others go.
 */
export function SettingsSectionPane({
    shown,
    children,
}: {
    /** The pane on screen; the others are hidden and inert, but keep their state. */
    shown: boolean;
    /** The section's content, as SettingsDialog's children. */
    children: ReactNode;
}) {
    return (
        <div
            data-settings-section=""
            hidden={!shown || undefined}
            inert={!shown || undefined}
            className={shown ? 'contents' : 'hidden'}
        >
            {children}
        </div>
    );
}

/** The child pane that has taken a section: its title for the header's trail and its way back, for Escape. */
interface ChildPane {
    title: string | undefined;
    back: () => void;
    backDisabled: boolean;
}

/** Where a SettingsChildPane tells its SettingsDialog it has opened (and closed), and learns the section's name. */
const ChildPaneHost = createContext<
    { register: (pane: ChildPane | undefined) => void; sectionName: string } | undefined
>(undefined);

/**
 * A child workflow taking a settings section's pane (Add catalog, Invite user, a device's code, a project's setup),
 * one anatomy everywhere: its `title` is the header's third step ("Settings / Users / Approve device"), with the way
 * back as an arrow before the trail in the header; Escape goes back too, rather than closing settings. Both ask first
 * while a draft in the dialog is unsaved (the dialog's discard question, asked once even where `onBack` asks too).
 * While it shows, SettingsDialog leaves out the section's description, so the child's own heading comes first; the
 * body opens at its top. Outside SettingsDialog (a wizard's step), a quiet Back leads the pane instead.
 */
export function SettingsChildPane({
    title,
    backLabel,
    onBack,
    backDisabled = false,
    children,
}: {
    /** The workflow's name, the header's third step, such as "Approve device" or "Add catalog". */
    title?: string;
    /** The way back's words: the section's name by default (such as "Users"), or where it leads, such as
     *  "Projects". */
    backLabel?: string;
    /** Returns to the section; Back and Escape ask about an unsaved draft before they call it. */
    onBack: () => void;
    /** While the pane's request runs. */
    backDisabled?: boolean;
    /** The workflow: its heading and groups, and its SettingsFooter. */
    children: ReactNode;
}) {
    const labels = useDesignSystemLabels().settings;
    const host = useContext(ChildPaneHost);
    const requestClose = useModalClose();
    // The latest way back, read when Back or Escape is used, so the registration stays put across renders. Inside
    // SettingsDialog it asks about a draft first; elsewhere (a wizard's step) `onBack` is called as given.
    const backNow = () => (host ? requestClose(onBack) : onBack());
    const latest = useRef(backNow);

    useLayoutEffect(() => {
        latest.current = backNow;
    });
    useLayoutEffect(() => {
        host?.register({ title, back: () => latest.current(), backDisabled });
    }, [host, title, backDisabled]);
    useLayoutEffect(() => () => host?.register(undefined), [host]);

    if (host) {
        return (
            <>
                <OpensAtTop />
                {children}
            </>
        );
    }

    return (
        <Stack space="section">
            <SettingsBack label={backLabel ?? labels.back} onBack={() => latest.current()} disabled={backDisabled} />
            {children}
        </Stack>
    );
}

/**
 * The way back first in a pane outside SettingsDialog (a wizard's step): a quiet "Back" with its arrow. Inside
 * SettingsDialog the way back is the header's arrow (SettingsChildPane). The settings body scrolls to its top as it
 * opens, so the pane opens at its beginning.
 */
function SettingsBack({
    label,
    onBack,
    disabled,
}: {
    /** The button's words, such as "Back" or "Projects". */
    label: string;
    /** Returns to the section (asking first, where the pane holds a draft). */
    onBack: () => void;
    /** While the pane's request runs. */
    disabled?: boolean;
}) {
    return (
        <div>
            <OpensAtTop />
            <Button
                type="button"
                variant="quiet"
                size="sm"
                leftIcon={<ArrowLeftIcon />}
                disabled={disabled}
                onClick={onBack}
            >
                {label}
            </Button>
        </div>
    );
}

/** Scrolls the settings body to its top as a child pane opens, wherever the reader had scrolled to, so the pane opens
 *  at its beginning. */
function OpensAtTop() {
    const marker = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const body = marker.current?.closest('[data-slot="modal-body"]');

        if (body) body.scrollTop = 0;
    }, []);

    return <span ref={marker} hidden />;
}

/** Scrolls the body back to the top as another section opens. First in the body, so it runs before the content's own
 *  effects, such as one that scrolls to a setting an address names. */
function ScrollToTop({ section }: { section: string }) {
    const marker = useRef<HTMLSpanElement>(null);
    const shown = useRef(section);

    useLayoutEffect(() => {
        if (shown.current === section) return;

        shown.current = section;

        const body = marker.current?.closest('[data-slot="modal-body"]');

        if (body) body.scrollTop = 0;
    }, [section]);

    return <span ref={marker} hidden />;
}

/** A section in the sidebar: a link where it has an address, a button otherwise. Either asks about an unsaved draft
 *  before opening it; a link opened in a new tab (a modifier, a middle click) needs no asking. */
function SectionItem({
    item,
    active,
    onOpen,
}: {
    item: SettingsDialogSection;
    active: boolean;
    onOpen: (section: string) => void;
}) {
    const requestClose = useModalClose();
    const content = (
        <>
            {item.icon}
            <span className="min-w-0 truncate">{item.label}</span>
        </>
    );
    const go = () => {
        if (!active) requestClose(() => onOpen(item.id));
    };

    if (item.href)
        return (
            <SidebarNavigationItem asChild active={active} notification={item.notification}>
                <a
                    href={item.href}
                    onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                        if (event.defaultPrevented || event.button !== 0) return;

                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

                        event.preventDefault();
                        go();
                    }}
                >
                    {content}
                </a>
            </SidebarNavigationItem>
        );

    return (
        <SidebarNavigationItem active={active} notification={item.notification} onClick={go}>
            {content}
        </SidebarNavigationItem>
    );
}

/** Focuses the search on `/` while settings are on top: not while typing in a field, nor while a dialog opened over
 *  settings (a confirm, a part's own editor) has the keys. */
function useSlashToSearch(search: { current: HTMLInputElement | null }) {
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;

            const target = event.target;
            const typing =
                target instanceof HTMLElement &&
                Boolean(target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'));
            const dialog = search.current?.closest('[role="dialog"]');
            const over = target instanceof Node && target !== document.body && !dialog?.contains(target);

            if (typing || over || !search.current) return;

            event.preventDefault();
            search.current.focus();
        };

        addEventListener('keydown', onKey);

        return () => removeEventListener('keydown', onKey);
    }, [search]);
}
