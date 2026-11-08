/* oxlint-disable react/only-export-components -- Compound members are exported through Modal. */

import {
    Modal as NinnaModal,
    type ModalBodyProps,
    type ModalContentProps,
    type ModalFooterProps,
} from '@ninna-ui/overlays';
import { XIcon } from 'lucide-react';
import {
    type ComponentProps,
    createContext,
    forwardRef,
    type ReactNode,
    type Ref,
    useCallback,
    useContext,
    useId,
    useState,
} from 'react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { CompactAlertContext } from '../feedback/CompactAlertContext';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { HeadingBase, TextBase } from '../typography/Typography';
import { useModalAutoFocus } from './useModalAutoFocus';
import { useScrollFade } from './useScrollFade';

const ModalLoadingContext = createContext(false);

/**
 * Leaves the dialog through its dirty-dismiss guard. While the dialog is `dirty` it first asks to discard the unsaved
 * changes, and only on "Discard" goes on: to `next` when given (another destination, such as opening a part's own
 * dialog in its place), else to the dialog's `onClose`. A clean dialog goes on at once. Nothing happens while an
 * action is in flight (`loading`).
 */
export type ModalRequestClose = (next?: () => void) => void;

/** The dialog's own close request, through its dirty-dismiss guard. */
const ModalCloseContext = createContext<ModalRequestClose>(() => {});

/**
 * The Modal around the caller's guarded `requestClose(next?)` (see ModalRequestClose): a footer's Cancel calls
 * `requestClose()` to ask about unsaved changes exactly as Escape, a click outside and the close button do, and a
 * control that leaves for somewhere else calls `requestClose(() => go(there))` to confirm the discard, then navigate.
 * Never a second "Discard changes?" dialog of the caller's.
 */
export function useModalClose(): ModalRequestClose {
    return useContext(ModalCloseContext);
}

interface ModalContentPolicyProps extends Omit<ModalContentProps, 'className' | 'color' | 'size' | 'style' | 'title'> {
    /** The dialog's accessible name where it differs from the visible `title`, such as a title that is an input. */
    accessibleTitle?: string;
    /** Whether opening focuses the first editable field; off while the caller focuses something else. */
    focusFirstField?: boolean;
    /** Controls in the header before the close button, such as ModalExpandButton. */
    headerActions?: ReactNode;
    /** A pane beside the body, such as a settings dialog's sections; it makes the dialog `paned`. */
    sidebar?: ReactNode;
    /** Number of sidebar destinations. Fewer than two uses a plain, content-height dialog. */
    sidebarSections?: number;
    /** The dialog's size; a dialog with a sidebar is `paned` unless it says otherwise. `confirm` is 28rem, for a
     *  question such as ConfirmDialog's: it has no close button (its footer's first button, the safe answer such as
     *  "Cancel" or "Keep editing", is the way out, as Escape is) and opens with the focus on that safe answer. */
    presentation?: 'default' | 'confirm' | 'paned' | 'workspace';
    /** Grows the dialog to the window, less a small margin, under a 52px title bar; see ModalExpandButton. */
    expanded?: boolean;
    /** The dialog's height. By default every dialog takes its content's height, up to the window: a short question,
     *  a review or a read-only workspace never shows an empty half. Two kinds hold one height instead, where a changing
     *  body would make the dialog jump: a paned dialog with tabs (two or more sidebar sections), and a dialog whose
     *  body fills it (`Modal.Body layout="fill"`, an editor). `true` takes the content's height even then (a short
     *  pane, a review step); `false` holds the height for any dialog (an editor in a workspace, a search whose results
     *  come and go). On a phone a paned or workspace dialog stays the full-height sheet, so every editor and review
     *  step reads as one presentation. Expanding wins. */
    fitsContent?: boolean;
    /** The dialog's heading, and its accessible name unless `accessibleTitle` says otherwise. */
    title: string;
    /** A line under the title, read as the dialog's description. */
    description?: string;
    /** Closes on Escape; on by default. */
    closeOnEscape?: boolean;
    /** Closes on a click outside it; on by default. */
    closeOnOverlayClick?: boolean;
    /** The dialog's body and footer. */
    children?: ReactNode;
}

