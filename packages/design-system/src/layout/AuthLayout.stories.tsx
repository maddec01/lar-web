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
            <Button type="button" variant="quiet" fullWidth>
                Forgot password?
            </Button>
        </Stack>
    );
}

const meta = {
    title: 'Layout/AuthLayout',
    component: AuthLayout,
    parameters: { layout: 'fullscreen' },
    args: {
        brandLabel: 'Lar',
        title: 'Sign in',
        description: 'Sign in with your administrator email to continue.',
        children: <SignInForm />,
    },
    argTypes: { children: { control: false } },
} satisfies Meta<typeof AuthLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignIn: Story = {};

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
        title: 'Lar',
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
