import englishCatalog from '../../../locales/en.json';
import type { SupportedLocale } from '@/shared/localization/Locale';

type LeafKey<T, Prefix extends string = ''> = T extends string
    ? Prefix
    : {
          [Key in keyof T & string]: LeafKey<T[Key], Prefix extends '' ? Key : `${Prefix}.${Key}`>;
      }[keyof T & string];

export type AppTranslationKey = LeafKey<typeof englishCatalog.web>;

export const catalogs: Record<SupportedLocale, typeof englishCatalog> = {
    en: englishCatalog,
};
