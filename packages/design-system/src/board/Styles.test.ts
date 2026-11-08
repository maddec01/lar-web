import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { expect, test } from 'vite-plus/test';

test('the board stylesheet loads the shared foundation and every local board stylesheet', () => {
    const entry = resolve(import.meta.dirname, '../board.css');
    const css = readFileSync(entry, 'utf8');

    expect(css).toContain("@import './foundations/theme.css'");
    expect(css).toContain("@source './'");
    for (const [, path] of css.matchAll(/@import '(\.[^']+)'/g))
        expect(existsSync(resolve(dirname(entry), path!))).toBe(true);
});
