import type { Meta, StoryObj } from '@storybook/react-vite';
import { type FormEvent, useState } from 'react';

import { Button } from '../actions/Button';
import { Input } from './Input';
import { useSettingsDraft } from './SettingsDraft';
import { SettingsGroup } from './SettingsGroup';
import { SettingsPage } from './SettingsPage';
import { SettingsRow } from './SettingsRow';

/** A typed email is a draft: the page's save bar saves it, Enter in the field too. */
function EmailDraft() {
    const [saved, setSaved] = useState('marta@lar.home');
    const [typed, setTyped] = useState<string | null>(null);
    const text = typed ?? saved;
    const { submit } = useSettingsDraft({
        dirty: typed !== null && typed !== saved,
        invalid: !text.includes('@'),
        save: () =>
            new Promise<void>((resolve) =>
                setTimeout(() => {
                    setSaved(text);
                    setTyped(null);
                    resolve();
                }, 500),
            ),
        reset: () => setTyped(null),
    });

    return (
        <form
            onSubmit={(event: FormEvent) => {
                event.preventDefault();
                submit();
            }}
        >
            <Input
                presentation="setting"
                type="email"
                aria-label="Email"
                value={text}
                onChange={(event) => setTyped(event.target.value)}
            />
        </form>
    );
}

function AccountDemo({ loading = false }: { loading?: boolean }) {
    return (
        <SettingsPage
            title="Account"
            description="marta@lar.home"
            descriptionLoading={loading}
            actions={
                <Button size="sm" variant="secondary">
                    Sign out
                </Button>
            }
        >
            <SettingsGroup title="Email" loading={loading} skeleton={[{ label: 'Email', control: 'input' }]}>
                <SettingsRow label="Email" description="Where Lar sends sign-in links and server invitations.">
                    <EmailDraft />
                </SettingsRow>
            </SettingsGroup>
            <SettingsGroup
                title="Ways to sign in"
                count={3}
                countLabel="3 ways to sign in"
                action={
                    <Button size="sm" variant="tinted">
                        Add a passkey
                    </Button>
                }
                loading={loading}
                skeleton={[
                    { label: 'Google', description: 'Signed in with Google' },
                    { label: 'Apple', description: 'Signed in with Apple' },
                    { label: 'MacBook Pro passkey', description: 'Added Nov 2, 2026' },
                ]}
            >
                <SettingsRow label="Google" description="Signed in with Google">
                    <Button size="sm" variant="destructive-quiet">
                        Remove
                    </Button>
                </SettingsRow>
                <SettingsRow label="Apple" description="Signed in with Apple">
                    <Button size="sm" variant="destructive-quiet">
                        Remove
                    </Button>
                </SettingsRow>
                <SettingsRow label="MacBook Pro passkey" description="Added Nov 2, 2026">
                    <Button size="sm" variant="destructive-quiet">
                        Remove
                    </Button>
                </SettingsRow>
            </SettingsGroup>
            <SettingsGroup title="Servers" loading={loading} skeleton={2}>
                <SettingsRow label="Home" description="Owner · lar.home">
                    <Button size="sm" variant="secondary">
                        Open
                    </Button>
                </SettingsRow>
                <SettingsRow label="Cabin" description="Member · cabin.lar.home">
                    <Button size="sm" variant="destructive-quiet">
                        Leave
                    </Button>
                </SettingsRow>
            </SettingsGroup>
        </SettingsPage>
    );
}

const meta = {
    title: 'Forms/SettingsPage',
    component: AccountDemo,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AccountDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An account's settings as a page: the same groups and rows as SettingsDialog, h2 titles under the page's h1, in a
 *  centred 40rem column. Change the email to see the save bar. */
export const Account: Story = {};
/** While the account loads: the groups' rows as skeletons as wide as their real titles. */
export const Loading: Story = { args: { loading: true } };
/** On a phone. */
export const Phone: Story = { globals: { viewport: { value: 'mobile1' } } };
