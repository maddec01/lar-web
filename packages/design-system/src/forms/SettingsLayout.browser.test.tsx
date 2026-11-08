import '../styles.css';

import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import { Button } from '../actions/Button';
import { InsetPanel } from '../display/InsetPanel';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';

it.each(['light', 'dark'])('settings preserve loading geometry and align ghost text in %s', (theme) => {
    document.documentElement.dataset.theme = 'minimal';
    document.documentElement.className = theme;

    const Content = ({ loading }: { loading: boolean }) => (
        <div style={{ width: 600 }}>
            <SettingsSection title="Playback" loading={loading} action={<Button variant="quiet">Refresh</Button>}>
                <InsetPanel presentation="settings">
                    <SettingsRow loading={loading} label="Cache" description="Storage used by generated audio.">
                        <Button variant="quiet">Refresh</Button>
                    </SettingsRow>
                    <SettingsRow
                        loading={loading}
                        variant="action"
                        label={<Button variant="destructive-quiet">Clear generated music</Button>}
                    />
                </InsetPanel>
            </SettingsSection>
        </div>
    );
    const { container, rerender } = render(<Content loading />);
    const rects = () =>
        [...container.querySelectorAll('section, h3, .settings-row, button')].map((element) => {
            const { x, y, width, height } = element.getBoundingClientRect();

            return { x, y, width, height };
        });
    const loadingRects = rects();

    rerender(<Content loading={false} />);
    expect(rects()).toEqual(loadingRects);

    const label = container.querySelector('.settings-row-title')!;
    const action = container.querySelector<HTMLButtonElement>('.settings-row:nth-child(2) button')!;
    const textRect = (element: Element) => {
        const range = document.createRange();

        range.selectNodeContents(element.querySelector('[data-slot="content"]') ?? element);

        return range.getBoundingClientRect();
    };

    expect(Math.abs(textRect(action).left - label.getBoundingClientRect().left)).toBeLessThanOrEqual(1);

    const trailing = container.querySelector<HTMLButtonElement>('.settings-row-control button')!;
    const row = container.querySelector('.settings-row')!;

    // 20px card gutter; the text, rather than the ghost hit area, meets it.
    expect(Math.abs(row.getBoundingClientRect().right - 20 - textRect(trailing).right)).toBeLessThanOrEqual(1);

    const headerAction = container.querySelector<HTMLButtonElement>('section > div:first-child button')!;

    expect(
        Math.abs(textRect(headerAction).right - container.firstElementChild!.getBoundingClientRect().right),
    ).toBeLessThanOrEqual(1);
});

it('pending real settings controls cannot receive keyboard focus', async () => {
    const { container } = render(
        <>
            <SettingsRow loading loadingLabel="Loading cache" label="Cache">
                <Button>Clear cache</Button>
            </SettingsRow>
            <Button>Next</Button>
        </>,
    );

    await page.getByRole('button', { name: 'Next' }).click();
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).not.toBe(container.querySelector('.settings-row button'));
});
