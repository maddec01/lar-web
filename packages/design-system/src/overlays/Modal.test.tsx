import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { type ReactNode, useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { showErrorNotification } from '../feedback/ErrorNotification';
import { Notifications } from '../feedback/Notifications';
import { Input } from '../forms';
import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import { SidebarNavigationItem, SidebarPane } from '../layout';
import { ActionModal } from './ActionModal';
import { Modal, useModalClose } from './Modal';

function renderDialog(children: ReactNode) {
    return render(children, {
        wrapper: ({ children }) => <DesignSystemProvider>{children}</DesignSystemProvider>,
    });
}

function FormDialog({ children, sidebar }: { children: ReactNode; sidebar?: ReactNode }) {
    return (
        <Modal onClose={() => undefined}>
            <Modal.Content title="Edit settings" description="Change your settings" sidebar={sidebar}>
                <Modal.Body>{children}</Modal.Body>
            </Modal.Content>
        </Modal>
    );
}

/** A link in the dialog to another one, leaving through the dialog's dirty guard. */
function OpenOther({ other, onOpen }: { other: string; onOpen: (catalog: string) => void }) {
    const requestClose = useModalClose();

    return (
        <button type="button" onClick={() => requestClose(() => onOpen(other))}>
            Open {other}
        </button>
    );
}

/** One catalog's editor, dirty once its name changes, with a link that opens the other catalog's editor in its place. */
function CatalogEditor({
    catalog,
    onOpen,
    onClose,
}: {
    catalog: string;
    onOpen: (catalog: string) => void;
    onClose: () => void;
}) {
    const [name, setName] = useState(catalog);
    const other = catalog === 'Family photos' ? 'Holiday photos' : 'Family photos';

    return (
        <Modal dirty={name !== catalog} onClose={onClose}>
            <Modal.Content title={`Edit ${catalog}`}>
                <Modal.Body>
                    <Input aria-label="Name" value={name} onChange={(event) => setName(event.target.value)} />
                    <OpenOther other={other} onOpen={onOpen} />
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}

function LinkedEditors({ onClose }: { onClose: () => void }) {
    const [catalog, setCatalog] = useState('Family photos');

    return <CatalogEditor key={catalog} catalog={catalog} onOpen={setCatalog} onClose={onClose} />;
}

const question = () => screen.queryByRole('alertdialog');
const pressEscape = () => fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
const rename = (name: string) =>
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: name } });

