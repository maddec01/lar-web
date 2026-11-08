import '../styles.css';

import { render, screen } from '@testing-library/react';
import { Trash2Icon } from 'lucide-react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { DropdownMenu } from '../overlays/DropdownMenu';
import { Button } from './Button';
import { IconButton } from './IconButton';

it.each(['light', 'dark'])(
    'destructive triggers are danger text at rest and gain the danger surface on pointer or keyboard intent in %s',
    async (theme) => {
        document.documentElement.dataset.theme = 'minimal';
        document.documentElement.className = theme;

        const { container } = render(
            <>
                <Button variant="destructive-quiet">Delete catalog</Button>
                <IconButton variant="header" tone="danger" icon={<Trash2Icon />} aria-label="Delete logs" />
                <Button variant="destructive">Confirm delete</Button>
            </>,
        );
        const [trigger, icon, confirm] = [...container.querySelectorAll('button')];
        const danger = getComputedStyle(trigger!).color;
        const neutral = getComputedStyle(document.body).color;

        expect(danger).not.toBe(neutral);
        expect(getComputedStyle(icon!).color).toBe(danger);
        expect(getComputedStyle(trigger!).backgroundColor).toBe('rgba(0, 0, 0, 0)');
        expect(getComputedStyle(confirm!).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
        await page.getByRole('button', { name: 'Delete catalog' }).hover();

        const surface = getComputedStyle(trigger!).backgroundColor;

        expect(surface).not.toBe('rgba(0, 0, 0, 0)');
        expect(getComputedStyle(trigger!).color).toBe(danger);
        await page.getByRole('button', { name: 'Confirm delete' }).hover();
        trigger!.focus();
        expect(getComputedStyle(trigger!).backgroundColor).toBe(surface);
        icon!.focus();
        expect(getComputedStyle(icon!).color).toBe(danger);
    },
);

it('destructive menu items share the danger text at rest and gain the danger surface on highlight', async () => {
    render(
        <DropdownMenu defaultOpen>
            <DropdownMenu.Trigger asChild>
                <Button>Actions</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item>Review</DropdownMenu.Item>
                <DropdownMenu.Item destructive>
                    <Trash2Icon />
                    Delete catalog
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>,
    );
    await expect.poll(() => document.querySelector('[data-destructive-trigger]')).not.toBeNull();

    const item = document.querySelector<HTMLElement>('[data-destructive-trigger]')!;
    const resting = getComputedStyle(item).color;
    const review = getComputedStyle(screen.getByRole('menuitem', { name: 'Review' })).color;

    expect(resting).not.toBe(review);
    expect(getComputedStyle(item.querySelector('svg')!).color).toBe(resting);
    await page.getByRole('menuitem', { name: 'Delete catalog' }).hover();
    expect(getComputedStyle(item).color).toBe(resting);
    expect(getComputedStyle(item).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
});
