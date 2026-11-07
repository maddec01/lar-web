import { createRoutesFromElements, Route } from 'react-router-dom';

import { NotFoundPage } from '@/app/pages/not-found/NotFoundPage';
import { AppLayout } from '@/app/shell/AppLayout';
import { HomePage } from '@/features/home';
import { paths } from '@/shared/routing/routes';

export const appRoutes = createRoutesFromElements(
    <Route element={<AppLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Route>,
);
