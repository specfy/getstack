import { createFileRoute } from '@tanstack/react-router';

import { Newsletter } from '@/components/Newsletter';
import { APP_URL } from '@/lib/envs';
import { seo } from '@/lib/seo';

const RouteComponent: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h1 className="font-serif text-4xl font-bold">Analyzing your private repo</h1>
      <p className="mt-2 font-serif text-lg">Coming Soon, stay tuned!</p>
      <div className="mt-18">
        <Newsletter title="Subscribe to receive an update" />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/private')({
  head: () => {
    const url = `${APP_URL}/private`;
    return {
      meta: [
        ...seo({
          title: `Analyze your repository - getStack`,
          description: `Get the tech stack of any GitHub repository`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: RouteComponent,
});
