/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { QueryClientProvider } from '@tanstack/react-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
// eslint-disable-next-line import-x/default
import React from 'react';

import { API_URL } from '@/api/api';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import indexCss from '@/index.css?url';
import { queryClient } from '@/lib/query';
import { APP_URL, seo } from '@/lib/seo';

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
          title: 'getStack - Open Source Tech Trends',
          description: `Explore the most popular technologies and repositories, refreshed every week from GitHub`,
          url: `${APP_URL}/`,
        }),
      ],
      links: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'preconnect', href: API_URL },
        { rel: 'canonical', href: APP_URL },
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
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`}
        ></script>
        {import.meta.env.VITE_GA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${import.meta.env.VITE_GA_ID}');
            `,
            }}
          />
        )}
        <HeadContent />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen flex justify-center">
            <div className="flex flex-col w-full max-w-screen-lg">
              <Header />

              <div className="h-full px-4">{children}</div>

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
