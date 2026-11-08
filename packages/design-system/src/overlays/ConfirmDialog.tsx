import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { AlertBase } from '../feedback/Alert';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
    /** Optional stable dialog identity and product test hooks. */
    id?: string;
    [key: `data-${string}`]: string | number | boolean | undefined;
    /** An inspection or permission can hold confirmation without blocking cancellation. */
    confirmDisabled?: boolean;
    /** An unknown outcome can hold cancellation until it is reconciled. */
    cancelDisabled?: boolean;
    /** An optional secondary alternative, before the primary confirm action. */
    secondaryAction?: ReactNode;
    /** The question, naming what it acts on, such as "Delete Music?". */
    title: string;
    /** What happens if the reader confirms, in a sentence or two, such as "Lar forgets its albums and play history." */
    consequence: string;
    /** A calm note of what stays safe, such as "The files in /srv/shared stay on disk.", shown as an `info` Alert
     *  (every notice's one recipe). Not a warning: the consequence and the confirm button already carry the danger. */
    reassurance?: ReactNode;
    /** The confirm button's words, always the action itself, such as "Delete project"; never "OK" or "Yes". */
    confirmLabel: string;
    /** The cancel button's words; the design system's "Cancel" by default. */
    cancelLabel?: string;
    /** `destructive` (the default) for an action that destroys or removes something, its confirm in the danger
     *  colour; `default` for one that doesn't, its confirm the primary button. */
    intent?: 'destructive' | 'default';
    /** The action is in flight: the confirm button spins and keeps the focus, and the dialog can't close. */
    busy?: boolean;
    /** Something else the reader must see before confirming, such as a short list of what goes with it. */
    children?: ReactNode;
    /** Called as the reader confirms. */
    onConfirm: () => void;
    /** Called as the reader cancels: the cancel button, Escape, a click outside or the close button. */
    onCancel: () => void;
}

/** Asks before an action that can't be undone: "Delete {name}?", what it does, an optional calm note (an info Alert) of what stays
 *  safe, and Cancel beside an explicit confirm button in the Modal footer. A compact Modal, read as an alert dialog. */
export function ConfirmDialog({
    id,
    title,
    consequence,
    reassurance,
    confirmLabel,
    cancelLabel,
    intent = 'destructive',
    busy = false,
    children,
    onConfirm,
    onCancel,
    confirmDisabled = false,
    cancelDisabled = false,
    secondaryAction,
    ...data
}: ConfirmDialogProps) {
    const labels = useDesignSystemLabels();

    return (
        <Modal loading={busy} onClose={onCancel}>
            <Modal.Content
                {...data}
                id={id}
                role="alertdialog"
                presentation="confirm"
                title={title}
                description={consequence}
            >
                {reassurance || children ? (
                    <Modal.Body>
                        <div className="flex flex-col gap-3">
                            {children}
                            {reassurance ? <AlertBase tone="info" message={reassurance} /> : null}
                        </div>
                    </Modal.Body>
                ) : null}
                <Modal.Footer>
                    <Button type="button" variant="secondary" disabled={busy || cancelDisabled} onClick={onCancel}>
                        {cancelLabel ?? labels.cancel}
                    </Button>
                    {secondaryAction}
                    <Button
                        type="button"
                        variant={intent === 'destructive' ? 'destructive' : 'primary'}
                        wrap
                        busy={busy}
                        disabled={confirmDisabled}
                        onClick={() => {
                            if (!busy && !confirmDisabled) onConfirm();
                        }}
                    >
                        {confirmLabel}
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
