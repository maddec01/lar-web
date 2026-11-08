// The behaviour Lar Factory's item dialog parts keep in the design system: what folds, what each open hears, and what
// is announced.

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { Comment } from '../display/Comment';
import { Disclosure } from '../forms/FormSection';
import { EditActions, TicketLink } from './ItemDetails';
import { WorkflowSteps } from './ItemProgress';

it('a lazy section disclosure renders its content only once opened', () => {
    const { container } = render(
        <Disclosure label="Original" presentation="section" lazy>
            <p>Let owners sign in.</p>
        </Disclosure>,
    );

    expect(screen.queryByText('Let owners sign in.')).toBeNull();

    const details = container.querySelector('details')!;

    details.open = true;
    fireEvent(details, new Event('toggle'));
    expect(screen.getByText('Let owners sign in.')).toBeInTheDocument();
});

it("an editor's save error takes its status's place, announced", () => {
    const { rerender } = render(<EditActions status="Unsaved changes">{null}</EditActions>);

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    rerender(
        <EditActions status="Unsaved changes" error="The issue is locked.">
            {null}
        </EditActions>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('The issue is locked.');
    expect(screen.queryByText('Unsaved changes')).toBeNull();
});

it("a linked ticket names its state, and a comment's author is marked for its readers", () => {
    render(
        <ul>
            <TicketLink closed stateLabel="Done" href="#144" reference="#144" title="Owner table" />
            <Comment author="maddec01" time="2h">
                <p>Ship it.</p>
            </Comment>
        </ul>,
    );

    expect(screen.getByLabelText('Done')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveTextContent('#144 Owner table');
    expect(document.querySelector('[data-comment-author]')).toHaveTextContent('maddec01');
});

it('the workflow steps mark the current one, named with its number, and label every step', () => {
    render(
        <WorkflowSteps
            steps={['Queued', 'Shaping', 'Ready'].map((name, i) => ({
                title: name,
                label: `Step ${i + 1} of 3: ${name}`,
            }))}
            at={1}
            name="Working"
            ordinal="Stage 2 of 3"
            color="red"
        />,
    );

    const current = screen.getByLabelText('Step 2 of 3: Shaping');

    expect(current).toHaveAttribute('aria-current', 'step');
    expect(current.parentElement!.previousElementSibling).toHaveTextContent('WorkingStage 2 of 3');
    expect(screen.getByLabelText('Step 3 of 3: Ready')).not.toHaveAttribute('aria-current');
});
