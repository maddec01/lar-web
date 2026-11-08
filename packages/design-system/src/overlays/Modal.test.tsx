import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createRef, type ReactNode, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

import { showErrorNotification } from '../feedback/ErrorNotification';
import { Notifications } from '../feedback/Notifications';
import { Input, Select, SelectItem } from '../forms';
import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import { SidebarNavigationItem, SidebarPane } from '../layout';
import { ActionModal } from './ActionModal';
import { Modal } from './Modal';

function renderDialog(children: ReactNode) {
    return render(children, {
        wrapper: ({ children }) => <DesignSystemProvider>{children}</DesignSystemProvider>,
    });
}

function FormDialog({
    children,
    focusFirstField,
    sidebar,
}: {
    children: ReactNode;
    focusFirstField?: boolean;
    sidebar?: ReactNode;
}) {
    return (
        <Modal onClose={() => undefined}>
            <Modal.Content
                title="Edit settings"
                description="Change your settings"
                focusFirstField={focusFirstField}
                sidebar={sidebar}
            >
                <Modal.Body>{children}</Modal.Body>
            </Modal.Content>
        </Modal>
    );
}

describe('modal body overflow', () => {
    const observers = new Set<ControlledResizeObserver>();

    class ControlledResizeObserver {
        elements = new Set<Element>();
        disconnect = vi.fn(() => this.elements.clear());
        private callback: ResizeObserverCallback;

        constructor(callback: ResizeObserverCallback) {
            this.callback = callback;
            observers.add(this);
        }
        observe(element: Element) {
            this.elements.add(element);
        }
        unobserve(element: Element) {
            this.elements.delete(element);
        }
        resize(element: Element) {
            if (this.elements.has(element)) this.callback([], this);
        }
    }

    beforeEach(() => {
        observers.clear();
        vi.stubGlobal('ResizeObserver', ControlledResizeObserver);
    });

    afterEach(() => vi.unstubAllGlobals());

    it('measures on attachment and follows hidden distances back to both boundaries', () => {
        const metrics = { scrollTop: 0, scrollHeight: 100, clientHeight: 100 };
        const onScroll = vi.fn();
        const ref = vi.fn((element: HTMLDivElement | null) => {
            if (!element) return;

            for (const key of ['scrollTop', 'scrollHeight', 'clientHeight'] as const) {
                Object.defineProperty(element, key, { configurable: true, get: () => metrics[key] });
            }
        });
        const view = renderDialog(
            <Modal onClose={() => undefined}>
                <Modal.Content title="Overflow" focusFirstField={false}>
                    <Modal.Body ref={ref} onScroll={onScroll} aria-label="Scrollable content">
                        <p>Content</p>
                    </Modal.Body>
                </Modal.Content>
            </Modal>,
        );
        const body = screen.getByLabelText('Scrollable content');
        const expectDistances = (top: number, bottom: number) => {
            expect(body.style.getPropertyValue('--scroll-fade-top')).toBe(`${top}px`);
            expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe(`${bottom}px`);
        };

        expect(ref).toHaveBeenCalledWith(body);
        expectDistances(0, 0);

        metrics.scrollHeight = 300;
        fireEvent.scroll(body);
        expectDistances(0, 200);

        metrics.scrollTop = 10;
        fireEvent.scroll(body);
        expectDistances(10, 190);

        metrics.scrollTop = 195;
        fireEvent.scroll(body);
        expectDistances(195, 5);

        metrics.scrollTop = 200;
        fireEvent.scroll(body);
        expectDistances(200, 0);

        metrics.scrollTop = 0;
        fireEvent.scroll(body);
        expectDistances(0, 200);
        expect(onScroll).toHaveBeenCalledTimes(5);
        expect(onScroll.mock.calls[0]![0].target).toBe(body);

        view.unmount();
        expect(ref).toHaveBeenLastCalledWith(null);
        expect([...observers].every((observer) => observer.elements.size === 0)).toBe(true);
        metrics.scrollTop = 50;
        fireEvent.scroll(body);
        expectDistances(0, 200);
    });

    it.each(['scroll', 'fill'] as const)('updates for content and viewport resizing with layout=%s', (layout) => {
        const ref = createRef<HTMLDivElement>();
        const view = renderDialog(
            <Modal onClose={() => undefined}>
                <Modal.Content title="Resizing" focusFirstField={false}>
                    <Modal.Body ref={ref} layout={layout}>
                        <Modal.Pane active>
                            <p>Loaded content</p>
                        </Modal.Pane>
                        <Modal.Pane active={false}>Hidden pane</Modal.Pane>
                    </Modal.Body>
                </Modal.Content>
            </Modal>,
        );
        const body = ref.current!;
        const content = screen.getByText('Loaded content');
        const metrics = { scrollTop: 0, scrollHeight: 300, clientHeight: 100 };

        for (const key of ['scrollTop', 'scrollHeight', 'clientHeight'] as const) {
            Object.defineProperty(body, key, { configurable: true, get: () => metrics[key] });
        }

        const resize = (element: Element) => {
            act(() => {
                for (const observer of observers) observer.resize(element);
            });
        };
        // In fill layouts only the descendant changes size; the wrapper and pane stay fixed.
        const contentObserver = [...observers].find((observer) => observer.elements.has(content));

        expect(contentObserver).toBeDefined();

        resize(content);
        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('200px');

        metrics.scrollHeight = 450;
        resize(content);
        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('350px');

        metrics.clientHeight = 500;
        resize(body);
        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px');

        metrics.clientHeight = 100;
        metrics.scrollHeight = 200;
        metrics.scrollTop = 100;
        resize(body);
        expect(body.style.getPropertyValue('--scroll-fade-top')).toBe('100px');
        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px');

        metrics.scrollTop = 0;
        metrics.scrollHeight = 100;
        resize(content);
        expect(body.style.getPropertyValue('--scroll-fade-top')).toBe('0px');
        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px');

        view.unmount();
        expect(ref.current).toBeNull();
        expect([...observers].every((observer) => observer.elements.size === 0)).toBe(true);
    });

    it('tracks inserted descendants and releases removed content in a fixed fill layout', async () => {
        const metrics = { scrollTop: 0, scrollHeight: 100, clientHeight: 100 };
        const ref = (element: HTMLDivElement | null) => {
            if (!element) return;

            for (const key of ['scrollTop', 'scrollHeight', 'clientHeight'] as const) {
                Object.defineProperty(element, key, { configurable: true, get: () => metrics[key] });
            }
        };
        const dialog = (loaded: boolean) => (
            <Modal onClose={() => undefined}>
                <Modal.Content title="Async fill" focusFirstField={false}>
                    <Modal.Body ref={ref} layout="fill" aria-label="Body">
                        <Modal.Pane active>
                            <section>{loaded ? <p>Loaded content</p> : null}</section>
                        </Modal.Pane>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        );
        const view = renderDialog(dialog(false));
        const body = screen.getByLabelText('Body');

        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px');

        metrics.scrollHeight = 300;
        view.rerender(dialog(true));
        await waitFor(() => expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('200px'));

        const content = screen.getByText('Loaded content');
        const observer = [...observers].find((observer) => observer.elements.has(content))!;

        expect(observer).toBeDefined();
        metrics.scrollHeight = 450;
        act(() => observer.resize(content));
        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('350px');

        metrics.scrollHeight = 100;
        view.rerender(dialog(false));
        await waitFor(() => expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px'));

        metrics.scrollHeight = 300;
        act(() => observer.resize(content));
        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px');

        view.unmount();
        await act(async () => body.firstElementChild!.append(content));
        expect(body.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px');
        expect([...observers].every((observer) => observer.elements.size === 0)).toBe(true);
    });

    it('preserves callback ref cleanup when the forwarded ref changes', () => {
        const cleanup = vi.fn();
        const callbackRef = vi.fn(() => cleanup);
        const objectRef = createRef<HTMLDivElement>();
        const dialog = (ref: typeof callbackRef | typeof objectRef) => (
            <Modal onClose={() => undefined}>
                <Modal.Content title="Ref lifecycle" focusFirstField={false}>
                    <Modal.Body ref={ref} aria-label="Body">
                        Content
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        );
        const view = renderDialog(dialog(callbackRef));
        const body = screen.getByLabelText('Body');

        expect(callbackRef).toHaveBeenCalledWith(body);
        view.rerender(dialog(objectRef));
        expect(cleanup).toHaveBeenCalledOnce();
        expect(callbackRef).toHaveBeenCalledTimes(1);
        expect(objectRef.current).toBe(body);

        view.unmount();
        expect(objectRef.current).toBeNull();
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

    it('focuses a select without opening its options', () => {
        renderDialog(
            <FormDialog>
                <Select aria-label="Language" defaultValue="en">
                    <SelectItem value="en">English</SelectItem>
                </Select>
                <Input aria-label="Name" />
            </FormDialog>,
        );

        expect(screen.getByRole('combobox', { name: 'Language' })).toHaveFocus();
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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

    it.each([false, true])(
        'leaves focus to the caller while first-field focus is off (on at opening: %s)',
        async (onAtOpening) => {
            const view = renderDialog(
                <FormDialog focusFirstField={onAtOpening}>
                    <Input aria-label="Name" disabled />
                </FormDialog>,
            );

            view.rerender(
                <FormDialog focusFirstField={false}>
                    <Input aria-label="Name" />
                </FormDialog>,
            );
            await act(async () => undefined);

            expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveFocus();
        },
    );

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
