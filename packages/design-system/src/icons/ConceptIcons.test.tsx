// The icon glossary as a contract: one icon per concept and one concept per icon, and apps' tests can read a rendered
// icon's concept (iconConcept), in the shared glossary or an app's own.
import { render } from '@testing-library/react';
import { ScanLineIcon } from 'lucide-react';
import { expect, it } from 'vite-plus/test';

import { iconConcept } from '../testing';
import { conceptIcons } from './ConceptIcons';

it('gives each concept its own icon', () => {
    const icons = Object.values(conceptIcons);

    expect(new Set(icons).size).toBe(icons.length);
});

it('names the concept a rendered icon draws, in the shared glossary or an extended one', () => {
    const { container } = render(
        <>
            <button type="button">
                <conceptIcons.settings aria-hidden="true" />
                Settings
            </button>
            <ScanLineIcon aria-hidden="true" />
        </>,
    );
    const scan = container.querySelector('svg.lucide-scan-line');

    expect(iconConcept(container.querySelector('button'))).toBe('settings');
    expect(iconConcept(scan)).toBeUndefined();
    expect(iconConcept(scan, { ...conceptIcons, scans: ScanLineIcon })).toBe('scans');
    expect(iconConcept(null)).toBeUndefined();
});
