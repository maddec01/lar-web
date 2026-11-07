export const supportedLocales = ['en'] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';
