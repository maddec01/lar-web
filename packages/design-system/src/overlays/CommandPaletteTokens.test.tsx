// The command palette's tokens, trailing control, list states and keys, as the board search uses them.
import { act, type ComponentProps, createElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test';

import { CommandPalette, CommandPaletteGroup, CommandPaletteOption } from './CommandPalette';

type Props = ComponentProps<typeof CommandPalette>;

let root: Root | undefined;
let host: HTMLElement | undefined;
const scrollIntoView = vi.fn();

beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    scrollIntoView.mockClear();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView });
    vi.stubGlobal(
        'ResizeObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
});

afterEach(async () => {
    await act(async () => root?.unmount());
    host?.remove();
    vi.unstubAllGlobals();
});

const element = (props: Partial<Props>) => {
    const options = props.options ?? ['Add item', 'Settings', 'Archive'];

    return createElement(CommandPalette, {
        label: 'Search the board',
        description: 'Find tickets and set filters',
        placeholder: 'Search',
        listLabel: 'Results',
        query: '',
        onQueryChange: () => undefined,
        onSelect: () => undefined,
        onClose: () => undefined,
        ...props,
        options,
        // oxlint-disable-next-line react/no-children-prop -- required by the props type, which createElement's third argument can't fill
        children: createElement(CommandPaletteGroup, {
            label: 'Actions',
            // oxlint-disable-next-line react/no-children-prop -- required by the props type, which createElement's third argument can't fill
            children: options.map((value) =>
                createElement(CommandPaletteOption, { key: value, value, icon: null, name: value }),
            ),
        }),
    });
};

const show = async (node: ReactNode) => {
    host = document.body.appendChild(document.createElement('div'));
    root = createRoot(host);
    await act(async () => root!.render(node));
};
const rerender = (node: ReactNode) => act(async () => root!.render(node));

const input = () => document.querySelector<HTMLInputElement>('[role="combobox"]')!;
const press = (key: string, init: KeyboardEventInit = {}) =>
    act(async () => {
        input().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
    });
const active = () => document.getElementById(input().getAttribute('aria-activedescendant') ?? '')?.textContent;
const button = (name: string) => document.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;

test('opens as a labelled dialog with no heading, focuses the field and reports typing', async () => {
    const onQueryChange = vi.fn();

    await show(element({ onQueryChange }));

    const dialog = document.querySelector('[role="dialog"]')!;

    expect([...dialog.querySelectorAll('h2')].map((heading) => heading.className)).toEqual(['sr-only']);
    expect(input().getAttribute('aria-label')).toBe('Search the board');
    expect(input().placeholder).toBe('Search');
    expect(document.activeElement).toBe(input());
    expect(document.querySelector('[role="listbox"]')?.getAttribute('aria-label')).toBe('Results');
    expect(document.querySelector('[role="group"]')?.textContent).toContain('Actions');

    await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input(), 'arc');
        input().dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(onQueryChange).toHaveBeenCalledWith('arc');
});

test('the arrow keys move the highlight, wrap at both ends and scroll it into view', async () => {
    await show(element({}));
    expect(active()).toBe('Add item');

    await press('ArrowUp');
    expect(active()).toBe('Archive');
    expect(document.querySelector('[aria-selected="true"]')?.textContent).toBe('Archive');
    expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.querySelector('[aria-selected="true"]'));

    await press('ArrowDown');
    expect(active()).toBe('Add item');
    await press('ArrowDown');
    expect(active()).toBe('Settings');
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
});

test('Enter chooses the highlighted option, and does nothing with an empty list', async () => {
    const onSelect = vi.fn();

    await show(element({ onSelect }));
    await press('ArrowDown');
    await press('Enter');
    expect(onSelect.mock.calls).toEqual([['Settings']]);

    await rerender(element({ onSelect, options: [] }));
    await press('Enter');
    await press('ArrowDown');
    expect(onSelect).toHaveBeenCalledOnce();
    expect(input().hasAttribute('aria-activedescendant')).toBe(false);
});

test('Esc and the Close button close it', async () => {
    const onClose = vi.fn();

    await show(element({ onClose }));
    await press('Escape');
    expect(onClose).toHaveBeenCalledOnce();
    await act(async () => button('Close').click());
    expect(onClose).toHaveBeenCalledTimes(2);
});

test('no key acts during IME composition', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    const onBackspaceEmpty = vi.fn();

    await show(element({ onSelect, onClose, onBackspaceEmpty }));
    for (const key of ['ArrowDown', 'Enter', 'Backspace', 'Escape']) await press(key, { isComposing: true });
    expect(active()).toBe('Add item');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onBackspaceEmpty).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
});
