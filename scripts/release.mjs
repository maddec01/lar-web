#!/usr/bin/env node
// Publishes each package whose version has no GitHub Release yet: packs it with pnpm and attaches the tarball to a
// release tagged `<package>-v<version>` (design-system-v0.2.0). Apps install the tarball by URL, which needs no
// registry and no token because the repository is public. Changesets runs this after the "Version packages" PR merges.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const repository = process.env.GITHUB_REPOSITORY ?? 'maddec01/lar-web';
const run = (command, args, options = {}) => execFileSync(command, args, { encoding: 'utf8', ...options }).trim();

function releaseExists(tag) {
    try {
        run('gh', ['release', 'view', tag, '--repo', repository], { stdio: 'pipe' });

        return true;
    } catch {
        return false;
    }
}

/** The changelog section Changesets wrote for this version, as the release notes. */
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

    if (manifest.private) continue;

    const tag = `${name}-v${manifest.version}`;

    if (releaseExists(tag)) {
        console.log(`${tag} is already released.`);
        continue;
    }

    const output = mkdtempSync(path.join(tmpdir(), 'lar-web-release-'));

    run('pnpm', ['pack', '--pack-destination', output], { cwd: directory, stdio: 'inherit' });

    const tarball = path.join(
        output,
        readdirSync(output).find((file) => file.endsWith('.tgz')),
    );
    const notesFile = path.join(output, 'notes.md');
    const url = `https://github.com/${repository}/releases/download/${tag}/${path.basename(tarball)}`;

    writeFileSync(
        notesFile,
        `${releaseNotes(directory, manifest.version)}\n\nInstall:\n\n\`\`\`sh\npnpm add ${url}\n\`\`\`\n`,
    );
    run(
        'gh',
        [
            'release',
            'create',
            tag,
            tarball,
            '--repo',
            repository,
            '--title',
            `${manifest.name} ${manifest.version}`,
            '--notes-file',
            notesFile,
        ],
        { stdio: 'inherit' },
    );
    // Changesets reads this line to report the published package.
    console.log(`New tag: ${manifest.name}@${manifest.version}`);
}
