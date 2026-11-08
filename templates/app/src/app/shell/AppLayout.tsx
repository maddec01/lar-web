import { AppShell, BrandLink, ThemeSwitch, TitleBar, TitleBarTrail } from '@lar-works/design-system';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import { useTheme } from '@/shared/preferences/Theme';
import { paths } from '@/shared/routing/routes';

export function AppLayout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [theme, setTheme] = useTheme();

    return (
        <AppShell
            header={
                <TitleBar
                    brand={
                        <BrandLink
                            href={paths.home}
                            label={t('brand.home')}
                            onNavigate={(href: string) => void navigate(href)}
                        />
                    }
                    title={<TitleBarTrail items={[{ key: 'home', label: t('brand.name') }]} />}
                    actions={<ThemeSwitch value={theme} onChange={setTheme} />}
                />
            }
        >
            <Outlet />
        </AppShell>
    );
}