/** How a dialog sizes its height from `sm` up: `content` takes its content's height, `hold` keeps one height, and
 *  `auto` takes its content's height unless its body fills the dialog (`Modal.Body layout="fill"`). */
type DialogHeight = 'auto' | 'content' | 'hold';

const heightClassName = {
    dialog: {
        auto: 'sm:h-auto sm:has-[[data-slot=modal-body][data-layout=fill]]:h-[min(44rem,calc(100dvh-2rem))]',
        content: 'sm:h-auto',
        hold: 'sm:h-[min(44rem,calc(100dvh-2rem))]',
    },
    workspace: {
        auto: 'sm:h-auto sm:has-[[data-slot=modal-body][data-layout=fill]]:h-[calc(100dvh-2rem)]',
        content: 'sm:h-auto',
        hold: 'sm:h-[calc(100dvh-2rem)]',
    },
} as const satisfies Record<string, Record<DialogHeight, string>>;

/** The expanded dialog's size, inline so it wins over every presentation's size classes. */
const expandedStyle = {
    width: 'calc(100vw - 2rem)',
    maxWidth: 'none',
    height: 'calc(100dvh - (52px + 1rem))',
    maxHeight: 'none',
    top: '52px',
    translate: '-50% 0',
} as const;

const ModalContent = forwardRef<HTMLDivElement, ModalContentPolicyProps>(
    (
        {
            accessibleTitle,
            children,
            closeOnEscape,
            closeOnOverlayClick,
            description,
            focusFirstField,
            headerActions,
            onPointerDownOutside,
            sidebar: sidebarContent,
            sidebarSections,
            presentation: requestedPresentation,
            expanded = false,
            fitsContent,
            title,
            ...props
        },
        ref,
    ) => {
        const sidebar = sidebarSections !== undefined && sidebarSections < 2 ? undefined : sidebarContent;
        const presentation =
            sidebarSections !== undefined && sidebarSections < 2 && requestedPresentation === 'paned'
                ? 'default'
                : (requestedPresentation ?? (sidebar ? 'paned' : 'default'));
        const descriptionId = useId();
        const describedBy = Object.hasOwn(props, 'aria-describedby')
            ? props['aria-describedby']
            : description
              ? descriptionId
              : undefined;
        const loading = useContext(ModalLoadingContext);
        const confirm = presentation === 'confirm';
        const focusProps = useModalAutoFocus(focusFirstField, !confirm);
        // Content height unless a changing body would make the dialog jump: tabs, or a body that fills the dialog.
        const height: DialogHeight =
            fitsContent === undefined
                ? presentation === 'paned' && sidebar
                    ? 'hold'
                    : 'auto'
                : fitsContent
                  ? 'content'
                  : 'hold';
        // A question opens on its safe answer (the footer's first button), never on the action it asks about; while
        // that answer is unavailable, on the dialog itself.
        const onOpenAutoFocus = (event: Event) => {
            focusProps.onOpenAutoFocus(event);

            const dialog = event.target;

            if (!confirm || event.defaultPrevented || !(dialog instanceof HTMLElement)) return;

            const safe = dialog.querySelector<HTMLButtonElement>('[data-slot="modal-footer"] button');

            event.preventDefault();
            (safe && !safe.disabled ? safe : dialog).focus({ preventScroll: true });
        };

        return (
            <NinnaModal.Content
                ref={ref}
                {...props}
                {...focusProps}
                {...{ onOpenAutoFocus }}
                {...(expanded && { 'data-expanded': true, style: expandedStyle })}
                title={accessibleTitle ?? title}
                description={description}
                aria-describedby={describedBy}
                closeOnEscape={loading ? false : closeOnEscape}
                closeOnOverlayClick={loading ? false : closeOnOverlayClick}
                onPointerDownOutside={(event) => {
                    if (event.target instanceof Element && event.target.closest('[data-slot="toaster"]')) {
                        event.preventDefault();
                    }

                    onPointerDownOutside?.(event);
                }}
                size={presentation === 'workspace' ? 'full' : undefined}
                // The frame never scrolls, not even by a scrollIntoView or focus inside it: `clip` is not a scroll
                // container (`hidden` is), so only the body scrolls and the title, close and footer stay put.
                data-height={height}
                className={`flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] flex-col overflow-clip sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] ${
                    sidebar ? 'md:grid md:grid-cols-[14rem_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)]' : ''
                } ${
                    presentation === 'workspace'
                        ? 'h-[calc(100dvh-1rem)] max-w-6xl sm:max-w-6xl'
                        : presentation === 'paned'
                          ? 'h-[calc(100dvh-1rem)] max-w-4xl sm:max-w-4xl'
                          : presentation === 'confirm'
                            ? 'max-w-md sm:max-w-md'
                            : 'max-w-160 sm:max-w-160'
                } ${heightClassName[presentation === 'workspace' ? 'workspace' : 'dialog'][height]}`}
            >
                {/* Remounted when the sidebar comes or goes: Chromium otherwise leaves its row unlaid when the dialog
                    switches between grid and flex while open (an Add library dialog changing its kind). */}
                <header
                    key={sidebar ? 'paned' : 'plain'}
                    data-slot="modal-header"
                    className={`@container min-w-0 shrink-0 px-5 pt-5 sm:px-6 sm:pt-6 ${
                        description ? (sidebar ? 'pb-4 md:pb-0' : '') : 'pb-4'
                    } ${sidebar ? 'md:col-start-2 md:row-start-1' : ''}`}
                >
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-3">
                        <HeadingBase as="h2" className="min-w-0 flex-1 wrap-break-word" variant="section">
                            {title}
                        </HeadingBase>
                        {headerActions ? (
                            <div className="order-3 flex basis-full items-center justify-end gap-2 @lg:order-0 @lg:ml-auto @lg:basis-auto">
                                {headerActions}
                            </div>
                        ) : null}
                        {confirm ? null : (
                            <div className="shrink-0">
                                <ModalClose />
                            </div>
                        )}
                    </div>
                </header>
                {sidebar ? (
                    <div className="min-h-0 min-w-0 shrink-0 md:col-start-1 md:row-span-2 md:row-start-1">
                        {sidebar}
                    </div>
                ) : null}
                <div
                    className={`flex min-h-0 min-w-0 flex-1 flex-col ${sidebar ? 'md:col-start-2 md:row-start-2' : ''}`}
                >
                    {description ? (
                        <TextBase
                            id={descriptionId}
                            className={`shrink-0 px-5 pb-4 sm:px-6 ${sidebar ? 'pt-4 md:pt-2' : 'pt-2'}`}
                            tone="muted"
                        >
                            {description}
                        </TextBase>
                    ) : null}
                    <CompactAlertContext value={true}>{children}</CompactAlertContext>
                </div>
            </NinnaModal.Content>
        );
    },
);

