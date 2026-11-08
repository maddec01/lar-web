import type { Meta, StoryObj } from '@storybook/react-vite';
import { GitPullRequestIcon, InboxIcon, MessageSquareTextIcon, PlayIcon, Trash2Icon } from 'lucide-react';

import { Button } from '../actions/Button';
import { buttonKind } from './ButtonKinds';

/** The board’s five kinds of button, spread from `buttonKind` on the design system’s Button. */
function Kinds() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button {...buttonKind('main')}>Add item</Button>
            <Button {...buttonKind('main', 'danger')} leftIcon={<Trash2Icon />}>
                Abandon
            </Button>
            <Button {...buttonKind('start')} leftIcon={<PlayIcon />}>
                Start build
            </Button>
            <Button {...buttonKind('open')} leftIcon={<MessageSquareTextIcon />}>
                Open thread
            </Button>
            <Button {...buttonKind('open')} leftIcon={<GitPullRequestIcon />}>
                Open PR
            </Button>
            <Button {...buttonKind('control')} leftIcon={<InboxIcon />}>
                List
            </Button>
            <Button {...buttonKind('other')}>Recheck</Button>
            <Button {...buttonKind('other', 'danger')}>Abandon</Button>
            <Button {...buttonKind('other')} disabled title="T3 Code isn’t running">
                Disabled, with why
            </Button>
        </div>
    );
}

const meta = {
    title: 'Board/ButtonKinds',
    component: Kinds,
} satisfies Meta<typeof Kinds>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllKinds: Story = {};
