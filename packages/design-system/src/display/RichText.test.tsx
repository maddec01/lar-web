import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vite-plus/test';

import { RichText } from './RichText';

const render = (text: string, format: 'markdown' | 'html') =>
    renderToStaticMarkup(createElement(RichText, { text, format }));
const markdown = (text: string) => render(text, 'markdown');
const html = (text: string) => render(text, 'html');

test('html is not read as markdown', () => {
    expect(html('<p>* not a list\n# not a heading</p>')).not.toMatch(/<li>|<h1>/);
});

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
        for (const [format, run] of [
            ['markdown', markdown],
            ['html', html],
        ] as const) {
            test(`${format} drops ${name}`, () => {
                const out = run(input);

                expect(out).not.toMatch(
                    /<script|<iframe|<style|onclick|onmouseover|javascript:|position:fixed|display:none|alert\(/i,
                );
            });
        }
    }

    test('a markdown javascript: link loses its href', () => {
        expect(markdown('[x](javascript:alert(1))')).not.toMatch(/javascript:/);
    });

    test('a javascript: image becomes plain text, not a link', () => {
        const out = markdown('![bad](javascript:alert(1))');

        expect(out).not.toMatch(/javascript:|<img/);
        expect(out).toMatch(/bad/);
    });

    test('text outside the tags stays', () => {
        expect(html('<script>x</script>after')).toMatch(/after/);
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

    test('an html image becomes a link too', () => {
        const out = html('<p><img src="https://example.com/d.png" alt="shot"></p>');

        expect(out).not.toMatch(/<img/);
        expect(out).toContain('data-attachment="true"');
        expect(out).toMatch(
            /<a [^>]*href="https:\/\/example.com\/d.png"[^>]*target="_blank"[^>]*>[\s\S]*Image: shot<\/a>/,
        );
    });

    test('raw html in markdown becomes a link', () => {
        const out = markdown('<img src="https://example.com/d.png" alt="raw">');

        expect(out).not.toMatch(/<img/);
        expect(out).toContain('data-attachment="true"');
        expect(out).toMatch(/<a [^>]*href="https:\/\/example.com\/d.png"[^>]*>[\s\S]*Image: raw<\/a>/);
    });

    test('an empty alt shows the URL as the link text', () => {
        expect(markdown('![](https://example.com/d.png)')).toMatch(/>https:\/\/example.com\/d.png<\/a>/);
        expect(html('<img src="https://example.com/e.png">')).toMatch(/>https:\/\/example.com\/e.png<\/a>/);
    });

    test('an image inside a link does not nest links', () => {
        const out = markdown('[![alt text](https://example.com/i.png)](https://example.com/page)');

        expect(out.match(/<a /g)?.length).toBe(1);
        expect(out).toMatch(/href="https:\/\/example.com\/page"/);
        expect(out).toMatch(/alt text/);
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
