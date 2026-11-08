// What only a real layout engine shows: the scroll fade on the edges content runs past, a dialog's frame that holds its
// header and footer in view, and a row whose numbers stay whole while its words give way.
import './styles.css';

import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { Button } from './actions/Button';
import { ScrollRow, ScrollRowItem } from './collections/ScrollRow';
import * as progressStories from './feedback/ProgressStatusRow.stories';
import { Field } from './forms/Field';
import { Input } from './forms/Input';
import { MarkdownEditor } from './forms/MarkdownEditor';
import { DesignSystemProvider } from './foundations/DesignSystemProvider';
import { ViewTabs } from './navigation/ViewTabs';
import { DropdownMenu } from './overlays/DropdownMenu';
import { Modal } from './overlays/Modal';
import * as modalStories from './overlays/Modal.stories';
import { Popover } from './overlays/Popover';
import { TooltipProvider } from './overlays/Tooltip';

const mask = (element: Element) => getComputedStyle(element).maskImage || getComputedStyle(element).webkitMaskImage;
const fade = (element: HTMLElement, edge: 'top' | 'bottom' | 'left' | 'right') =>
    Number.parseFloat(element.style.getPropertyValue(`--scroll-fade-${edge}`));
const provided = (node: ReactNode) => render(<DesignSystemProvider>{node}</DesignSystemProvider>);

// Scroll fade

it('fades an overflowing modal body at its bottom, even while its first field has focus', async () => {
    render(
        <Modal onClose={() => {}}>
            <Modal.Content title="Edit movie">
                <Modal.Body>
                    {Array.from({ length: 30 }, (_, index) => (
                        <Field key={index} label={`Field ${index + 1}`}>
                            <Input />
                        </Field>
                    ))}
                </Modal.Body>
            </Modal.Content>
        </Modal>,
    );

    await expect.poll(() => document.querySelector('[data-scroll-fade="overflow"]')).not.toBeNull();

    const region = document.querySelector<HTMLElement>('[data-scroll-fade="overflow"]')!;

    // The editor's first field took focus as it opened; the fade stays on.
    await expect.poll(() => document.activeElement?.tagName).toBe('INPUT');
    expect(region.contains(document.activeElement)).toBe(true);
    expect(mask(region)).toContain('linear-gradient');
    expect(fade(region, 'bottom')).toBeGreaterThan(0);
    expect(fade(region, 'top')).toBe(0);
});

it('draws no fade on a body that fits', async () => {
    render(
        <Modal onClose={() => {}}>
            <Modal.Content title="Rename" focusFirstField={false}>
                <Modal.Body>Short.</Modal.Body>
            </Modal.Content>
        </Modal>,
    );

    await expect.poll(() => document.querySelector('[data-scroll-fade]')).not.toBeNull();

    const region = document.querySelector<HTMLElement>('[data-scroll-fade]')!;

    expect(region.dataset.scrollFade).toBe('none');
    expect(fade(region, 'bottom')).toBe(0);
});

