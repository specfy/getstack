import { APP_URL } from './envs';

import type { AnyRouteMatch } from '@tanstack/react-router';

export const seo = ({
  title,
  description,
  image,
  url,
}: {
  title: string;
  url: string;
  description: string;
  image?: string;
}): AnyRouteMatch['meta'] => {
  const imageEnd = image || `${APP_URL}/screenshot.jpg`;
  const tags = [
    { title },
    { name: 'description', content: description },

    { name: 'og:type', content: 'website' },
    { name: 'og:title', content: title },
    { name: 'og:url', content: url },
    { name: 'og:description', content: description },
    { name: 'og:image', content: imageEnd },

    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:creator', content: '@samdotb' },
    { name: 'twitter:site', content: '@samdotb' },
    { name: 'twitter:url', content: url },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: imageEnd },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];

  return tags;
};
