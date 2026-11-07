import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { i18n } from 'i18next';
import { type ReactNode, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { AppDesignSystem } from '@/app/providers/AppDesignSystem';

interface AppProvidersProps {
    children: ReactNode;
    localization: i18n;
}

export function AppProviders({ children, localization }: AppProvidersProps) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <I18nextProvider i18n={localization}>
            <QueryClientProvider client={queryClient}>
                <AppDesignSystem>{children}</AppDesignSystem>
            </QueryClientProvider>
        </I18nextProvider>
    );
}
