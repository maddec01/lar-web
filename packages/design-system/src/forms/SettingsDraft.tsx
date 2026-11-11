/* oxlint-disable react/only-export-components -- The draft registry's provider, hooks and footer belong together. */

import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';

import { Button } from '../actions/Button';
import { Alert } from '../feedback/Alert';
import { showNotification } from '../feedback/Notifications';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Text } from '../typography/Typography';

/**
 * Settings' one save model. A switch, a select or a segmented control applies at once: the control is the feedback. A
 * typed value (a number, a name, a key) is a draft: the part that holds it reports it with useSettingsDraft, and while
 * any draft is unsaved the settings' footer shows "Cancel" and "Save changes", and closing the dialog, changing section
 * or pressing Escape asks before the draft is lost. Saving saves every unsaved draft at once, then says so in a toast.
 */
export interface SettingsDraftOptions {
    /** The draft differs from what is saved. */
    dirty: boolean;
    /** Saves the draft. Return the save's promise: the footer shows it in flight, and only a resolved save counts as
     *  saved; a rejected one leaves the draft (and its `error`) in place. Without it the draft only guards against
     *  losing it, and its part brings its own save (SettingsFooter). */
    save?: () => unknown;
    /** Throws the draft away, back to the saved value: the footer's Cancel. */
    reset?: () => void;
    /** The draft can't be saved as it is, such as a number out of range: Save is held. Say why beside the field. */
    invalid?: boolean;
    /** Why the last save failed, shown in the footer (and best beside the field too). */
    error?: string | null;
}

/** A draft as the registry keeps it: what it says now, and its latest actions. */
interface DraftState {
    dirty: boolean;
    savable: boolean;
    invalid: boolean;
    error: string | null;
}

interface SettingsDraftRegistry {
    /** Records a part's draft, or forgets it (null) as the part goes. */
    report: (id: string, state: DraftState | null) => void;
    /** The parts' latest actions, by id. */
    actions: Map<string, { current: SettingsDraftOptions }>;
    /** Saves every unsaved draft. */
    save: () => void;
    /** Throws every unsaved draft away. */
    cancel: () => void;
    /** Where a part's own footer goes (SettingsFooter): the settings' footer, under the scrolling content. */
    footer: HTMLElement | null;
}

const SettingsDraftContext = createContext<SettingsDraftRegistry | undefined>(undefined);

/** What the settings' drafts amount to, for the dialog or page that shows them. */
const SettingsDraftSummaryContext = createContext<{
    dirty: boolean;
    pending: boolean;
    invalid: boolean;
    saving: boolean;
    error: string | null;
}>({ dirty: false, pending: false, invalid: false, saving: false, error: null });

/** The record of a settings surface's unsaved drafts, which SettingsDialog and SettingsPage each hold. `onSaved` replaces
 *  the "Saved" toast after a save. */
export function useSettingsDrafts({ onSaved }: { onSaved?: () => void } = {}) {
    const labels = useDesignSystemLabels().settings;
    const [drafts, setDrafts] = useState<ReadonlyMap<string, DraftState>>(new Map());
    const [footer, setFooter] = useState<HTMLElement | null>(null);
    const [saving, setSaving] = useState(false);
    const [failed, setFailed] = useState(false);
    const [actions] = useState(() => new Map<string, { current: SettingsDraftOptions }>());
    const saved = useRef(onSaved);

    useLayoutEffect(() => {
        saved.current = onSaved;
    });

    const report = useCallback((id: string, state: DraftState | null) => {
        setDrafts((current) => {
            const was = current.get(id);

            if (
                state === null
                    ? !was
                    : was &&
                      was.dirty === state.dirty &&
                      was.savable === state.savable &&
                      was.invalid === state.invalid &&
                      was.error === state.error
            )
                return current;

            const next = new Map(current);

            if (state === null) next.delete(id);
            else next.set(id, state);

            return next;
        });
    }, []);

    const pendingIds = [...drafts].filter(([, state]) => state.dirty && state.savable).map(([id]) => id);
    const pending = pendingIds.length > 0;
    const invalid = [...drafts.values()].some((state) => state.dirty && state.invalid);
    const draftError = [...drafts.values()].find((state) => state.dirty && state.error)?.error ?? null;
    const error = draftError ?? (failed && pending ? labels.saveFailed : null);
    const latest = useRef({ pendingIds, saving, invalid });

    useLayoutEffect(() => {
        latest.current = { pendingIds, saving, invalid };
    });

    const save = useCallback(() => {
        const { pendingIds: ids, saving: busy, invalid: held } = latest.current;

        if (busy || held || !ids.length) return;

        setSaving(true);
        setFailed(false);
        void Promise.allSettled(ids.map((id) => Promise.resolve().then(() => actions.get(id)?.current.save?.()))).then(
            (results) => {
                setSaving(false);

                if (results.some((result) => result.status === 'rejected')) {
                    setFailed(true);

                    return;
                }

                if (saved.current) saved.current();
                else showNotification({ slot: 'settings-saved', tone: 'success', title: labels.saved });
            },
        );
    }, [actions, labels.saved]);

    const cancel = useCallback(() => {
        setFailed(false);

        for (const id of latest.current.pendingIds) actions.get(id)?.current.reset?.();
    }, [actions]);

    const registry = useMemo(
        () => ({ report, actions, save, cancel, footer }),
        [report, actions, save, cancel, footer],
    );
    const summary = useMemo(
        () => ({ dirty: [...drafts.values()].some((state) => state.dirty), pending, invalid, saving, error }),
        [drafts, pending, invalid, saving, error],
    );

    return { registry, summary, setFooter };
}

