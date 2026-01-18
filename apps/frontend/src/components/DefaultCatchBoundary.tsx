import * as Sentry from '@sentry/react';
import { ErrorComponent, Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router';
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
    // eslint-disable-next-line no-console
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
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            void router.invalidate();
          }}
          className={`rounded bg-gray-600 px-2 py-1 font-extrabold uppercase text-white dark:bg-gray-700`}
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className={`rounded bg-gray-600 px-2 py-1 font-extrabold uppercase text-white dark:bg-gray-700`}
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={`rounded bg-gray-600 px-2 py-1 font-extrabold uppercase text-white dark:bg-gray-700`}
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
