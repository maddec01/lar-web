import { expect, it } from 'vite-plus/test';

import { progressStateStatus, statusStateProgress } from './StatusState';

it('maps status and progress states through the shared inverse maps', () => {
    for (const [progress, status] of Object.entries(progressStateStatus))
        expect(statusStateProgress[status]).toBe(progress);
});
