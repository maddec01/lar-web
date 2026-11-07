#!/usr/bin/env node
// Moves a source tree from Lar's hand-drawn icons to lucide's: rewrites imports of the old icon modules to `--to`
// and renames each icon to its lucide name (lucide-icon-names.json). Icons with no lucide counterpart (brands) keep
// their name and come from `--keep-from`.
//
//   node scripts/codemods/lucide-icons.mjs --dir ../lar-server/web/src \
//     --from '^@/shared/design-system/icons' --to '@lar-works/design-system/icons'

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
    options: {
        dir: { type: 'string' },
        from: { type: 'string' },
        to: { type: 'string' },
        keep: { type: 'string', default: 'GitHubIcon' },
        'keep-from': { type: 'string' },
    },
});

if (!values.dir || !values.from || !values.to) throw new Error('Pass --dir, --from and --to.');

const names = JSON.parse(await readFile(new URL('./lucide-icon-names.json', import.meta.url), 'utf8'));
const kept = new Set(values.keep.split(','));
const from = new RegExp(values.from);
const importPattern = /import\s*(type\s*)?\{([^}]*)\}\s*from\s*'([^']+)';?\n?/g;

async function* files(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);

        if (entry.isDirectory() && entry.name !== 'node_modules') yield* files(file);
        else if (/\.(ts|tsx)$/.test(entry.name)) yield file;
    }
}

let changed = 0;

for await (const file of files(values.dir)) {
    const text = await readFile(file, 'utf8');
    const renamed = new Map();
    const keptNames = new Set();
    const others = [];
    let firstImportAt = -1;

    let next = text.replace(importPattern, (statement, typeOnly, specifiers, specifier, offset) => {
        if (typeOnly || !from.test(path.isAbsolute(specifier) ? specifier : resolveRelative(file, specifier)))
            return statement;

        if (firstImportAt === -1) firstImportAt = offset;

        for (const raw of specifiers.split(',')) {
            const name = raw.trim();

            if (!name) continue;

            if (kept.has(name)) keptNames.add(name);
            else if (names[name]) renamed.set(name, names[name]);
            else others.push(name);
        }

        return '';
    });

    if (firstImportAt === -1) continue;

    if (others.length) throw new Error(`${file}: no lucide name for ${others.join(', ')}`);

    for (const [old, lucide] of renamed) next = next.replace(new RegExp(`\\b${old}\\b`, 'g'), lucide);

    const lucideNames = [...new Set(renamed.values())].sort((a, b) => a.localeCompare(b));
    const imports = [];

    if (lucideNames.length) imports.push(`import { ${lucideNames.join(', ')} } from '${values.to}';\n`);

    if (keptNames.size)
        imports.push(
            `import { ${[...keptNames].sort((a, b) => a.localeCompare(b)).join(', ')} } from '${values['keep-from'] ?? values.to}';\n`,
        );

    next = next.slice(0, firstImportAt) + imports.join('') + next.slice(firstImportAt);
    await writeFile(file, next);
    changed += 1;
}

console.log(`Rewrote icon imports in ${changed} files.`);

/** Relative specifiers are matched as paths from --dir, so `--from '^icons/'` catches `../icons/NavigationIcons`. */
function resolveRelative(file, specifier) {
    if (!specifier.startsWith('.')) return specifier;

    return path.relative(values.dir, path.resolve(path.dirname(file), specifier)).replaceAll(path.sep, '/');
}
