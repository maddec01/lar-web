import type { Meta, StoryObj } from '@storybook/react-vite';

import { conceptIcons, type IconConcept } from './ConceptIcons';

const meta = {
    title: 'Foundations/Icon glossary',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** One icon per concept, the same in every app; docs/Icons.mdx says when each applies. */
export const Glossary: Story = {
    render: () => (
        <ul className="text-fg m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3 p-0">
            {(Object.entries(conceptIcons) as [IconConcept, (typeof conceptIcons)[IconConcept]][]).map(
                ([concept, Icon]) => (
                    <li
                        key={concept}
                        className="border-line bg-surface-raised flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                    >
                        <Icon aria-hidden="true" className="text-fg-muted size-4 shrink-0" />
                        <code className="text-xs">{concept}</code>
                    </li>
                ),
            )}
        </ul>
    ),
};
