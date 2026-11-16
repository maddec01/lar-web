import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vite-plus/test';

import { RichText } from './RichText';

const render = (text: string, format: 'markdown' | 'html') =>
    renderToStaticMarkup(createElement(RichText, { text, format }));
const markdown = (text: string) => render(text, 'markdown');
const html = (text: string) => render(text, 'html');

describe('sanitizing', () => {
    const inputs = {
        'a script tag': '<script>alert(1)</script>after',
        'an event handler': '<p onclick="alert(1)" onmouseover="alert(2)">hi</p>',
        'a javascript: link': '<a href="javascript:alert(1)">x</a>',
        'an iframe': '<iframe src="https://evil.example"></iframe>',
        'a style attribute': '<p style="position:fixed">hi</p>',
        'a style tag': '<style>body{display:none}</style>hi',
    };

    for (const [name, input] of Object.entries(inputs)) {
        test(`html drops ${name}`, () => {
            expect(html(input)).not.toMatch(
                /<script|<iframe|<style|onclick|onmouseover|javascript:|position:fixed|display:none|alert\(/i,
            );
        });
    }

    test('a markdown javascript: link loses its href', () => {
        expect(markdown('[x](javascript:alert(1))')).not.toMatch(/javascript:/);
    });
});

describe('images', () => {
    test('a markdown image becomes a link with its alt text, opening in a new tab', () => {
        const out = markdown('![a diagram](https://example.com/d.png)');

        expect(out).not.toMatch(/<img/);
        expect(out).toContain('data-attachment="true"');
        expect(out).toMatch(
            /<a [^>]*href="https:\/\/example.com\/d.png"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>[\s\S]*Image: a diagram<\/a>/,
        );
    });
});

describe('links', () => {
    test('open in a new tab with rel, in markdown and html', () => {
        for (const out of [
            markdown('[x](https://example.com)'),
            html('<a href="https://example.com">x</a>'),
            markdown('<a href="https://example.com">x</a>'),
        ]) {
            expect(out).toMatch(/<a [^>]*target="_blank"/);
            expect(out).toMatch(/<a [^>]*rel="noopener noreferrer"/);
        }
    });
});

test('Markdown keeps bare angle-bracket placeholders as text alongside sanitized HTML', () => {
    const out = markdown(
        'Use <fragment> with <server-id> and `<fragment>`.\n\n<fragment>\n\n<details><summary>Contract</summary>Keep <fragment>.</details>',
    );

    expect(out.match(/&lt;fragment&gt;/g)).toHaveLength(4);
    expect(out).toContain('&lt;server-id&gt;');
    expect(out).toContain('<details>');
    expect(out).not.toContain('<fragment>');
});

test('Markdown preserves multi-word placeholders in prose, HTML, code and link labels', () => {
    const out = markdown(
        'Accept only #greeting=<percent-encoded JSON>, decode once.\n\n<percent-encoded JSON>\n\n<details><summary>Contract</summary>Use <plain text value>.</details>\n\n`<percent-encoded JSON>` and [<percent-encoded JSON>](https://example.com).',
    );

    expect(out.match(/&lt;percent-encoded JSON&gt;/g)).toHaveLength(4);
    expect(out).toContain('&lt;plain text value&gt;');
    expect(out).toContain('<details>');
    expect(out).toContain('<code>&lt;percent-encoded JSON&gt;</code>');
    expect(out).toMatch(/<a [^>]*href="https:\/\/example.com"[^>]*>&lt;percent-encoded JSON&gt;<\/a>/);
});

test('real tags with attributes and quoted angle brackets keep their sanitizer behavior', () => {
    const out = markdown(
        '<details open><summary title="<percent-encoded JSON>">Contract</summary><input disabled><a href="https://example.com" title="<fragment>">link</a></details>\n\n<script async>alert(1)</script><iframe allowfullscreen>hidden</iframe><custom-element data-value="yes">kept text</custom-element>',
    );

    expect(out).toContain('<details open="">');
    expect(out).toMatch(/<input disabled=""[^>]*type="checkbox"/);
    expect(out).toContain('title="&lt;percent-encoded JSON&gt;"');
    expect(out).toContain('title="&lt;fragment&gt;"');
    expect(out).toContain('kept text');
    expect(out).not.toMatch(/<script|alert\(|<iframe|<custom-element|&lt;script|&lt;iframe|&amp;lt;/);
});
