import { QueryClient } from '@tanstack/react-query';

import { ApiResError } from '@/api/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 15 * 60 * 1000,
      retry: (failure, err) => {
        if (failure >= 3) {
          return false;
        }

        if (err instanceof ApiResError && err.json.status > 500) {
          return true;
        }
        return false;
      },
    },
  },
});
