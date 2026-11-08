import type { ReactNode } from 'react';

import { Button } from '../actions/Button';
import { Modal } from './Modal';

interface ActionModalProps {
    /** The dialog's accessible name where it differs from the visible `title`. */
    accessibleTitle?: string;
    /** `danger` for an action that destroys something; `primary` by default. */
    actionColor?: 'danger' | 'primary';
    /** The action can't run yet, such as while a required field is empty. */
    actionDisabled?: boolean;
    /** The form holds unsaved changes: closing it any way but the action asks to discard them (Modal's `dirty`). */
    dirty?: boolean;
    /** The action button's text, a verb such as "Save". */
    actionLabel: string;
    /** The dialog's form fields or content. */
    children?: ReactNode;
    /** `scroll` (the default) scrolls long content; `fill` gives it the body's height. */
    bodyLayout?: 'scroll' | 'fill';
    /** A line under the title that says what the action does. */
    description: string;
    /** Something at the footer's start, apart from the actions, such as a note. */
    footerLeading?: ReactNode;
    /** Controls in the header before the close button. */
    headerActions?: ReactNode;
    /** The action is in flight: the button spins and the dialog can't close. */
    loading: boolean;
    /** Called as the form is submitted. */
    onAction: () => void;
    /** Called as the reader cancels or closes the dialog. */
    onClose: () => void;
    /** A pane beside the body, such as a list of sections. */
    sidebar?: ReactNode;
    /** Skips the browser's own validation, for a form that validates itself. */
    noValidate?: boolean;
    /** The dialog's heading. */
    title: string;
}

export function ActionModal({
    accessibleTitle,
    actionColor = 'primary',
    actionDisabled = false,
    actionLabel,
    children,
    bodyLayout,
    description,
    dirty = false,
    footerLeading,
    headerActions,
    loading,
    onAction,
    onClose,
    sidebar,
    noValidate,
    title,
}: ActionModalProps) {
    return (
        <Modal loading={loading} dirty={dirty} onClose={onClose}>
            <Modal.Content
                title={title}
                accessibleTitle={accessibleTitle}
                description={description}
                sidebar={sidebar}
                headerActions={headerActions}
            >
                <Modal.Form
                    noValidate={noValidate}
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!loading && !actionDisabled) {
                            onAction();
                        }
                    }}
                >
                    <Modal.Body layout={bodyLayout}>{children}</Modal.Body>
                    <Modal.Footer leading={footerLeading}>
                        <Modal.Cancel />
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading || actionDisabled}
                            variant={actionColor === 'danger' ? 'destructive' : 'primary'}
                        >
                            {actionLabel}
                        </Button>
                    </Modal.Footer>
                </Modal.Form>
            </Modal.Content>
        </Modal>
    );
}
