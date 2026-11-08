import '../styles.css';

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { IconButton } from '../actions/IconButton';
import { Alert } from '../feedback/Alert';
import { Textarea } from '../forms/Textarea';
import { Grid } from '../layout/Flow';
import { Artwork } from '../media/Artwork';
import { darkTitleLogo, lightTitleLogo } from '../media/titleLogoFixtures';
import { Modal } from '../overlays/Modal';
import { Text } from '../typography/Typography';
import { DetailHero } from './DetailHero';
import { ResourceCard } from './ResourceCard';

function luminance(rgb: readonly number[]) {
    const values = rgb.map((channel) => {
        const value = channel / 255;

        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });

    return values[0]! * 0.2126 + values[1]! * 0.7152 + values[2]! * 0.0722;
}

it.each(['light', 'dark'])('keeps hero metadata above 4.5:1 over representative bright backdrops in %s', (theme) => {
    document.documentElement.className = theme;
    document.documentElement.dataset.theme = 'minimal';

    render(
        <DetailHero
            title="Lar"
            label="Movie"
            subtitle="2024 · 2 h 46 min · 4K"
            artwork={null}
            backgroundSrc={lightTitleLogo}
        >
            <Text tone="muted">Science fiction</Text>
        </DetailHero>,
    );

    const hero = document.querySelector<HTMLElement>('[data-slot=detail-hero]')!;
    const layers = hero.querySelector('[aria-hidden=true]')!.children;
    const stage = getComputedStyle(hero).backgroundColor;
    const imageOpacity = Number(getComputedStyle(layers[0]!).opacity);
    const scrim = getComputedStyle(layers[1]!).backgroundColor;
    const canvas = document.createElement('canvas');

    canvas.width = canvas.height = 1;

    const context = canvas.getContext('2d')!;
    const pixel = () => [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);

    // Draw the actual computed stage, image opacity and uniform scrim. Ignoring the second gradient is conservative:
    // it can only darken the background further. Sample the full white/yellow/cyan image cases, not a chosen text spot.
    for (const backdrop of ['#ffffff', '#ffff00', '#a0ffff']) {
        context.fillStyle = stage;
        context.fillRect(0, 0, 1, 1);
        context.globalAlpha = imageOpacity;
        context.fillStyle = backdrop;
        context.fillRect(0, 0, 1, 1);
        context.globalAlpha = 1;
        context.fillStyle = scrim;
        context.fillRect(0, 0, 1, 1);

        const backgroundLuminance = luminance(pixel());

        for (const text of [
            screen.getByText('2024 · 2 h 46 min · 4K'),
            screen.getByText('Science fiction'),
            screen.getByText('Movie'),
        ]) {
            context.fillStyle = getComputedStyle(text).color;
            context.fillRect(0, 0, 1, 1);
            expect((luminance(pixel()) + 0.05) / (backgroundLuminance + 0.05)).toBeGreaterThanOrEqual(4.5);
        }
    }
});

it('shows the text title at phone widths so a title logo never shrinks below its metadata', async () => {
    await page.viewport(390, 844);
    render(
        <DetailHero
            title="Lar"
            label="Movie"
            subtitle="2024"
            artwork={<Artwork alt="" aspect="poster" />}
            titleLogoSrc={lightTitleLogo}
        >
            {null}
        </DetailHero>,
    );

    // The logo is measured first, then drawn from 40rem only.
    expect(await screen.findByAltText('Lar')).not.toBeVisible();
    expect(screen.getByRole('heading', { name: 'Lar' })).toBeVisible();
    expect(screen.getByRole('heading').querySelector('span')).toBeVisible();
    expect(getComputedStyle(screen.getByText('Lar')).fontSize).not.toBe('0px');
});

