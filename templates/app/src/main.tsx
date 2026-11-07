import '@lar-works/design-system/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { appRoutes } from '@/app/AppRoutes';
import { AppProviders } from '@/app/providers/AppProviders';
import { createAppLocalization } from '@/shared/localization';
import { initializeTheme } from '@/shared/preferences/Theme';

initializeTheme();

const localization = await createAppLocalization();
const router = createBrowserRouter(appRoutes);
const root = document.getElementById('root');

if (root === null) throw new Error('The app root is missing');

createRoot(root).render(
    <StrictMode>
        <AppProviders localization={localization}>
            <RouterProvider router={router} />
        </AppProviders>
    </StrictMode>,
);
