#!/usr/bin/env node
// Starts a new Lar web app from templates/app:
//
//   node scripts/create-app.mjs ../lar-something --name lar-something
//
// It copies the template, points its lar-web dependencies at the current published versions, and adds the
// files a standalone pnpm project needs (pnpm-workspace.yaml with the Vite+ overrides, .gitignore).

import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({ allowPositionals: true, options: { name: { type: 'string' } } });
const [target] = positionals;

if (!target) throw new Error('Pass the new app directory: node scripts/create-app.mjs ../my-app');

if (existsSync(target)) throw new Error(`${target} already exists.`);

const root = path.resolve(import.meta.dirname, '..');
const template = path.join(root, 'templates', 'app');
const versionOf = (name) => JSON.parse(readFileSync(path.join(root, 'packages', name, 'package.json'), 'utf8')).version;

cpSync(template, target, {
    recursive: true,
    filter: (source) => !/(node_modules|dist|coverage)$/.test(source),
});

const manifestPath = path.join(target, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

manifest.name = values.name ?? path.basename(path.resolve(target));
manifest.version = '0.1.0';
delete manifest.description;
manifest.dependencies['@lar-works/design-system'] = `^${versionOf('design-system')}`;
manifest.devDependencies['@lar-works/config'] = `^${versionOf('config')}`;
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);

writeFileSync(
    path.join(target, 'pnpm-workspace.yaml'),
    readFileSync(path.join(root, 'pnpm-workspace.yaml'), 'utf8').replace(/^packages:\n(?:\s+- .*\n)+\n?/m, ''),
);
writeFileSync(path.join(target, '.gitignore'), 'node_modules/\ndist/\ncoverage/\n*.tsbuildinfo\n.DS_Store\n');

console.log(`Created ${target}. Next: cd ${target} && git init && pnpm install && pnpm dev`);
