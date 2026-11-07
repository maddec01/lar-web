import { useQuery } from '@tanstack/react-query';

import { fetchStatus } from './status.service';

export function useStatus() {
    return useQuery({ queryKey: ['status'], queryFn: fetchStatus });
}
