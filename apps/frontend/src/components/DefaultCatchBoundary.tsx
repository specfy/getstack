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
    // The error might be in error.error or error itself
    const actualError = error.error || (error as unknown as Error);

    // Capture error in Sentry
    if (actualError instanceof Error) {
      Sentry.captureException(actualError, {
        tags: {
          errorBoundary: 'DefaultCatchBoundary',
        },
        extra: {
          errorInfo: error.info,
          errorObject: error,
        },
      });
    }
    console.error('DefaultCatchBoundary Error:', {
      error: actualError,
      message: actualError instanceof Error ? actualError.message : String(actualError),
      stack: actualError instanceof Error ? actualError.stack : undefined,
      info: error.info,
      fullError: error,
      errorKeys: Object.keys(error),
    });
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
