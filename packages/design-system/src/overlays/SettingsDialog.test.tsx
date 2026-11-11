import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type ReactNode, useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { Input } from '../forms/Input';
import { useSettingsDraft } from '../forms/SettingsDraft';
import { SettingsGroup } from '../forms/SettingsGroup';
import { SettingsRow } from '../forms/SettingsRow';
import { DesignSystemProvider } from '../foundations/DesignSystemProvider';
import { SettingsDialog, type SettingsDialogGroup, SettingsSectionPane } from './SettingsDialog';

const groups: SettingsDialogGroup[] = [
    {
        label: 'Board',
        sections: [
            { id: 'general', label: 'General', keywords: 'limits' },
            { id: 'appearance', label: 'Appearance', keywords: 'theme' },
        ],
    },
    { label: 'App', sections: [{ id: 'archive', label: 'Archive', href: '/settings/archive' }] },
];

/** A typed limit: a draft the footer saves. */
function Limit({ save }: { save: (value: number) => Promise<void> }) {
    const [saved, setSaved] = useState(4);
    const [typed, setTyped] = useState<string | null>(null);

    useSettingsDraft({
        dirty: typed !== null && typed !== String(saved),
        save: () =>
            save(Number(typed)).then(() => {
                setSaved(Number(typed));
                setTyped(null);
            }),
        reset: () => setTyped(null),
    });

    return (
        <Input aria-label="Limit" value={typed ?? String(saved)} onChange={(event) => setTyped(event.target.value)} />
    );
}

function Demo({
    save = () => Promise.resolve(),
    onSaved,
    children,
}: {
    save?: (value: number) => Promise<void>;
    onSaved?: () => void;
    children?: ReactNode;
}) {
    const [section, setSection] = useState('general');
    const [open, setOpen] = useState(true);

    return open ? (
        <SettingsDialog
            groups={groups}
            section={section}
            onSectionChange={setSection}
            onClose={() => setOpen(false)}
            onSaved={onSaved}
        >
            <SettingsGroup title={section}>
                <SettingsRow label="Limit">{section === 'general' ? <Limit save={save} /> : null}</SettingsRow>
            </SettingsGroup>
            {children}
        </SettingsDialog>
    ) : (
        <p>closed</p>
    );
}

function renderSettings(ui: ReactNode) {
    return render(ui, { wrapper: ({ children }) => <DesignSystemProvider>{children}</DesignSystemProvider> });
}