ModalContent.displayName = 'Modal.Content';

type ModalBodyPolicyProps = Omit<ModalBodyProps, 'className' | 'color' | 'style'> & {
    /** `scroll` (the default) scrolls long content with fading edges; `fill` gives its content the body's height, as
     *  for an editor. */
    layout?: 'scroll' | 'fill';
    /** The dialog's content. */
    children?: ReactNode;
};

const ModalBody = forwardRef<HTMLDivElement, ModalBodyPolicyProps>(
    ({ layout = 'scroll', children, ...props }, ref: Ref<HTMLDivElement>) => {
        const { setViewport, setContent, className } = useScrollFade({ body: true });
        const bodyRef = useCallback(
            (element: HTMLDivElement) => {
                setViewport(element);

                const cleanup = typeof ref === 'function' ? ref(element) : undefined;

                if (ref && typeof ref !== 'function') ref.current = element;

                return () => {
                    setViewport(null);

                    if (typeof cleanup === 'function') cleanup();
                    else if (typeof ref === 'function') ref(null);
                    else if (ref) ref.current = null;
                };
            },
            [ref, setViewport],
        );

        return (
            <NinnaModal.Body
                tabIndex={0}
                ref={bodyRef}
                {...props}
                data-layout={layout}
                className={`relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-6 sm:px-6 ${layout === 'fill' ? 'flex flex-col' : ''} ${className}`}
            >
                <div
                    ref={setContent}
                    className={layout === 'fill' ? 'flex min-h-0 flex-1 flex-col gap-3' : 'flow-root'}
                >
                    <CompactAlertContext value={true}>{children}</CompactAlertContext>
                </div>
            </NinnaModal.Body>
        );
    },
);

