import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vite-plus/test';

import { appRoutes } from '@/app/AppRoutes';
import { AppProviders } from '@/app/providers/AppProviders';
import { createAppLocalization } from '@/shared/localization';

async function renderAt(path: string) {
    const localization = await createAppLocalization();
    const router = createMemoryRouter(appRoutes, { initialEntries: [path] });

    render(
        <AppProviders localization={localization}>
            <RouterProvider router={router} />
        </AppProviders>,
    );
}

describe('app', () => {
    it('shows the home page and its status', async () => {
        await renderAt('/');

        expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument();
        expect(await screen.findByText('Everything is running')).toBeInTheDocument();
    });

    it('shows the not-found page for unknown addresses', async () => {
        await renderAt('/nowhere');

        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    });
});
