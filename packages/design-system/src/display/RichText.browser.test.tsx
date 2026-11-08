import '../styles.css';

import { render } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser/context';

import { Text } from '../typography/Typography';
import { RichText } from './RichText';

const prose = 'Read the description and the decisions before reviewing the implementation. '.repeat(8);
const formats = {
    markdown: `${prose}\n\n- ${prose}\n\n1. ${prose}\n\n| Stage | Evidence |\n| --- | --- |\n| Verify | Tests |\n\n\`\`\`ts\nconst stage = 'Verify';\n\`\`\``,
    html: `<p>${prose}</p><ul><li>${prose}</li></ul><ol><li>${prose}</li></ol><table><tbody><tr><td>Verify</td><td>Tests</td></tr></tbody></table><pre><code>const stage = 'Verify';</code></pre>`,
};

it.each([1440, 390])('limits prose while retaining wide technical content at %ipx', async (width) => {
    await page.viewport(width, 900);

    for (const theme of ['light', 'dark']) {
        document.documentElement.className = theme;

        for (const format of ['markdown', 'html'] as const) {
            const { container, unmount } = render(
                <>
                    <Text measure="reading">{prose}</Text>
                    <RichText text={formats[format]} format={format} />
                </>,
            );
            const root = container.querySelector('[data-slot="rich-text"]')!;
            const available = root.getBoundingClientRect().width;
            const supporting = container.querySelector('p')!;
            const measure = supporting.getBoundingClientRect().width;

            expect(measure).toBeLessThanOrEqual(available);

            if (width === 1440) expect(measure).toBeLessThan(available * 0.7);

            for (const element of root.querySelectorAll('p, ul, ol')) {
                expect(element.getBoundingClientRect().width).toBeCloseTo(measure, 0);
            }

            for (const element of root.querySelectorAll('table, pre')) {
                expect(element.getBoundingClientRect().width).toBeCloseTo(available, 0);
            }

            expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
            unmount();
        }

        const { container, unmount } = render(
            <RichText
                format="markdown"
                text={`${prose}\n\n\`\`\`mermaid\nflowchart LR\nshape --> build\n\`\`\`\n\n${prose}`}
                renderDiagram={() => <div data-diagram>Concept diagram</div>}
            />,
        );
        const root = container.querySelector('[data-slot="rich-text-with-diagrams"]')!;

        expect(container.querySelector('[data-diagram]')!.getBoundingClientRect().width).toBeCloseTo(
            root.getBoundingClientRect().width,
            0,
        );
        unmount();
    }
});
