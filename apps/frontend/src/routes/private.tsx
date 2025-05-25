import { createFileRoute } from '@tanstack/react-router';

import { Newsletter } from '@/components/Newsletter';
import { APP_URL, seo } from '@/lib/seo';

const RouteComponent: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full text-center">
      <h1 className="text-4xl font-bold font-serif">Analyzing your private repo</h1>
      <p className="text-lg mt-2 font-serif">Coming Soon, stay tuned!</p>
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