describe('modal dirty guard', () => {
    it('closes once the reader discards, and Escape on the question keeps editing', async () => {
        const onClose = vi.fn();

        renderDialog(<LinkedEditors onClose={onClose} />);
        rename('Holiday photos');
        pressEscape();
        expect(question()).toBeInTheDocument();
        pressEscape();
        await waitFor(() => expect(question()).not.toBeInTheDocument());
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Holiday photos');

        pressEscape();
        fireEvent.click(within(question()!).getByRole('button', { name: 'Discard changes' }));
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('asks before leaving a dirty editor for another dialog, then goes there instead of closing', async () => {
        const onClose = vi.fn();

        renderDialog(<LinkedEditors onClose={onClose} />);
        fireEvent.click(screen.getByRole('button', { name: 'Open Holiday photos' }));
        expect(screen.getByRole('dialog', { name: 'Edit Holiday photos' })).toBeInTheDocument();
        expect(question()).not.toBeInTheDocument();

        rename('Holidays');
        fireEvent.click(screen.getByRole('button', { name: 'Open Family photos' }));
        expect(question()).toBeInTheDocument();
        fireEvent.click(within(question()!).getByRole('button', { name: 'Discard changes' }));
        await waitFor(() => expect(screen.getByRole('dialog', { name: 'Edit Family photos' })).toBeInTheDocument());
        expect(onClose).not.toHaveBeenCalled();
    });
});

describe('modal dismissal', () => {
    it('dismisses a notification without closing the modal, then still allows backdrop dismissal', async () => {
        const onClose = vi.fn();

        renderDialog(
            <>
                <Modal onClose={onClose}>
                    <Modal.Content title="Edit settings">
                        <Modal.Body>
                            <Input aria-label="Name" />
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
                <Notifications />
            </>,
        );

        await act(async () => {
            showErrorNotification({ title: 'Save failed', description: 'Please try again.' });
            // The dialog registers its outside-pointer listener on the next tick.
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        const notification = screen.getByRole('alert', { hidden: true });
        const dismiss = within(notification).getByRole('button', { name: 'Close', hidden: true });

        fireEvent.pointerDown(dismiss, { button: 0 });
        fireEvent.pointerUp(dismiss, { button: 0 });
        fireEvent.click(dismiss);

        expect(notification).not.toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();

        const overlay = screen.getByRole('dialog', { name: 'Edit settings' }).previousElementSibling;

        if (!overlay) throw new Error('Modal overlay is missing');

        fireEvent.pointerDown(overlay, { button: 0 });
        fireEvent.pointerUp(overlay, { button: 0 });
        fireEvent.click(overlay);
        expect(onClose).toHaveBeenCalledOnce();
    });
});

describe('modal focus', () => {
    it('focuses and selects the first editable field, skipping unavailable fields', () => {
        renderDialog(
            <FormDialog
                sidebar={
                    <SidebarPane label="Settings navigation">
                        <SidebarNavigationItem active>
                            <button type="button" aria-current="page">
                                General
                            </button>
                        </SidebarNavigationItem>
                    </SidebarPane>
                }
            >
                <Input aria-label="Read only" readOnly defaultValue="Read only" />
                <fieldset disabled>
                    <Input aria-label="Disabled" />
                </fieldset>
                <div hidden>
                    <Input aria-label="Hidden" />
                </div>
                <div style={{ display: 'none' }}>
                    <Input aria-label="Collapsed" />
                </div>
                <details>
                    <summary>Advanced</summary>
                    <Input aria-label="Advanced field" />
                </details>
                <Input aria-label="Name" defaultValue="My catalog" />
                <Input aria-label="Path" />
            </FormDialog>,
        );

        const name = screen.getByRole<HTMLInputElement>('textbox', { name: 'Name' });

        expect(name).toHaveFocus();
        expect(name.selectionStart).toBe(0);
        expect(name.selectionEnd).toBe('My catalog'.length);
    });

    it('waits for a loading field, then stops selecting it on subsequent updates', async () => {
        const view = renderDialog(
            <FormDialog>
                <Input aria-label="Name" disabled />
            </FormDialog>,
        );

        view.rerender(
            <FormDialog>
                <Input aria-label="Name" />
            </FormDialog>,
        );

        const name = screen.getByRole<HTMLInputElement>('textbox', { name: 'Name' });

        await waitFor(() => expect(name).toHaveFocus());
        fireEvent.change(name, { target: { value: 'Edited name' } });
        name.setSelectionRange(3, 3);
        view.rerender(
            <FormDialog>
                <Input aria-label="Name" />
                <Input aria-label="Loaded later" />
            </FormDialog>,
        );
        await act(async () => undefined);

        expect(name).toHaveFocus();
        expect(name.selectionStart).toBe(3);
        expect(name.selectionEnd).toBe(3);
    });

    it.each(['pointerdown', 'keydown'])('does not move focus after %s interaction while fields load', async (event) => {
        const view = renderDialog(
            <FormDialog>
                <Input aria-label="Name" disabled />
            </FormDialog>,
        );
        const close = screen.getByRole('button', { name: 'Close' });

        expect(screen.getByRole('dialog')).toHaveFocus();
        act(() => close.focus());

        if (event === 'pointerdown') fireEvent.pointerDown(close);
        else fireEvent.keyDown(close, { key: 'Tab' });

        view.rerender(
            <FormDialog>
                <Input aria-label="Name" />
            </FormDialog>,
        );
        await act(async () => undefined);

        expect(close).toHaveFocus();
    });

    it('focuses a nested dialog and restores focus to the parent when it closes', async () => {
        function NestedDialogs() {
            const [open, setOpen] = useState(false);

            return (
                <FormDialog>
                    <Input aria-label="Parent name" />
                    <button type="button" onClick={() => setOpen(true)}>
                        Open child
                    </button>
                    {open ? (
                        <Modal onClose={() => setOpen(false)}>
                            <Modal.Content title="Child" description="Nested form">
                                <Modal.Body>
                                    <Input aria-label="Child name" />
                                </Modal.Body>
                            </Modal.Content>
                        </Modal>
                    ) : null}
                </FormDialog>
            );
        }

        renderDialog(<NestedDialogs />);

        const opener = screen.getByRole('button', { name: 'Open child' });

        act(() => opener.focus());
        fireEvent.click(opener);
        expect(screen.getByRole('textbox', { name: 'Child name' })).toHaveFocus();
        fireEvent.click(within(screen.getByRole('dialog', { name: 'Child' })).getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(opener).toHaveFocus());
        expect(screen.getByRole('dialog', { name: 'Edit settings' })).toBeInTheDocument();
    });

    it('keeps confirmations dismissible without focusing the destructive action', () => {
        const onClose = vi.fn();

        renderDialog(
            <ActionModal
                title="Delete catalog"
                description="Confirm deletion"
                actionLabel="Delete"
                actionColor="danger"
                loading={false}
                onAction={() => undefined}
                onClose={onClose}
            >
                <p>Delete this catalog?</p>
            </ActionModal>,
        );

        expect(screen.getByRole('dialog')).toHaveFocus();
        expect(screen.getByRole('button', { name: 'Delete' })).not.toHaveFocus();
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(onClose).toHaveBeenCalledOnce();
    });
});
