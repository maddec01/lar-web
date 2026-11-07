#!/usr/bin/env node
// Publishes each package whose version isn't on npm yet, then tags it and creates its GitHub Release with the
// changelog section as notes. Changesets runs this after the "Version packages" PR merges.
//
// pnpm packs the package (turning workspace: ranges into versions) and npm publishes the tarball: in CI npm
// authenticates through trusted publishing (OIDC) and attaches provenance, so no token is stored anywhere.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const repository = process.env.GITHUB_REPOSITORY ?? 'maddec01/lar-web';
const inCi = process.env.GITHUB_ACTIONS === 'true';
const run = (command, args, options = {}) => execFileSync(command, args, { encoding: 'utf8', ...options });

function published(name, version) {
    try {
        return run('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'pipe' }).trim() === version;
    } catch {
        return false;
    }
}

/** The changelog section Changesets wrote for this version. */
function releaseNotes(directory, version) {
    try {
        const changelog = readFileSync(path.join(directory, 'CHANGELOG.md'), 'utf8');
        const section = changelog.split(/^## /m).find((part) => part.startsWith(`${version}\n`));

        return section ? section.slice(version.length).trim() : '';
    } catch {
        return '';
    }
}

for (const name of readdirSync(path.join(root, 'packages'))) {
    const directory = path.join(root, 'packages', name);
    const manifest = JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'));

    if (manifest.private || published(manifest.name, manifest.version)) continue;

    const output = mkdtempSync(path.join(tmpdir(), 'lar-web-release-'));

    run('pnpm', ['pack', '--pack-destination', output], { cwd: directory, stdio: 'inherit' });

    const tarball = path.join(
        output,
        readdirSync(output).find((file) => file.endsWith('.tgz')),
    );

    run('npm', ['publish', tarball, '--access', 'public', ...(inCi ? ['--provenance'] : [])], { stdio: 'inherit' });

    const tag = `${manifest.name}@${manifest.version}`;
    const notesFile = path.join(output, 'notes.md');

    writeFileSync(notesFile, releaseNotes(directory, manifest.version) || `Published ${tag} to npm.`);
    run(
        'gh',
        [
            'release',
            'create',
            tag,
            '--repo',
            repository,
            '--target',
            process.env.GITHUB_SHA ?? 'main',
            '--title',
            tag,
            '--notes-file',
            notesFile,
        ],
        {
            stdio: 'inherit',
        },
    );
    // Changesets reads this line to report the published package.
    console.log(`New tag: ${tag}`);
}
