import '../styles.css';

import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Checkbox } from './Checkbox';

it('draws the tick inside the box, for a ticked box alone and beside a label', () => {
    render(
        <div className="flex flex-col gap-3 text-sm">
            <Checkbox aria-label="Alone" defaultChecked />
            <Checkbox label="Beside a label" defaultChecked />
            <Checkbox label="Disabled, checked" defaultChecked disabled />
        </div>,
    );

    for (const input of document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')) {
        const box = input.getBoundingClientRect();
        const tick = input.parentElement!.querySelector('[data-slot="checkbox-tick"] svg')!.getBoundingClientRect();

        expect(tick.width).toBeGreaterThan(0);
        expect(tick.left).toBeGreaterThanOrEqual(box.left);
        expect(tick.top).toBeGreaterThanOrEqual(box.top);
        expect(tick.right).toBeLessThanOrEqual(box.right);
        expect(tick.bottom).toBeLessThanOrEqual(box.bottom);
        // Centred, to the pixel.
        expect(Math.abs(tick.left + tick.width / 2 - (box.left + box.width / 2))).toBeLessThan(1);
        expect(Math.abs(tick.top + tick.height / 2 - (box.top + box.height / 2))).toBeLessThan(1);
    }
});
