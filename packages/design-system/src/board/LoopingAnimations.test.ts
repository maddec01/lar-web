import { readFileSync } from 'node:fs';
import { afterEach, expect, test } from 'vite-plus/test';

const css = readFileSync(`${import.meta.dirname}/../foundations/theme.css`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const selectors = [...css.matchAll(/([^{}]+)\{\s*animation-play-state:\s*paused;/g)].map((match) =>
    match[1]!.replace(/::before/g, ''),
);
const loops = [
    'status-spin',
    'status-pulse',
    'activity-sweep',
    'animate-spin',
    'motion-safe:animate-spin',
    'animate-pulse',
    'lar-skeleton',
];
const paused = (element: Element) => selectors.some((selector) => element.matches(selector));
const fixtures: Element[] = [];

function root(slot?: string) {
    const el = document.createElement('div');

    if (slot) el.setAttribute('data-slot', slot);

    fixtures.push(el);
    document.body.append(el);

    return el;
}

function overlay(slot = 'modal-overlay') {
    const el = root(slot);

    el.setAttribute('data-state', 'open');

    return el;
}

function probe(parent: Element, name: string) {
    const el = document.createElement('span');

    el.className = name;
    parent.append(el);

    return el;
}

const states = (parent: Element) => loops.map((name) => paused(probe(parent, name)));

afterEach(() => {
    fixtures.forEach((el) => el.remove());
    fixtures.length = 0;
});

test('loops run with no modal, pause behind it, and resume after close', () => {
    const board = root();

    expect(states(board)).toEqual(loops.map(() => false));

    const modal = overlay();

    expect(states(board)).toEqual(loops.map(() => true));
    expect(states(modal)).toEqual(loops.map(() => false));
    modal.remove();
    expect(states(board)).toEqual(loops.map(() => false));
});
test('drawers pause background loops too', () => {
    const board = root();

    overlay('drawer-overlay');
    expect(states(board)).toEqual(loops.map(() => true));
});
test('only the topmost stacked modal keeps its loops and the lower one resumes', () => {
    const board = root();
    const lower = overlay();
    const upper = overlay();

    expect(states(board)).toEqual(loops.map(() => true));
    expect(states(lower)).toEqual(loops.map(() => true));
    expect(states(upper)).toEqual(loops.map(() => false));
    upper.remove();
    expect(states(lower)).toEqual(loops.map(() => false));
});
test('refresh pings pause behind a modal and resume when it closes', () => {
    const board = root();
    const ping = probe(board, '');

    ping.setAttribute('data-ping', '');
    expect(paused(ping)).toBe(false);

    const modal = overlay();

    expect(paused(ping)).toBe(true);

    const topPing = probe(modal, '');

    topPing.setAttribute('data-ping', '');
    expect(paused(topPing)).toBe(false);
    modal.remove();
    expect(paused(ping)).toBe(false);
});
test('one-shot entrance animations keep playing behind a modal', () => {
    const board = root();

    overlay();
    expect(paused(probe(board, 'animate-in fade-in-0'))).toBe(false);
});
test('a popover on the open board leaves loops running', () => {
    const board = root();
    const popover = root('popover-content');

    expect(states(board)).toEqual(loops.map(() => false));
    expect(states(popover)).toEqual(loops.map(() => false));
});
test('a menu mounted after a modal keeps its loops', () => {
    overlay();

    const menu = root();

    menu.setAttribute('role', 'menu');
    expect(states(menu)).toEqual(loops.map(() => false));
});
test('a toaster keeps its loops even when mounted before a modal', () => {
    const toaster = root('toaster');

    overlay();
    expect(states(toaster)).toEqual(loops.map(() => false));
});
