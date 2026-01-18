/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as Sentry from '@sentry/react';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
// eslint-disable-next-line import-x/default
import React from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import indexCss from '@/index.css?url';
import { API_URL, APP_URL } from '@/lib/envs';
import { seo } from '@/lib/seo';

import type { QueryClient } from '@tanstack/react-query';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => {
    return {
      meta: [
        {
          charSet: 'utf8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        { itemProp: 'image', content: `${APP_URL}/screenshot.jpg` },
        ...seo({
          title: 'getStack - Technology Trends',
          description: `Explore the most popular technologies and repositories, refreshed every week from GitHub`,
          url: `${APP_URL}/`,
        }),
      ],
      links: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'preconnect', href: API_URL },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Space+Grotesk:wght@300..700&display=swap',
        },
        { rel: 'stylesheet', href: indexCss },
        { rel: 'icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      ],
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />} showDialog>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
}

function ErrorFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mb-4 text-gray-600">
          We've been notified and are working on fixing this issue.
        </p>
        <button
          onClick={() => globalThis.location.reload()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Plausible Analytics */}
        <script
          defer
          data-domain="getstack.dev"
          src="https://plausible.getstack.dev/js/script.outbound-links.pageview-props.tagged-events.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
          }}
        />
        <HeadContent />
      </head>
      <body className="bg-white">
        <Providers>
          <div className="flex min-h-screen justify-center bg-white">
            <div className="flex w-full flex-col bg-white">
              <Header />

              <div className="h-full min-h-[calc(100vh-150px)] bg-white">{children}</div>

              <Footer />
            </div>
          </div>
        </Providers>

        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
