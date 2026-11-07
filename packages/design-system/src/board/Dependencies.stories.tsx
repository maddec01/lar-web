import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../actions/Button';
import { buttonKind } from './ButtonKinds';
import { DependencyItem, DependencyList } from './Dependencies';

const meta = {
    title: 'Board/Dependencies',
    component: DependencyList,
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
    args: {
        children: (
            <>
                <DependencyItem
                    id="d1"
                    owner="Dependency on the platform team · not met"
                    need="A sign-in endpoint that issues device tokens"
                    read={
                        <>
                            <a href="#ticket">platform#88</a> still open, read 2h ago
                        </>
                    }
                    evidence="Evidence: the endpoint answers in staging"
                    notice="Its ticket closed. Mark it met once the evidence holds."
                    action={<Button {...buttonKind('other')}>Mark met</Button>}
                />
                <DependencyItem
                    id="d2"
                    owner="Dependency on lar-apple · met, marked by you 1d ago"
                    need="The player exposes its position"
                    read="No ticket. Handover only."
                    evidence="No evidence agreed yet"
                    action={<Button {...buttonKind('other')}>Clear met mark</Button>}
                />
            </>
        ),
    },
} satisfies Meta<typeof DependencyList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const List: Story = {};
