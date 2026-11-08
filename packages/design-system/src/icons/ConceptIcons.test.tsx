// The icon glossary as a contract: one icon per concept and one concept per icon, the board's status glyphs never
// borrow a concept's icon for another meaning, and apps' tests can read a rendered icon's concept (iconConcept).
import { render } from '@testing-library/react';
import { CircleDashedIcon, EyeIcon } from 'lucide-react';
import { expect, it } from 'vite-plus/test';

import { StatusGlyph } from '../board/StatusGlyph';
import { iconConcept } from '../testing';
import { conceptIcons } from './ConceptIcons';

it('gives each concept its own icon', () => {
    const icons = Object.values(conceptIcons);

    expect(new Set(icons).size).toBe(icons.length);
});

it('keeps No kind off the Shaping glyph and Stopped off the review eye', () => {
    expect(conceptIcons.noKind).not.toBe(CircleDashedIcon);
    expect(conceptIcons.stopped).not.toBe(EyeIcon);
});

it('draws stopped work with the Stopped glyph, whatever its stage', () => {
    const { container } = render(
        <>
            <StatusGlyph status="Review" state="off" />
            <StatusGlyph status="In progress" state="off" running />
            <StatusGlyph status="Review" />
        </>,
    );
    const [review, building, reviewing] = container.querySelectorAll('[data-slot="status-glyph"]');

    expect(iconConcept(review)).toBe('stopped');
    expect(iconConcept(building)).toBe('stopped');
    expect(iconConcept(reviewing)).toBeUndefined();
});

it('keeps every status glyph in a fixed box, whatever its mark', () => {
    const { container } = render(
        <>
            <StatusGlyph status="Needs you" />
            <StatusGlyph status="Done" />
        </>,
    );

    for (const slot of container.querySelectorAll('[data-slot="status-glyph"]'))
        expect(slot.className).toContain('size-3.5');
});

it('names the concept a rendered icon draws', () => {
    const { container } = render(
        <button type="button">
            <conceptIcons.playback aria-hidden="true" />
            Now playing
        </button>,
    );

    expect(iconConcept(container.querySelector('button'))).toBe('playback');
    expect(iconConcept(null)).toBeUndefined();
});
