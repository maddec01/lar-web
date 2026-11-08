import { describe, expect, it } from 'vite-plus/test';

import { checkUiCopy } from '../src/index.js';

describe('shared UI copy contract', () => {
    it('checks nested strings and preserves actionable paths', () => {
        expect(
            checkUiCopy({
                load: "Couldn't load",
                nested: ['Could not load', 'Retry', 'Nothing matches.', 'No albums found', 'This page isn’t here.'],
            }).map(({ path, rule }) => [path, rule]),
        ).toEqual([
            ['load', 'apostrophe'],
            ['nested[0]', 'contraction'],
            ['nested[1]', 'retry'],
            ['nested[2]', 'empty-search'],
            ['nested[3]', 'empty-search'],
            ['nested[4]', '404-heading'],
        ]);
    });

    it('accepts the templates, contractions and destructive confirmation exception', () => {
        expect(
            checkUiCopy([
                'Couldn’t load folders',
                'Try again',
                'No albums yet',
                'Nothing matches',
                'Clear search',
                'This page isn’t here',
                'This cannot be undone.',
            ]),
        ).toEqual([]);
    });

    it('only checks typography in translations, and allows exact quotation paths', () => {
        expect(
            checkUiCopy({ quote: 'Could not load', app: 'Could not load' }, { ignorePaths: ['quote'] }).map(
                ({ path }) => path,
            ),
        ).toEqual(['app']);
        expect(checkUiCopy({ text: 'No se puede abrir' }, { locale: 'es' })).toEqual([]);
    });
});
