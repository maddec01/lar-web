import '@testing-library/jest-dom/vitest';

import { installDomStubs, resetDesignSystem } from '@lar-works/design-system/testing';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vite-plus/test';

installDomStubs();

afterEach(() => {
    cleanup();
    resetDesignSystem();
    window.localStorage.clear();
});
