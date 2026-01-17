import * as Sentry from '@sentry/react';
import { ErrorComponent, Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router';
// eslint-disable-next-line import-x/default
import { useEffect } from 'react';

import type { ErrorComponentProps } from '@tanstack/react-router';

export const DefaultCatchBoundary: React.FC<{ error: ErrorComponentProps }> = ({ error }) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  useEffect(() => {
    // Capture error in Sentry
    if (error.error) {
      Sentry.captureException(error.error, {
        tags: {
          errorBoundary: 'DefaultCatchBoundary',
        },
      });
    }
    console.error('DefaultCatchBoundary Error:', error);
  }, [error]);

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => {
            void router.invalidate();
          }}
          className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`}
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`}
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`}
            onClick={(e) => {
              e.preventDefault();
              globalThis.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
};
