#!/usr/bin/env node
// Moves an app's lar-web dependencies to their latest GitHub Releases. Run from the directory holding the app's
// package.json; it rewrites each `…/lar-web/releases/download/<package>-v<version>/…` URL and writes the PR body
// (the release notes of every version skipped over) to the file named by --notes. Prints nothing when up to date.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: { notes: { type: 'string', default: 'lar-web-update.md' } } });
const repository = 'maddec01/lar-web';
const urlPattern = new RegExp(
    `https://github\\.com/${repository}/releases/download/([a-z-]+)-v(\\d+\\.\\d+\\.\\d+[^/]*)/[^"]+\\.tgz`,
    'g',
);

const releases = JSON.parse(
    execFileSync('gh', ['release', 'list', '--repo', repository, '--limit', '200', '--json', 'tagName,isPrerelease'], {
        encoding: 'utf8',
    }),
)
    .filter((release) => !release.isPrerelease)
    .map((release) => release.tagName);

const versionOf = (tag) =>
    tag
        .slice(tag.lastIndexOf('-v') + 2)
        .split('.')
        .map(Number);
const newer = (a, b) => {
    const [x, y] = [versionOf(a), versionOf(b)];

    for (let index = 0; index < 3; index += 1) if (x[index] !== y[index]) return x[index] > y[index];

    return false;
};

const manifestText = readFileSync('package.json', 'utf8');
const notes = [];
const updated = manifestText.replace(urlPattern, (url, name, version) => {
    const current = `${name}-v${version}`;
    const tags = releases.filter((tag) => tag.startsWith(`${name}-v`) && newer(tag, current));

    if (!tags.length) return url;

    const latest = tags.reduce((best, tag) => (newer(tag, best) ? tag : best));

    for (const tag of tags.sort((a, b) => (newer(a, b) ? 1 : -1))) {
        const body = execFileSync(
            'gh',
            ['release', 'view', tag, '--repo', repository, '--json', 'body', '-q', '.body'],
            {
                encoding: 'utf8',
            },
        );

        notes.push(`### ${tag}\n\n${body.split('\nInstall:')[0].trim() || '_No notes._'}`);
    }

    const file = url.slice(url.lastIndexOf('/') + 1).replace(version, versionOf(latest).join('.'));

    return `https://github.com/${repository}/releases/download/${latest}/${file}`;
});

if (updated !== manifestText) {
    writeFileSync('package.json', updated);
    writeFileSync(values.notes, `Updates the shared Lar web packages from lar-web.\n\n${notes.join('\n\n')}\n`);
    console.log('updated');
}
