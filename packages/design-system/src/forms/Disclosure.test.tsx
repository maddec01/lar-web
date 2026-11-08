// The Disclosure's group: lazy content only once open, a kept answer starting it open, and its markers.

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Disclosure } from './FormSection';

const group = (defaultOpen = false) => (
    <Disclosure
        presentation="group"
        label="Map kinds"
        badge="Optional"
        lazy
        defaultOpen={defaultOpen}
        data-kind-mapping=""
    >
        <p>Mapping fields</p>
    </Disclosure>
);

it('a lazy group renders its content only once opened, and says its badge in its summary', () => {
    const { container } = render(group());
    const details = container.querySelector<HTMLDetailsElement>('details[data-kind-mapping]')!;

    expect(details.querySelector('summary')!.textContent).toBe('Map kinds Optional');
    expect(screen.queryByText('Mapping fields')).toBeNull();
    details.open = true;
    fireEvent(details, new Event('toggle'));
    expect(screen.getByText('Mapping fields')).toBeTruthy();
});

it('a group can start open', () => {
    const { container } = render(group(true));

    expect(container.querySelector<HTMLDetailsElement>('details')!.open).toBe(true);
    expect(screen.getByText('Mapping fields')).toBeTruthy();
});

it('tells its owner each time it opens or closes', () => {
    const heard: boolean[] = [];
    const { container } = render(
        <Disclosure presentation="section" label="Checks" onOpenChange={(open) => heard.push(open)}>
            <p>Runs</p>
        </Disclosure>,
    );
    const details = container.querySelector<HTMLDetailsElement>('details')!;

    details.open = true;
    fireEvent(details, new Event('toggle'));
    details.open = false;
    fireEvent(details, new Event('toggle'));
    expect(heard).toEqual([true, false]);
});

it('a lazy section honors defaultOpen and keeps its native disclosure control', () => {
    const { container } = render(
        <Disclosure presentation="section" label="Checks" defaultOpen lazy>
            <p>All checks passed.</p>
        </Disclosure>,
    );

    expect(container.querySelector('details')!.open).toBe(true);
    expect(container.querySelector('summary')!.textContent).toBe('Checks');
    expect(screen.getByText('All checks passed.')).toBeTruthy();
});
