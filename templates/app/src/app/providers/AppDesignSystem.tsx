import { DesignSystemProvider, Notifications, TooltipProvider } from '@lar-works/design-system';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/** The design system's labels in the app's language, with its tooltips and notifications. */
export function AppDesignSystem({ children }: { children: ReactNode }) {
    const { t } = useTranslation();

    return (
        <DesignSystemProvider
            labels={{
                close: t('common.close'),
                cancel: t('common.cancel'),
                retry: t('common.tryAgain'),
                theme: {
                    label: t('theme.label'),
                    system: t('theme.system'),
                    light: t('theme.light'),
                    dark: t('theme.dark'),
                },
            }}
        >
            <TooltipProvider>
                {children}
                <Notifications />
            </TooltipProvider>
        </DesignSystemProvider>
    );
}