/** Gives a settings surface's parts its draft registry (useSettingsDrafts' `registry` and `summary`). */
export function SettingsDraftProvider({
    registry,
    summary,
    children,
}: {
    /** The registry, from useSettingsDrafts. */
    registry: SettingsDraftRegistry;
    /** What the drafts amount to, from useSettingsDrafts; SettingsSaveBar reads it. */
    summary?: ReturnType<typeof useSettingsDrafts>['summary'];
    /** The settings' content. */
    children: ReactNode;
}) {
    return (
        <SettingsDraftContext value={registry}>
            {summary ? <SettingsDraftSummaryContext value={summary}>{children}</SettingsDraftSummaryContext> : children}
        </SettingsDraftContext>
    );
}

/**
 * Reports a part's typed draft to the settings around it, until the part goes. Given only `dirty` (or a boolean), the
 * draft just guards against being lost; with `save` (and `reset`), the settings' footer saves (or cancels) it with the
 * others. Returns `submit`, which saves every draft as the footer's Save does: call it from the part's form's submit,
 * so Enter in a field saves.
 */
export function useSettingsDraft(draft: boolean | SettingsDraftOptions): { submit: () => void } {
    const id = useId();
    const registry = useContext(SettingsDraftContext);
    const options: SettingsDraftOptions = typeof draft === 'boolean' ? { dirty: draft } : draft;
    const latest = useRef(options);
    const report = registry?.report;
    const actions = registry?.actions;
    const { dirty, invalid = false, error = null } = options;
    const savable = Boolean(options.save);

    useLayoutEffect(() => {
        latest.current = options;
    });

    useLayoutEffect(() => {
        if (!actions) return;

        actions.set(id, latest);

        return () => {
            actions.delete(id);
        };
    }, [actions, id]);

    useEffect(() => {
        report?.(id, { dirty, savable, invalid, error });
    }, [dirty, savable, invalid, error, id, report]);
    useEffect(() => () => report?.(id, null), [id, report]);

    const save = registry?.save;

    return { submit: useCallback(() => save?.(), [save]) };
}

/** A part's own save bar, for a draft with its own save flow (a test before saving, a note on what is unsaved): kept
 *  in the settings' footer while the content scrolls; in place outside a settings surface. */
export function SettingsFooter({
    leading,
    children,
}: {
    /** Something at the footer's start, such as what is unsaved or why the save failed. */
    leading?: ReactNode;
    /** The bar's actions, its primary one last. */
    children: ReactNode;
}) {
    const footer = useContext(SettingsDraftContext)?.footer;
    const content = <SettingsFooterBar leading={leading}>{children}</SettingsFooterBar>;

    return footer ? createPortal(content, footer) : content;
}

/** The footer's one look, in the dialog's glass footer zone or a page's sticky bar: a leading note, then the actions. */
function SettingsFooterBar({ leading, children }: { leading?: ReactNode; children: ReactNode }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
            {leading ? <div className="mr-auto min-w-0 basis-full pb-1 sm:basis-auto sm:pb-0">{leading}</div> : null}
            {children}
        </div>
    );
}

/** The settings' save bar: "Cancel" and "Save changes" while a draft is unsaved, what is wrong when a save failed, and
 *  nothing at all while every draft is saved. SettingsDialog and SettingsPage show it; it reads their drafts. */
export function SettingsSaveBar() {
    const labels = useDesignSystemLabels();
    const registry = useContext(SettingsDraftContext);
    const { pending, invalid, saving, error } = useContext(SettingsDraftSummaryContext);

    if (!pending || !registry) return null;

    return (
        <SettingsFooterBar
            leading={
                error ? (
                    <Alert size="sm" tone="danger" message={error} />
                ) : (
                    <Text as="span" variant="caption" tone="muted">
                        {labels.settings.unsaved}
                    </Text>
                )
            }
        >
            <Button type="button" variant="secondary" disabled={saving} onClick={registry.cancel}>
                {labels.cancel}
            </Button>
            <Button type="button" variant="primary" disabled={invalid} loading={saving} onClick={registry.save}>
                {labels.settings.saveChanges}
            </Button>
        </SettingsFooterBar>
    );
}
