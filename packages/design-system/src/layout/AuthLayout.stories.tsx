import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FormEvent } from 'react';

import { Button } from '../actions/Button';
import { AsyncState } from '../feedback/AsyncState';
import { Field } from '../forms/Field';
import { Input } from '../forms/Input';
import { Text } from '../typography/Typography';
import { AuthLayout } from './AuthLayout';
import { Stack } from './Flow';

function SignInForm() {
    return (
        <Stack space="group">
            <Stack as="form" space="group" onSubmit={(event: FormEvent) => event.preventDefault()}>
                <Field label="Email">
                    <Input type="email" autoComplete="username" defaultValue="pedro@lar.works" />
                </Field>
                <Field label="Password">
                    <Input type="password" autoComplete="current-password" />
                </Field>
                <Button type="submit" fullWidth>
                    Sign in
                </Button>
            </Stack>
        </Stack>
    );
}

const meta = {
    title: 'Layout/AuthLayout',
    component: AuthLayout,
    parameters: { layout: 'fullscreen' },
    args: {
        brandLabel: 'Lar Server',
        product: 'Server',
        title: 'Sign in',
        description: 'Sign in with your administrator email to continue.',
        children: <SignInForm />,
        footer: (
            <Button type="button" variant="quiet" size="sm">
                Forgot password?
            </Button>
        ),
    },
    argTypes: { children: { control: false } },
} satisfies Meta<typeof AuthLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Lar Server's sign-in: the lockup with its word, the navy halo behind it, the form 16px apart in 32px controls. */
export const SignIn: Story = {};

/** Lar Account's, under the account pages' title bar (`placement="shell"`). */
export const Account: Story = {
    args: {
        brandLabel: 'Lar Account',
        product: 'Account',
        halo: 'account',
        placement: 'shell',
        title: 'Sign in to Lar',
        description: 'Sign in to your Lar account, or create one by signing in for the first time.',
    },
    decorators: [
        (Story) => (
            <div className="flex min-h-dvh flex-col">
                <div className="h-13 shrink-0" />
                <Story />
            </div>
        ),
    ],
};

/** A product with its own hue: Factory's amber halo. */
export const AmberHalo: Story = {
    args: { brandLabel: 'Lar Factory', product: 'Factory', halo: 'factory', title: 'Connect GitHub' },
};

/** First run: no administrator exists yet. */
export const Setup: Story = {
    args: {
        title: 'Set up',
        description:
            'No administrator exists yet. Create the first account to continue; everyone else is invited from here afterwards.',
        children: (
            <Stack as="form" space="group" onSubmit={(event: FormEvent) => event.preventDefault()}>
                <Field label="Email">
                    <Input type="email" autoComplete="username" />
                </Field>
                <Field label="Name">
                    <Input autoComplete="name" />
                </Field>
                <Field label="Password">
                    <Input type="password" autoComplete="new-password" />
                </Field>
                <Field label="Confirm password">
                    <Input type="password" autoComplete="new-password" />
                </Field>
                <Button type="submit" fullWidth>
                    Create administrator account
                </Button>
            </Stack>
        ),
    },
};

export const Recover: Story = {
    args: {
        title: 'Recover your administrator account',
        description: 'Use your saved recovery key to choose a new password.',
        children: (
            <Stack space="group">
                <Field label="Recovery key">
                    <Input autoComplete="off" />
                </Field>
                <Field label="New password">
                    <Input type="password" autoComplete="new-password" />
                </Field>
                <Button fullWidth>Reset password</Button>
                <Text variant="caption" tone="muted">
                    No recovery key? Ask another server administrator for a reset link.
                </Text>
            </Stack>
        ),
    },
};

/** While the app checks whether the server has been set up. */
export const CheckingServer: Story = {
    args: {
        title: 'Checking the server',
        description: undefined,
        children: (
            <AsyncState
                loading
                label="Checking the server"
                errorTitle="The server couldn’t be checked."
                presentation="line"
            />
        ),
    },
};
