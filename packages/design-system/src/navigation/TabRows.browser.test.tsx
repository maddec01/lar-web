import '../styles.css';

import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { SidebarNavigationItem } from '../layout/sidebar/SidebarNavigationItem';
import { SidebarNavigationGroup, SidebarPane } from '../layout/sidebar/SidebarPane';
import { ArtworkTabs } from './ArtworkTabs';
import { ViewToggle } from './CollectionViewToggle';
import { ViewTabs } from './ViewTabs';

const choices = Array.from({ length: 8 }, (_, index) => ({
    value: String(index),
    label: `Background artwork ${index + 1}`,
}));

it.each(['tabs', 'artwork', 'segments'] as const)(
    'reveals the selected %s item on initial render and controlled changes without scrolling the page',
    async (kind) => {
        const Row = ({ value }: { value: string }) => (
            <div style={{ width: 280 }}>
                {kind === 'tabs' ? (
                    <ViewTabs label="Metadata" value={value} onChange={() => {}} items={choices} />
                ) : kind === 'artwork' ? (
                    <ArtworkTabs
                        label="Seasons"
                        value={value}
                        onChange={() => {}}
                        items={choices.map((item) => ({ ...item, artwork: <span>Art</span> }))}
                    />
                ) : (
                    <ViewToggle
                        label="Metadata"
                        value={value}
                        onChange={() => {}}
                        presentation="text"
                        options={choices}
                    />
                )}
            </div>
        );
        const { container, rerender } = render(<Row value="7" />);
        const row = container.querySelector<HTMLElement>('[role=tablist], [role=group]')!;
        const selected = () => row.querySelector<HTMLElement>('[aria-selected=true], [aria-pressed=true]')!;
        const withinRow = () => {
            const bounds = row.getBoundingClientRect();
            const active = selected().getBoundingClientRect();

            return active.left >= bounds.left - 1 && active.right <= bounds.right + 1;
        };

        await expect.poll(withinRow).toBe(true);
        expect(row.scrollLeft).toBeGreaterThan(0);
        await expect.poll(() => row.dataset.scrollFade).toBe('overflow');
        expect(getComputedStyle(row).maskImage).toContain('linear-gradient(to right');
        expect(Number.parseFloat(row.style.getPropertyValue('--scroll-fade-left'))).toBeGreaterThan(0);
        rerender(<Row value="3" />);
        await expect.poll(withinRow).toBe(true);
        expect(Number.parseFloat(getComputedStyle(row).scrollPaddingLeft)).toBeGreaterThan(0);
        rerender(<Row value="0" />);
        await expect.poll(withinRow).toBe(true);
        expect(window.scrollY).toBe(0);
    },
);

it('reveals the active settings link on mobile, including cloned links, and switches the fade axis on desktop', async () => {
    await page.viewport(390, 844);

    const { container } = render(
        <div style={{ width: 350, height: 240 }}>
            <SidebarPane label="Settings">
                <SidebarNavigationGroup label="Sections">
                    {choices.map((choice) => (
                        <SidebarNavigationItem key={choice.value} asChild active={choice.value === '7'}>
                            <a href={`#${choice.value}`}>{choice.label}</a>
                        </SidebarNavigationItem>
                    ))}
                </SidebarNavigationGroup>
            </SidebarPane>
        </div>,
    );
    const row = container.querySelector('nav')!;
    const active = row.querySelector('[aria-current=page]')!;

    await expect.poll(() => row.scrollLeft).toBeGreaterThan(0);
    await expect.poll(() => active.getBoundingClientRect().right <= row.getBoundingClientRect().right + 1).toBe(true);
    expect(getComputedStyle(row).maskImage).toContain('to right');
    // A sideways row of sections takes the 3rem fade, so a cut label dissolves past the row's own padding, and the
    // revealed section stays clear of it.
    expect(getComputedStyle(row).maskImage).toContain('rgb(0, 0, 0) 48px');
    expect(Number.parseFloat(getComputedStyle(row).scrollPaddingLeft)).toBe(48);
    await page.viewport(1280, 900);
    await expect.poll(() => getComputedStyle(row).flexDirection).toBe('column');
    await expect.poll(() => getComputedStyle(row).maskImage).not.toContain('to right');
    expect(getComputedStyle(row).maskImage).toContain('linear-gradient');
    expect(Number.parseFloat(getComputedStyle(row).scrollPaddingTop)).toBeGreaterThan(0);
});
