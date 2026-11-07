import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { Checkbox } from '../forms/Checkbox';
import { Field } from '../forms/Field';
import { Input } from '../forms/Input';
import { Text } from '../typography/Typography';
import { ActionModal } from './ActionModal';

/** Opens with the story, and reopens from the button after it is closed. */
function ActionModalDemo(args: ComponentProps<typeof ActionModal>) {
    const [open, setOpen] = useState(true);

    return (
        <>
            <Button variant={args.actionColor === 'danger' ? 'destructive' : 'secondary'} onClick={() => setOpen(true)}>
                {args.title}
            </Button>
            {open ? (
                <ActionModal
                    {...args}
                    onClose={() => {
                        setOpen(false);
                        args.onClose();
                    }}
                />
            ) : null}
        </>
    );
}

const meta = {
    title: 'Overlays/ActionModal',
    component: ActionModal,
    args: {
        title: 'Add library',
        description: 'Lar scans the folder and keeps the library in sync as files change.',
        actionLabel: 'Add library',
        loading: false,
        onAction: fn(),
        onClose: fn(),
        children: (
            <div className="flex flex-col gap-4">
                <Field label="Name">
                    <Input defaultValue="Movies" />
                </Field>
                <Field label="Folder">
                    <Input defaultValue="/mnt/media/movies" />
                </Field>
            </div>
        ),
    },
    render: (args) => <ActionModalDemo {...args} />,
} satisfies Meta<typeof ActionModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {
    args: {
        title: 'Delete catalog',
        description: 'This removes “Family photos” from Lar. The files on disk are not touched.',
        actionLabel: 'Delete',
        actionColor: 'danger',
        children: <Text>4,812 photos and 37 albums will disappear from every device.</Text>,
    },
};

export const Submitting: Story = { args: { loading: true } };

export const ActionDisabled: Story = {
    args: {
        title: 'Remove user',
        description: 'Ana will lose access to every library on this server.',
        actionLabel: 'Remove',
        actionColor: 'danger',
        actionDisabled: true,
        children: <Checkbox label="I understand Ana’s watch history will be deleted" />,
    },
};

export const WithFooterLeading: Story = {
    args: {
        footerLeading: (
            <Text as="span" variant="caption" tone="muted">
                Scanning starts right away.
            </Text>
        ),
    },
};
