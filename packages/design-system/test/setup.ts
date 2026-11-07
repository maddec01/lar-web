import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vite-plus/test';

import { installDomStubs, resetDesignSystem } from '../src/testing';

installDomStubs();

afterEach(() => {
    cleanup();
    resetDesignSystem();
});
