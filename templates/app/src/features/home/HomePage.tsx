import { PageLayout, Section, StatusRow } from '@lar-works/design-system';
import { useTranslation } from 'react-i18next';

import { useStatus } from '@/services/status/status.hooks';

/** A feature composes design-system components with data from services; it never styles anything itself. */
export function HomePage() {
    const { t } = useTranslation();
    const status = useStatus();

    return (
        <PageLayout label={t('home.title')} title={t('home.title')} description={t('home.description')}>
            <Section title={t('home.status')}>
                <StatusRow
                    tone={status.isSuccess ? 'success' : 'neutral'}
                    label={status.isSuccess ? t('home.online') : t('home.loading')}
                />
            </Section>
        </PageLayout>
    );
}