const paddedLogo = (text: string, size: number) =>
    `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"><rect x="500" y="${200 - size / 2}" width="${text.length * size * 0.6}" height="${size}" fill="#fff"/></svg>`,
    )}`;

it('sizes a title logo by its visible lettering, not its transparent margins', async () => {
    await page.viewport(1280, 800);
    render(
        <DetailHero title="Dune" label="Movie" artwork={null} titleLogoSrc={paddedLogo('DUNE', 100)}>
            {null}
        </DetailHero>,
    );

    const frame = (await screen.findByAltText('Dune')).parentElement!;
    const { width, height } = frame.getBoundingClientRect();

    // The visible block is 240 × 100: drawn 80px tall (5rem), never the 1200 × 400 canvas's box.
    expect(height).toBeCloseTo(80, 0);
    expect(width / height).toBeCloseTo(2.4, 0);
});

it('shows the text title when a logo is too wide for its lettering to reach the heading', async () => {
    await page.viewport(1280, 800);
    render(
        <DetailHero
            title="The Lantern Keeper"
            label="Movie"
            artwork={null}
            titleLogoSrc={paddedLogo('THE LANTERN KEEPER', 20)}
        >
            {null}
        </DetailHero>,
    );

    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.queryByAltText('The Lantern Keeper')).toBeNull();
    expect(screen.getByRole('heading', { name: 'The Lantern Keeper' })).toHaveTextContent('The Lantern Keeper');
});

it.each(['light', 'dark'])('stages both transparent inks on the same quiet checks in %s', (theme) => {
    document.documentElement.className = theme;
    render(
        <>
            <Artwork alt="Light Lar" aspect="logo" src={lightTitleLogo} />
            <Artwork alt="Dark Lar" aspect="logo" src={darkTitleLogo} />
        </>,
    );

    for (const image of [screen.getByAltText('Light Lar'), screen.getByAltText('Dark Lar')]) {
        const style = getComputedStyle(image.parentElement!);

        // A mid grey both inks read on, with checks one shade apart: transparent, without competing with the lettering.
        expect(style.backgroundImage).toContain('conic-gradient(rgb(104, 104, 104)');
        expect(style.backgroundColor).toBe('rgb(95, 95, 95)');
    }
});

it('honours requested textarea rows instead of the library’s fixed height', () => {
    render(<Textarea aria-label="Biography" rows={10} />);

    const area = screen.getByRole('textbox');
    const style = getComputedStyle(area);

    expect(area.getBoundingClientRect().height).toBeGreaterThanOrEqual(parseFloat(style.lineHeight) * 10);
});

it('omits the empty resource status band and keeps footer controls on one phone-width row', async () => {
    await page.viewport(390, 844);
    render(<ResourceCard details="Movies" actions={<button>Settings</button>} trailing={<button>On</button>} />);

    const actions = screen.getByRole('button', { name: 'Settings' }).getBoundingClientRect();
    const toggle = screen.getByRole('button', { name: 'On' }).getBoundingClientRect();

    expect(Math.abs(actions.top - toggle.top)).toBeLessThan(2);
    expect(document.querySelector('article')!.getBoundingClientRect().height).toBeLessThan(150);
});

it('uses the primary text colour and compact type by default inside a modal', async () => {
    render(
        <Modal onClose={() => {}}>
            <Modal.Content title="Metadata">
                <Modal.Body>
                    <Alert tone="danger" message="Couldn’t load artwork" />
                </Modal.Body>
            </Modal.Content>
        </Modal>,
    );

    await expect.poll(() => screen.queryByText('Couldn’t load artwork')).not.toBeNull();

    const message = screen.getByText('Couldn’t load artwork');

    expect(getComputedStyle(message).fontSize).toBe('12px');
    expect(getComputedStyle(message).fontWeight).toBe('400');
});

it('keeps an open menu trigger on the normal muted pressed fill', () => {
    render(<IconButton aria-label="More" icon={<span>…</span>} data-state="open" />);

    const button = screen.getByRole('button', { name: 'More' });
    const probe = document.createElement('span');

    probe.className = 'bg-fill-hover';
    button.parentElement!.append(probe);
    expect(getComputedStyle(button).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
});

it('aligns overview footer dividers across a row with mixed status heights', async () => {
    await page.viewport(1280, 900);
    render(
        <Grid variant="overview">
            {[
                'Ready',
                'Waiting for the remote metadata provider to answer. The next attempt is scheduled for later today.',
                'Not scanned yet',
            ].map((status) => (
                <ResourceCard
                    key={status}
                    presentation="overview"
                    details="Music"
                    metrics={[{ label: 'Items', value: '1,204' }]}
                    status={<span>{status}</span>}
                />
            ))}
        </Grid>,
    );

    const footers = Array.from(
        document.querySelectorAll('[data-slot=resource-card-overview]'),
        (card) => card.lastElementChild!.getBoundingClientRect().top,
    );

    expect(Math.max(...footers) - Math.min(...footers)).toBeLessThan(1);
});
