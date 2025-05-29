import { createFileRoute } from '@tanstack/react-router';

import { APP_URL, seo } from '@/lib/seo';

const Licenses: React.FC = () => {
  return <div>Hello from licenses</div>;
};

export const Route = createFileRoute('/licenses/')({
  head: () => {
    const url = `${APP_URL}/licenses`;
    return {
      meta: [
        ...seo({
          title: `Licenses usage and trends - getStack`,
          description: `Discover the most popular licenses in the Open-Source world. Extracted from the most popular GitHub repositories every week`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: Licenses,
});
