import { createContext } from 'react';

/** Surface-level default; explicit size="md" still opts into a page-sized alert. */
export const CompactAlertContext = createContext(false);
