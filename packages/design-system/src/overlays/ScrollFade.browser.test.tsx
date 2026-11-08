import '../styles.css';

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Button } from '../actions/Button';
import { ScrollRow, ScrollRowItem } from '../collections/ScrollRow';
import { Field } from '../forms/Field';
import { Input } from '../forms/Input';
import { DropdownMenu } from './DropdownMenu';
import { Modal } from './Modal';
import { Popover } from './Popover';

const mask = (element: Element) => getComputedStyle(element).maskImage || getComputedStyle(element).webkitMaskImage;

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
    expect(Number.parseFloat(region.style.getPropertyValue('--scroll-fade-bottom'))).toBeGreaterThan(0);
    expect(region.style.getPropertyValue('--scroll-fade-top')).toBe('0px');
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
    expect(region.style.getPropertyValue('--scroll-fade-bottom')).toBe('0px');
});

it('fades a long menu inside its glass box, never the box itself', async () => {
    render(
        <DropdownMenu open>
            <DropdownMenu.Trigger asChild>
                <Button>Models</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content height="capped">
                {Array.from({ length: 60 }, (_, index) => (
                    <DropdownMenu.Item key={index}>Model {index + 1}</DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu>,
    );

    await expect
        .poll(() => document.querySelector('[data-slot="menu-scroll"]')?.getAttribute('data-scroll-fade'))
        .toBe('overflow');
    expect(mask(document.querySelector('[data-slot="menu-scroll"]')!)).toContain('linear-gradient');
    expect(mask(document.querySelector('[data-slot="dropdown-content"]')!)).toBe('none');
});

it('fades a scrolling popover where its content runs past an edge', async () => {
    render(
        <Popover open>
            <Popover.Trigger asChild>
                <Button>Tasks</Button>
            </Popover.Trigger>
            <Popover.Content height="capped" presentation="menu">
                {Array.from({ length: 60 }, (_, index) => (
                    <p key={index}>Task {index + 1}</p>
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
    expect(Number.parseFloat(row.style.getPropertyValue('--scroll-fade-right'))).toBeGreaterThan(0);
    expect(row.style.getPropertyValue('--scroll-fade-left')).toBe('0px');

    row.scrollLeft = 200;
    await expect.poll(() => Number.parseFloat(row.style.getPropertyValue('--scroll-fade-left'))).toBeGreaterThan(0);
});
