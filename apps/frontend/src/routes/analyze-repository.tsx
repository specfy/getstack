/* eslint-disable @typescript-eslint/no-misused-promises */
import { IconLoader2 } from '@tabler/icons-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { useAnalyzeRepository } from '@/api/useRepository';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_URL } from '@/lib/envs';
import { seo } from '@/lib/seo';

const highlights: { type: 'repo'; org: string; name: string }[] = [
  { type: 'repo', org: 'n8n-io', name: 'n8n' },
  { type: 'repo', org: 'NangoHQ', name: 'nango' },
  { type: 'repo', org: 'mendableai', name: 'firecrawl' },
];

const RouteComponent: React.FC = () => {
  const [repo, setRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const { data, mutateAsync: analyzeRepository } = useAnalyzeRepository();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isUrl = new URL(repo);
      if (isUrl.origin !== 'https://github.com') {
        setLoading(false);
        setError('Please enter a valid repository URL, like https://github.com/specfy/getstack');
        return;
      }

      const [org, name] = isUrl.pathname.slice(1).split('/');
      if (!org || !name) {
        setLoading(false);
        setError('Please enter a valid repository URL, like https://github.com/specfy/getstack');
        return;
      }

      setError(null);
      await analyzeRepository({ org, name });
    } catch {
      setError('An error occurred');
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full text-center">
      <h1 className="text-4xl font-bold font-serif">Analyzing any GitHub repository</h1>
      <p className="text-lg mt-2 font-serif">
        Get the full tech stack of any GitHub repository in one click
      </p>
      <div className="mt-18 w-1/2">
        <div className="flex gap-2">
          <Input
            placeholder="https://github.com/owner/repo"
            className="h-12 w-1/4"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            disabled={loading}
          />
          <Button
            size={'lg'}
            className="text-lg h-12"
            type="submit"
            disabled={loading || !repo}
            onClick={() => handleSubmit()}
          >
            {loading ? <IconLoader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
          </Button>
        </div>
        {error && <div className="text-sm text-red-500 mt-2 font-serif">{error}</div>}
        <div className="text-sm text-gray-500 mt-2 flex gap-1 justify-center items-center">
          <div className="text-gray-600 font-serif text-sm mr-2">or try</div>
          {highlights.map((item) => {
            return (
              <Button
                key={item.org + item.name}
                variant={'ghost'}
                size={'sm'}
                className="opacity-50 grayscale-100 hover:grayscale-0 focus:grayscale-100 hover:opacity-100 focus:opacity-100 transition-all"
                asChild
              >
                <Link to={`/$org/$name`} params={{ org: item.org, name: item.name }}>
                  <div className={'w-4'}>
                    <img
                      src={`/favicons/${item.name.toLowerCase()}.webp`}
                      className="rounded-xs overflow-hidden"
                      alt={`${item.name} logo`}
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="truncate text-ellipsis">{item.name}</div>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/analyze-repository')({
  head: () => {
    const url = `${APP_URL}/analyze-repository`;
    return {
      meta: [
        ...seo({
          title: `Analyze your repository - getStack`,
          description: `Analyze any GitHub repository and get its full tech stack in one click`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: RouteComponent,
});
