import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it } from 'vite-plus/test';

import { IconButton } from '../actions';
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from './index';

it('opens on keyboard focus and dismisses with Escape without moving focus', async () => {
    render(
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton aria-label="Update" icon={<span>↑</span>} />
                </TooltipTrigger>
                <TooltipPopup>Check for updates</TooltipPopup>
            </Tooltip>
        </TooltipProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Update' });

    act(() => trigger.focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Check for updates');
    expect(trigger).toHaveAccessibleDescription('Check for updates');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
});

it('suppresses a disabled tooltip and allows focus opening after it is enabled', async () => {
    function Example({ disabled }: { disabled: boolean }) {
        return (
            <TooltipProvider>
                <Tooltip disabled={disabled}>
                    <TooltipTrigger asChild>
                        <IconButton aria-label="Update" icon={<span>↑</span>} />
                    </TooltipTrigger>
                    <TooltipPopup>Check for updates</TooltipPopup>
                </Tooltip>
            </TooltipProvider>
        );
    }

    const view = render(<Example disabled />);
    const trigger = screen.getByRole('button', { name: 'Update' });

    act(() => trigger.focus());
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => trigger.blur());
    view.rerender(<Example disabled={false} />);
    act(() => trigger.focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Check for updates');
});

it.each(['direct', 'composed'])('opens a %s disabled trigger on wrapper focus', async (kind) => {
    const asChild = kind === 'composed';

    render(
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild={asChild} disabled={!asChild}>
                    {asChild ? <IconButton disabled aria-label="Update" icon={<span>↑</span>} /> : 'Update'}
                </TooltipTrigger>
                <TooltipPopup>Updates are unavailable while offline</TooltipPopup>
            </Tooltip>
        </TooltipProvider>,
    );

    const trigger = screen
        .getAllByRole('button', { name: 'Update' })
        .find((button) => button.hasAttribute('disabled'))!;

    expect(trigger).toBeDisabled();

    const wrapper = trigger.parentElement!;

    expect(wrapper).toHaveRole('button');
    expect(wrapper).toHaveAccessibleName('Update');
    expect(wrapper).toHaveAttribute('aria-disabled', 'true');

    act(() => wrapper.focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Updates are unavailable while offline');
    fireEvent.keyDown(wrapper, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(wrapper).toHaveFocus();
    expect(trigger).toBeDisabled();
});