ModalBody.displayName = 'Modal.Body';

function ModalForm(props: Omit<ComponentProps<'form'>, 'className' | 'color' | 'style'>) {
    return <form {...props} className="flex min-h-0 flex-1 flex-col" />;
}

function ModalPane({
    active,
    children,
}: {
    /** The pane the sidebar has chosen: the only one shown. */
    active: boolean;
    /** The pane's body and footer. */
    children: ReactNode;
}) {
    return (
        <div hidden={!active} className={active ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
            <CompactAlertContext value={true}>{children}</CompactAlertContext>
        </div>
    );
}

type ModalFooterPolicyProps = Omit<ModalFooterProps, 'className' | 'color' | 'style'> & {
    /** Something at the footer's start, apart from the dialog's actions: a delete action, a quiet note, or a one-shot
     *  option for this submit only ("Scan for changes now", "Create issue"), which is always a Checkbox with its
     *  label, unticked or ticked as the default suggests. Never a Switch there: a Switch sets something that stays,
     *  and belongs in the form's rows. */
    leading?: ReactNode;
    /** The dialog's actions, its primary one last. */
    children?: ReactNode;
};

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterPolicyProps>(({ leading, children, ...props }, ref) => (
    <NinnaModal.Footer
        ref={ref}
        {...props}
        className="border-line bg-surface-page/60 shrink-0 border-t px-5 py-4 sm:px-6 sm:pb-4"
    >
        {leading ? <div className="mr-auto min-w-0 basis-full pb-2 sm:basis-auto sm:pb-0">{leading}</div> : null}
        <CompactAlertContext value={true}>{children}</CompactAlertContext>
    </NinnaModal.Footer>
));

ModalFooter.displayName = 'Modal.Footer';

/** The footer's Cancel: a secondary button that closes the dialog through its dirty-dismiss guard (useModalClose), so
 *  unsaved changes are asked about here as on Escape. Disabled while an action is in flight. */
function ModalCancel({ children, disabled = false }: { children?: ReactNode; disabled?: boolean }) {
    const labels = useDesignSystemLabels();
    const loading = useContext(ModalLoadingContext);
    const requestClose = useModalClose();

    return (
        <Button type="button" variant="secondary" disabled={disabled || loading} onClick={() => requestClose()}>
            {children ?? labels.cancel}
        </Button>
    );
}

function ModalClose() {
    const labels = useDesignSystemLabels();
    const loading = useContext(ModalLoadingContext);

    return (
        <NinnaModal.Close asChild>
            <IconButton aria-label={labels.close} disabled={loading} icon={<XIcon />} variant="header" />
        </NinnaModal.Close>
    );
}

/** The words of the discard question, where a dialog wants its own, such as "Discard album changes?". */
interface ModalDiscardLabels {
    /** The question, such as "Discard changes?". */
    title?: string;
    /** What discarding loses, in a sentence. */
    consequence?: string;
    /** The confirm button, the action itself, such as "Discard changes". */
    confirmLabel?: string;
    /** The way back to the form, such as "Keep editing". */
    cancelLabel?: string;
}

interface ModalRootPolicyProps {
    /** The dialog: a Modal.Content. */
    children: ReactNode;
    /** An action in flight: the dialog can't close and its close button is disabled until it ends. */
    loading?: boolean;
    /** The dialog holds changes the reader hasn't saved: Escape, a click outside, the close button, a footer Cancel and
     *  any `useModalClose()` request (such as a link to another dialog) first ask to discard them (ConfirmDialog's
     *  look), and go on only on "Discard". */
    dirty?: boolean;
    /** The discard question's words where this dialog wants its own; the design system's labels otherwise. */
    discardLabels?: ModalDiscardLabels;
    /** Called as the reader closes the dialog, by Escape, a click outside or the close button (after the discard
     *  question, while `dirty`). */
    onClose: () => void;
}

function ModalRoot({ children, loading = false, dirty = false, discardLabels, onClose }: ModalRootPolicyProps) {
    // While asking, where "Discard" goes: the caller's `next`, or the dialog's own onClose.
    const [asking, setAsking] = useState<{ leave: () => void } | null>(null);
    const requestClose = useCallback<ModalRequestClose>(
        (next) => {
            if (loading) return;

            const leave = typeof next === 'function' ? next : onClose;

            if (dirty) setAsking({ leave });
            else leave();
        },
        [dirty, loading, onClose],
    );

    return (
        <ModalLoadingContext.Provider value={loading}>
            <ModalCloseContext.Provider value={requestClose}>
                <NinnaModal open onOpenChange={(open) => !open && requestClose()}>
                    <CompactAlertContext value={true}>{children}</CompactAlertContext>
                </NinnaModal>
                {asking ? (
                    <DiscardChanges
                        labels={discardLabels}
                        onKeepEditing={() => setAsking(null)}
                        onDiscard={() => {
                            setAsking(null);
                            asking.leave();
                        }}
                    />
                ) : null}
            </ModalCloseContext.Provider>
        </ModalLoadingContext.Provider>
    );
}

/** The discard question over a dirty dialog, in ConfirmDialog's look: a confirm-sized alert dialog whose Escape, click
 *  outside and close button keep editing, and whose one destructive button discards. */
function DiscardChanges({
    labels: own,
    onKeepEditing,
    onDiscard,
}: {
    labels: ModalDiscardLabels | undefined;
    onKeepEditing: () => void;
    onDiscard: () => void;
}) {
    const labels = useDesignSystemLabels().dialog;

    return (
        <ModalLoadingContext.Provider value={false}>
            <ModalCloseContext.Provider value={() => onKeepEditing()}>
                <NinnaModal open onOpenChange={(open) => !open && onKeepEditing()}>
                    <ModalContent
                        role="alertdialog"
                        presentation="confirm"
                        title={own?.title ?? labels.discardTitle}
                        description={own?.consequence ?? labels.discardConsequence}
                        data-slot="discard-changes"
                    >
                        <ModalFooter>
                            <Button type="button" variant="secondary" onClick={onKeepEditing}>
                                {own?.cancelLabel ?? labels.keepEditing}
                            </Button>
                            <Button type="button" variant="destructive" wrap onClick={onDiscard}>
                                {own?.confirmLabel ?? labels.discardConfirm}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </NinnaModal>
            </ModalCloseContext.Provider>
        </ModalLoadingContext.Provider>
    );
}

export const Modal = Object.assign(ModalRoot, {
    Body: ModalBody,
    Form: ModalForm,
    Pane: ModalPane,
    Content: ModalContent,
    Footer: ModalFooter,
    Cancel: ModalCancel,
});
