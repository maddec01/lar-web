import type { Meta, StoryObj } from '@storybook/react-vite';

import { Diagram } from './Diagram';
import { RichText } from './RichText';

const markdown = `## What changes

The board’s **title bar** moves into the design system, with _no_ visual change.

- [x] Move the counters
- [ ] Move the loading screen

\`\`\`ts
const answer = 42;
\`\`\`

| Part | Owner |
| ---- | ----- |
| Title bar | Board |

> Images become links: ![screenshot](https://example.com/shot.png)

<details><summary>Raw HTML</summary>Kept, sanitized.</details>`;

const meta = {
    title: 'Display/RichText',
    component: RichText,
    args: { text: markdown, format: 'markdown' },
} satisfies Meta<typeof RichText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Markdown: Story = {};

/** An Azure DevOps field, which holds HTML. */
export const Html: Story = {
    args: {
        format: 'html',
        text: '<div><b>Acceptance</b><ul><li>Opens in a new tab: <a href="https://example.com">spec</a></li></ul><script>alert(1)</script></div>',
    },
};

export const LongUnbrokenText: Story = {
    args: { text: `A path with no breaks: ${'/very/long/segment'.repeat(20)} and a [link](https://example.com).` },
};

/** Markdown’s Mermaid blocks draw through `renderDiagram`, between the text around them. */
export const WithDiagram: Story = {
    args: {
        text: 'Before the map.\n\n```mermaid\nflowchart LR\n  shape --> build\n```\n\nAfter the map.',
        renderDiagram: (source) => (
            <Diagram
                source={source}
                draw={async () =>
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="200" height="40"><text x="10" y="25" fill="currentColor">shape → build</text></svg>'
                }
                label="Concept map diagram"
                failedLabel="The diagram couldn’t be drawn."
                sourceLabel="Diagram source"
            />
        ),
    },
};

/** An attached image remains a named attachment without loading a remote image. */
export const ImageAttachment: Story = {
    args: {
        text: '## Open questions\n\nConfirm the details in the attachment.\n\n![Sign-up flow](https://example.com/sign-up-flow.png)',
        format: 'markdown',
    },
};

/** Prose and lists stay readable while the surrounding technical content can use the available width. */
export const ReadingMeasure: Story = {
    args: {
        text: `## Description

The factory keeps a work record for each item so the next person can understand the decision, the implementation and the evidence behind it. Descriptions should remain comfortable to read even when the item dialog is expanded on a large display, without narrowing the diagrams and technical details that explain the work.

- Review the item’s original context, its acceptance criteria and the decisions recorded while shaping the work. These notes stay readable alongside the rest of the description.
- Check the implementation and its verification before choosing the next step. Keep the evidence with the item so another person can follow the same path.

\`\`\`ts
const stages = ['List', 'Queued', 'Building', 'Verify', 'Ready to merge'];
\`\`\`

| Stage | What happens | Evidence |
| --- | --- | --- |
| Verify | Check the implementation against the acceptance criteria | Screenshots, tests and review notes |

\`\`\`mermaid
flowchart LR
  shape --> build
\`\`\`

The item keeps the wider technical content together with the readable prose.`,
        renderDiagram: WithDiagram.args?.renderDiagram,
    },
};
