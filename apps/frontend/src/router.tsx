// import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';

import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';
import { queryClient } from './lib/query';
import { routeTree } from './routeTree.gen';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnMount: false,
//       refetchOnWindowFocus: false,
//       staleTime: 15 * 60 * 1000,
//       retry: (failure, err) => {
//         if (failure >= 3) {
//           return false;
//         }

//         if (err instanceof ApiResError && err.json.status > 500) {
//           return true;
//         }
//         return false;
//       },
//     },
//   },
// });

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: 'intent',
      // @ts-expect-error yes I know
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFound />,
      scrollRestoration: true,
    }),
    queryClient
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
