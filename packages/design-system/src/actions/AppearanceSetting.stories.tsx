import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InsetPanel } from '../display/InsetPanel';
import type { ThemePreference } from '../foundations/Theme';
import { AppearanceSetting } from './AppearanceSetting';

const meta = {
    title: 'Actions/AppearanceSetting',
    component: AppearanceSetting,
    args: {
        value: 'system',
        onChange: () => {},
        description: 'Follow the system, or always use light or dark.',
    },
    argTypes: { value: { control: 'inline-radio', options: ['system', 'light', 'dark'] } },
    render: function Render(args) {
        const [value, setValue] = useState<ThemePreference>(args.value);

        return (
            <div className="w-[36rem]">
                <InsetPanel presentation="settings">
                    <AppearanceSetting {...args} value={value} onChange={setValue} />
                </InsetPanel>
            </div>
        );
    },
} satisfies Meta<typeof AppearanceSetting>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Settings › General › Appearance, as Lar Server and Lar Factory show it: the choice applies at once. */
export const Default: Story = {};

/** A stored choice. */
export const Dark: Story = { args: { value: 'dark' } };