it('fades a long menu or popover inside its glass box, never the box itself', async () => {
    const items = (count: number) => Array.from({ length: count }, (_, index) => `Item ${index + 1}`);
    const { unmount } = render(
        <DropdownMenu open>
            <DropdownMenu.Trigger asChild>
                <Button>Models</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content height="capped">
                {items(60).map((item) => (
                    <DropdownMenu.Item key={item}>{item}</DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu>,
    );

    await expect
        .poll(() => document.querySelector('[data-slot="menu-scroll"]')?.getAttribute('data-scroll-fade'))
        .toBe('overflow');
    expect(mask(document.querySelector('[data-slot="menu-scroll"]')!)).toContain('linear-gradient');
    expect(mask(document.querySelector('[data-slot="dropdown-content"]')!)).toBe('none');
    unmount();

    render(
        <Popover open>
            <Popover.Trigger asChild>
                <Button>Tasks</Button>
            </Popover.Trigger>
            <Popover.Content height="capped" presentation="menu">
                {items(60).map((item) => (
                    <p key={item}>{item}</p>
                ))}
            </Popover.Content>
        </Popover>,
    );

    await expect
        .poll(() => document.querySelector('[data-slot="popover-scroll"]')?.getAttribute('data-scroll-fade'))
        .toBe('overflow');
    expect(mask(document.querySelector('[data-slot="popover-content"]')!)).toBe('none');
});

it('fades a row of cards at the edge with more cards beyond it, and both edges once scrolled', async () => {
    render(
        <div style={{ width: 600 }}>
            <ScrollRow ref={() => {}} label="Episodes">
                {Array.from({ length: 12 }, (_, index) => (
                    <ScrollRowItem key={index} value={`e${index}`}>
                        <p>Episode {index + 1}</p>
                    </ScrollRowItem>
                ))}
            </ScrollRow>
        </div>,
    );

    const row = await screen.findByRole('list', { name: 'Episodes' });

    await expect.poll(() => row.dataset.scrollFade).toBe('overflow');
    expect(mask(row)).toMatch(/linear-gradient\(to right/);
    expect(fade(row, 'right')).toBeGreaterThan(0);
    expect(fade(row, 'left')).toBe(0);

    row.scrollLeft = 200;
    await expect.poll(() => fade(row, 'left')).toBeGreaterThan(0);
});

it('reveals the selected tab of an overflowing row without scrolling the page', async () => {
    const items = Array.from({ length: 8 }, (_, index) => ({ value: String(index), label: `Artwork ${index + 1}` }));
    const Row = ({ value }: { value: string }) => (
        <div style={{ width: 280 }}>
            <ViewTabs label="Metadata" value={value} onChange={() => {}} items={items} />
        </div>
    );
    const { container, rerender } = render(<Row value="7" />);
    const row = container.querySelector<HTMLElement>('[role=tablist]')!;
    const withinRow = () => {
        const bounds = row.getBoundingClientRect();
        const selected = row.querySelector('[aria-selected=true]')!.getBoundingClientRect();

        return selected.left >= bounds.left - 1 && selected.right <= bounds.right + 1;
    };

    await expect.poll(withinRow).toBe(true);
    expect(row.scrollLeft).toBeGreaterThan(0);
    await expect.poll(() => row.dataset.scrollFade).toBe('overflow');
    rerender(<Row value="0" />);
    await expect.poll(withinRow).toBe(true);
    expect(window.scrollY).toBe(0);
});

it('keeps the Markdown editor’s caret line clear of the fade while text continues below', async () => {
    const long = Array.from({ length: 60 }, (_, index) => `Paragraph ${index + 1} of a long description.`).join('\n\n');

    render(<MarkdownEditor label="Description" placeholder="Describe the work" value={long} onChange={() => {}} />, {
        wrapper: TooltipProvider,
    });

    const region = document.querySelector<HTMLElement>('[data-description-area]')!;

    await expect.poll(() => region.dataset.scrollFade).toBe('overflow');

    const view = region.getBoundingClientRect();
    // The paragraph whose line sits under the bottom fade at the top of the scroll.
    const under = [...region.querySelectorAll('p')].find((p) => {
        const { bottom } = p.getBoundingClientRect();

        return bottom > view.bottom - 24 && bottom <= view.bottom;
    })!;

    expect(under).toBeDefined();
    region.querySelector<HTMLElement>('[contenteditable]')!.focus();

    const range = document.createRange();
    const caretLine = () => {
        const caret = getSelection()!.getRangeAt(0).cloneRange();

        caret.collapse(false);

        return caret.getClientRects()[0] ?? caret.getBoundingClientRect();
    };

    range.setStart(under.firstChild!.firstChild!, 5);
    getSelection()!.removeAllRanges();
    getSelection()!.addRange(range);

    await expect.poll(() => caretLine().bottom).toBeLessThanOrEqual(region.getBoundingClientRect().bottom - 24 + 1);
    expect(region.scrollTop).toBeGreaterThan(0);
    expect(fade(region, 'bottom')).toBeGreaterThan(0);
});

// Dialog frame

const { LongPaneWithOpenedDisclosure, Paned } = composeStories(modalStories);

const inWindow = (element: Element) => {
    const box = element.getBoundingClientRect();

    return box.height > 0 && box.top >= 0 && box.bottom <= innerHeight;
};

const frameOf = async (name: string) => {
    const dialog = await screen.findByRole('dialog', { name });

    return dialog.closest<HTMLElement>('[data-slot="modal-content"]') ?? dialog;
};

it('keeps the title, close, sidebar and footer in view when a status deep in a long pane is revealed', async () => {
    await page.viewport(1280, 720);
    provided(<LongPaneWithOpenedDisclosure />);

    const frame = await frameOf('Server settings');

    screen.getByText('Server addresses').scrollIntoView({ block: 'start' });
    screen.getByRole('button', { name: 'Test connection' }).click();
    await expect.poll(() => inWindow(screen.getByTestId('connection-status'))).toBe(true);

    const hidden = [
        screen.getByRole('heading', { name: 'Remote access' }),
        screen.getByRole('button', { name: 'Close' }),
        screen.getByRole('button', { name: 'Server' }),
        screen.getByRole('button', { name: 'Save' }),
    ]
        .filter((element) => !inWindow(element))
        .map((element) => element.textContent || element.getAttribute('aria-label'));

    expect(hidden).toEqual([]);
    // The frame is not a scroll container, so nothing inside it can scroll it; the body scrolls instead.
    expect(frame.scrollTop).toBe(0);
    expect(frame.scrollHeight).toBeLessThanOrEqual(frame.clientHeight);
    expect(frame.querySelector('[data-slot="modal-body"]')!.scrollTop).toBeGreaterThan(0);
});

it('holds one height across a tabbed dialog’s panes', async () => {
    await page.viewport(1440, 900);
    provided(<Paned />);

    const height = (await frameOf('Server settings')).getBoundingClientRect().height;

    screen.getByRole('button', { name: 'Libraries' }).click();
    await expect.poll(async () => (await frameOf('Server settings')).getBoundingClientRect().height).toBe(height);
});

// Collapse

const { LineKeepsItsNumbers } = composeStories(progressStories);

it('keeps a card summary’s numbers whole while its words give way', async () => {
    await page.viewport(1280, 900);
    provided(<LineKeepsItsNumbers />);

    const lines = [...document.querySelectorAll('[data-layout="line"] [data-slot="progress-meta"] [title]')];

    expect(lines).toHaveLength(2);
    for (const line of lines) {
        const [words, numbers] = [...line.children] as HTMLElement[];

        // The words are cut; the numbers fit, so they draw no ellipsis.
        expect(words!.scrollWidth).toBeGreaterThan(words!.clientWidth);
        expect(numbers!.scrollWidth).toBeLessThanOrEqual(Math.ceil(numbers!.getBoundingClientRect().width));
    }
});
