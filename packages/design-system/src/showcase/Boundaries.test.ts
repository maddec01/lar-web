import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from 'vite-plus/test';

import * as board from '../board';
import * as generic from '../index';

// The website shows the apps through screenshots of the apps themselves and through the components they are built
// from, never through a hand-drawn copy that drifts from them. These tests fail when the showcase redefines one.

const folder = import.meta.dirname;
const sources = readdirSync(folder).filter((file) => /\.tsx?$/.test(file) && !/\.(stories|test)\.tsx?$/.test(file));
const stylesheets = readdirSync(folder).filter((file) => file.endsWith('.css'));
const appNames = new Set([...Object.keys(board), ...Object.keys(generic)].filter((name) => /^[A-Z]/.test(name)));

test('the showcase declares no component under a name the board or the generic layer already exports', () => {
    const redefined = sources.flatMap((file) =>
        [...readFileSync(resolve(folder, file), 'utf8').matchAll(/(?:function|const|class)\s+([A-Z]\w*)/g)]
            .map(([, name]) => name!)
            .filter((name) => appNames.has(name))
            .map((name) => `${file}: ${name}`),
    );

    expect(redefined).toEqual([]);
});

test("the showcase's stylesheets define none of the board's classes", () => {
    const boardFolder = resolve(folder, '../board');
    const classes = (css: string) => new Set([...css.matchAll(/\.([a-z][\w-]*)\s*[{,:[]/g)].map(([, name]) => name!));
    const boardClasses = new Set(
        readdirSync(boardFolder)
            .filter((file) => file.endsWith('.css'))
            .flatMap((file) => [...classes(readFileSync(resolve(boardFolder, file), 'utf8'))]),
    );
    const copied = stylesheets.flatMap((file) =>
        [...classes(readFileSync(resolve(folder, file), 'utf8'))]
            .filter((name) => boardClasses.has(name))
            .map((name) => `${file}: .${name}`),
    );

    expect(copied).toEqual([]);
});
