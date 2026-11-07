import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    BellIcon,
    MoreHorizontalIcon,
    PanelLeftIcon,
    RefreshCwIcon,
    SearchIcon,
    SettingsIcon,
    Trash2Icon,
} from 'lucide-react';

import { IconButton } from './IconButton';

const meta = {
    title: 'Actions/IconButton',
    component: IconButton,
    args: { icon: <SettingsIcon />, 'aria-label': 'Library settings', variant: 'quiet', tone: 'neutral' },
    argTypes: {
        variant: { control: 'inline-radio', options: ['quiet', 'header', 'title-bar'] },
        tone: { control: 'select', options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] },
    },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Quiet: Story = {};

export const Header: Story = { args: { variant: 'header', icon: <SearchIcon />, 'aria-label': 'Search the library' } };

export const TitleBar: Story = {
    args: { variant: 'title-bar', icon: <PanelLeftIcon />, 'aria-label': 'Toggle sidebar' },
};

export const WithNotification: Story = {
    args: {
        variant: 'header',
        icon: <BellIcon />,
        'aria-label': 'Notifications',
        notification: '3 albums finished importing',
    },
};

export const Danger: Story = { args: { tone: 'danger', icon: <Trash2Icon />, 'aria-label': 'Delete repository' } };

export const Loading: Story = { args: { loading: true, icon: <RefreshCwIcon />, 'aria-label': 'Rescan library' } };

export const Disabled: Story = { args: { disabled: true, icon: <MoreHorizontalIcon />, 'aria-label': 'More actions' } };

/** Every variant and tone side by side, for comparing them in light and dark. */
export const AllVariants: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                {(['quiet', 'header', 'title-bar', 'inline'] as const).map((variant) => (
                    <IconButton key={variant} {...args} variant={variant} aria-label={`${variant} settings`} />
                ))}
                <IconButton
                    {...args}
                    variant="header"
                    icon={<BellIcon />}
                    aria-label="Notifications"
                    notification="New"
                />
            </div>
            <div className="flex items-center gap-3">
                {(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
                    <IconButton key={tone} {...args} tone={tone} aria-label={`${tone} settings`} />
                ))}
            </div>
        </div>
    ),
};