describe('SettingsDialog', () => {
    it('opens with the focus on the dialog, not its search, and / focuses the search', async () => {
        renderSettings(<Demo />);

        const dialog = await screen.findByRole('dialog');

        await waitFor(() => expect(document.activeElement).toBe(dialog));
        fireEvent.keyDown(dialog, { key: '/' });
        expect(document.activeElement).toBe(screen.getByRole('searchbox', { name: 'Search settings' }));
    });

    it('names the dialog after the open section and lists sections as links or buttons', async () => {
        renderSettings(<Demo />);

        expect(await screen.findByRole('dialog', { name: 'Settings: General' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'General' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: 'Archive' })).toHaveAttribute('href', '/settings/archive');
    });

    it('filters the sections by name and keywords, and says so in the content when nothing matches', async () => {
        renderSettings(<Demo />);

        const search = await screen.findByRole('searchbox', { name: 'Search settings' });

        fireEvent.change(search, { target: { value: 'theme' } });
        expect(screen.getByRole('button', { name: 'Appearance' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'General' })).toBeNull();

        fireEvent.change(search, { target: { value: 'nothing like it' } });
        fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
        expect(search).toHaveValue('');
        expect(document.activeElement).toBe(search);
        expect(screen.getByRole('button', { name: 'General' })).toBeInTheDocument();
    });

    it('shows Save changes only while a typed draft is unsaved, saves it and says so', async () => {
        const save = vi.fn(() => Promise.resolve());
        const onSaved = vi.fn();

        renderSettings(<Demo save={save} onSaved={onSaved} />);

        expect(screen.queryByRole('button', { name: 'Save changes' })).toBeNull();
        fireEvent.change(await screen.findByRole('textbox', { name: 'Limit' }), { target: { value: '6' } });
        await act(async () => fireEvent.click(await screen.findByRole('button', { name: 'Save changes' })));

        expect(save).toHaveBeenCalledWith(6);
        await waitFor(() => expect(onSaved).toHaveBeenCalledOnce());
        expect(screen.queryByRole('button', { name: 'Save changes' })).toBeNull();
        expect(screen.getByRole('textbox', { name: 'Limit' })).toHaveValue('6');
    });

    it('Cancel throws the draft away', async () => {
        renderSettings(<Demo />);

        fireEvent.change(await screen.findByRole('textbox', { name: 'Limit' }), { target: { value: '9' } });
        fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));

        expect(screen.getByRole('textbox', { name: 'Limit' })).toHaveValue('4');
        expect(screen.queryByRole('button', { name: 'Save changes' })).toBeNull();
    });

    it('asks before a section change loses an unsaved draft', async () => {
        renderSettings(<Demo />);

        fireEvent.change(await screen.findByRole('textbox', { name: 'Limit' }), { target: { value: '9' } });
        fireEvent.click(screen.getByRole('button', { name: 'Appearance' }));

        expect(await screen.findByRole('alertdialog', { name: 'Discard changes?' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'General', hidden: true })).toHaveAttribute('aria-current', 'page');

        fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
        await waitFor(() =>
            expect(screen.getByRole('button', { name: 'Appearance' })).toHaveAttribute('aria-current', 'page'),
        );
    });

    it('keeps a save that failed, and the draft, in place', async () => {
        renderSettings(<Demo save={() => Promise.reject(new Error('offline'))} />);

        fireEvent.change(await screen.findByRole('textbox', { name: 'Limit' }), { target: { value: '7' } });
        await act(async () => fireEvent.click(await screen.findByRole('button', { name: 'Save changes' })));

        expect(await screen.findByText('Couldn’t save your changes. Try again.')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Limit' })).toHaveValue('7');
    });

    it('keeps a typed draft through a search that matches other sections and one that finds nothing', async () => {
        renderSettings(<Demo />);

        fireEvent.change(await screen.findByRole('textbox', { name: 'Limit' }), { target: { value: '7' } });

        const search = screen.getByRole('searchbox', { name: 'Search settings' });

        fireEvent.change(search, { target: { value: 'theme' } });
        expect(screen.getByRole('textbox', { name: 'Limit' })).toHaveValue('7');

        fireEvent.change(search, { target: { value: 'nothing like it' } });
        expect(screen.queryByRole('textbox', { name: 'Limit' })).toBeNull();
        expect(screen.getByRole('textbox', { name: 'Limit', hidden: true })).toHaveValue('7');
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
        expect(screen.getByRole('textbox', { name: 'Limit' })).toHaveValue('7');

        // Still unsaved, so closing asks first.
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(await screen.findByRole('alertdialog', { name: 'Discard changes?' })).toBeInTheDocument();
    });

    it('keeps the open section’s draft while an app’s own search shows another section in its place', async () => {
        /** An app that keeps the search and shows the first matching section, as the factory does. */
        function AppSearch() {
            const [section, setSection] = useState('general');
            const [query, setQuery] = useState('');
            const shown = query && !'general limits'.includes(query) ? 'appearance' : section;

            return (
                <SettingsDialog
                    groups={groups}
                    section={shown}
                    onSectionChange={setSection}
                    onClose={() => {}}
                    query={query}
                    onQueryChange={setQuery}
                >
                    <SettingsSectionPane key="general" shown={shown === 'general'}>
                        <SettingsRow label="Limit">
                            <Limit save={() => Promise.resolve()} />
                        </SettingsRow>
                    </SettingsSectionPane>
                    {shown === 'appearance' ? (
                        <SettingsSectionPane key="appearance" shown>
                            <SettingsRow label="Theme">
                                <span>Dark</span>
                            </SettingsRow>
                        </SettingsSectionPane>
                    ) : null}
                </SettingsDialog>
            );
        }

        renderSettings(<AppSearch />);

        fireEvent.change(await screen.findByRole('textbox', { name: 'Limit' }), { target: { value: '7' } });
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search settings' }), { target: { value: 'theme' } });
        expect(screen.getByText('Theme')).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'Limit' })).toBeNull();

        fireEvent.change(screen.getByRole('searchbox', { name: 'Search settings' }), { target: { value: '' } });
        expect(screen.getByRole('textbox', { name: 'Limit' })).toHaveValue('7');
    });
});
