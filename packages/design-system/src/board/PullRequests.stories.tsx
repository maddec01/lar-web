import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../actions/Button';
import { buttonKind } from './ButtonKinds';
import {
    ChecksState,
    PullRequestList,
    PullRequestReadiness,
    PullRequestRef,
    PullRequestRow,
    ReadinessDetails,
} from './PullRequests';

const meta = {
    title: 'Board/PullRequests',
    component: PullRequestList,
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
                <PullRequestRow href="#210" label="PR #210" checks={<ChecksState state="passed" />} />
                <PullRequestRow href="#211" label="PR #211 (draft)" checks={<ChecksState state="running" />} />
                <PullRequestRow
                    href="#212"
                    label="PR #212"
                    checks={<ChecksState state="failed" counts="3/4 passed" />}
                    readiness={
                        <PullRequestReadiness
                            toggle={
                                <Button {...buttonKind('other')} aria-expanded>
                                    Readiness details
                                </Button>
                            }
                            details={
                                <ReadinessDetails
                                    id="readiness-212"
                                    status="Readiness blocked."
                                    observed="Observed 2026-10-31 · revision 4f2a9c"
                                    blockers={[
                                        'Reviewer Ana: requested changes. Check reviewer requirements in Azure.',
                                    ]}
                                    note="T3 Azure PR context is unsupported; evidence comes from Azure."
                                    refresh={<Button {...buttonKind('other')}>Refresh readiness</Button>}
                                />
                            }
                        />
                    }
                />
            </>
        ),
    },
} satisfies Meta<typeof PullRequestList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const List: Story = {};

/** A pull request as a row names it. */
export const Reference: Story = {
    render: () => <PullRequestRef label="PR #151" title="PR #151 Cache probe results" />,
};
