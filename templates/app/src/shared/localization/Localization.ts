import i18next, { type i18n } from 'i18next';

import { catalogs } from '@/shared/localization/Catalogs';
import { DEFAULT_LOCALE, supportedLocales } from '@/shared/localization/Locale';

export async function createAppLocalization(): Promise<i18n> {
    const instance = i18next.createInstance();

    await instance.init({
        fallbackLng: DEFAULT_LOCALE,
        interpolation: { escapeValue: false },
        lng: DEFAULT_LOCALE,
        resources: Object.fromEntries(
            supportedLocales.map((locale) => [locale, { translation: catalogs[locale].web }]),
        ),
        returnNull: false,
        supportedLngs: supportedLocales,
    });

    document.documentElement.lang = DEFAULT_LOCALE;
    document.documentElement.dir = catalogs[DEFAULT_LOCALE].direction;

    return instance;
}
