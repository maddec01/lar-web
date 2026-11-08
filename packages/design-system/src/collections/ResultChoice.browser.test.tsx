import '../styles.css';

import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expect, it, vi } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';

import { Button } from '../actions/Button';
import { Link } from '../typography/Link';
import { ResultChoice } from './ResultChoice';
import { ResultList } from './ResultList';

it('chooses a result by keyboard without continuing until the single footer action', async () => {
    const review = vi.fn();

    function Picker() {
        const [selected, setSelected] = useState('original');

        return (
            <>
                <ResultList label="Release matches" presentation="choice">
                    {['original', 'reissue'].map((value) => (
                        <ResultChoice
                            key={value}
                            name="release"
                            checked={selected === value}
                            onChange={() => setSelected(value)}
                            detail={selected === value ? 'Compare the track count before continuing.' : undefined}
                            trailing={
                                <Link href="https://musicbrainz.org" external aria-label={`Compare ${value}`}>
                                    MusicBrainz
                                </Link>
                            }
                        >
                            {value}
                        </ResultChoice>
                    ))}
                </ResultList>
                <Button onClick={() => review(selected)}>Review changes</Button>
            </>
        );
    }

    render(<Picker />);
    await page.getByRole('radio', { name: 'original', exact: true }).click();
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('radio', { name: 'original' }));
    await userEvent.keyboard('{ArrowDown}');
    await expect.poll(() => (screen.getByRole('radio', { name: 'reissue' }) as HTMLInputElement).checked).toBe(true);
    expect(review).not.toHaveBeenCalled();
    expect(screen.getAllByRole('button', { name: 'Review changes' })).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Compare reissue' }).closest('label')).toBeNull();
    await page.getByRole('button', { name: 'Review changes' }).click();
    expect(review).toHaveBeenCalledWith('reissue');
});

it('disables every choice through the native choice group', () => {
    render(
        <ResultList label="Matches" presentation="choice" disabled>
            <ResultChoice name="match" checked onChange={() => {}}>
                Current match
            </ResultChoice>
        </ResultList>,
    );
    expect(screen.getByRole('radio')).toBeDisabled();
});
