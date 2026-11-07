import { ButtonLink, PageLayout } from '@lar-works/design-system';
import { useTranslation } from 'react-i18next';

import { paths } from '@/shared/routing/routes';

export function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <PageLayout label={t('notFound.title')} title={t('notFound.title')} description={t('notFound.description')}>
            <ButtonLink href={paths.home}>{t('notFound.home')}</ButtonLink>
        </PageLayout>
    );
}
