import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadIcon, MailIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { ButtonLink } from '../actions/ButtonLink';
import { CallToAction } from './CallToAction';

const meta = {
    title: 'Showcase/CallToAction',
    component: CallToAction,
    args: {
        title: 'Bring it home.',
        lead: 'Start with Lar Factory today, and watch Lar Server grow one app at a time.',
        actions: (
            <>
                <ButtonLink
                    href="https://github.com/maddec01/lar-factory/releases/latest"
                    external
                    icon={<DownloadIcon />}
                >
                    Download Lar Factory
                </ButtonLink>
                <ButtonLink href="/server#progress" variant="secondary" arrow onNavigate={fn()}>
                    See progress on Server
                </ButtonLink>
            </>
        ),
    },
    argTypes: { actions: { control: false } },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-[1200px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CallToAction>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The home page's closing panel. */
export const Default: Story = {};

/** Lar Server's closing panel, with a note under the actions. */
export const WithNote: Story = {
    args: {
        title: 'Lar Server is on its way home.',
        lead: "It's being built one app at a time, on real hardware. Want to hear the moment it's ready?",
        note: 'Opens your email app with a note asking for one launch email.',
        actions: (
            <>
                <ButtonLink href="mailto:dev@lar.works?subject=Lar%20Server%20launch" icon={<MailIcon />}>
                    Notify me at launch
                </ButtonLink>
                <ButtonLink href="/factory" variant="secondary" arrow onNavigate={fn()}>
                    Meanwhile, try Lar Factory
                </ButtonLink>
            </>
        ),
    },
};
