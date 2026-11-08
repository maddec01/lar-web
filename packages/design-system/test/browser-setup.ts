import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vite-plus/test';

import { resetDesignSystem } from '../src/testing';

// Deterministic end states without replacing browser layout, focus, observers or computed styles.
const motion = document.createElement('style');

motion.textContent = '* { animation: none !important; transition: none !important; }';
document.head.append(motion);

afterEach(() => {
    cleanup();
    resetDesignSystem();
    document.documentElement.classList.remove('light', 'dark');
});
