import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { APP_URL } from '@/lib/envs';
import { seo } from '@/lib/seo';

const About: React.FC = () => {
  return (
    <div className="md:w-2/3 prose mt-10">
      <h2 className="text-3xl font-semibold mb-2 font-serif">About</h2>
      <p>
        getStack is a powerful tool that provides comprehensive, and trending insights into the open
        source world by analyzing <strong className="font-semibold">+20K open repositories</strong>{' '}
        from GitHub.
      </p>
      <h3 className="font-serif">Which technologies are tracked?</h3>
      <p>
        This website is powered by{' '}
        <a
          href="https://github.com/specfy/stack-analyser"
          target="_blank"
          className="font-semibold underline"
        >
          @specfy/stack-analyzer
        </a>
        , an open-source library that parse any git repository and detects technologies from
        dependencies, files, folders and lockfile. We have a list of more than{' '}
        <strong>+600 technologies and native support for a dozen of languages</strong>. The list is
        manually crafted and you can contribute.
      </p>
      <h3 className="font-serif">Which repositories are tracked?</h3>
      <p>Each week we parse all the repositories following this set of conditions:</p>
      <ol>
        <li>No private repos, no templates, no forks, and not archived.</li>
        <li>
          Have more than <strong>+1500 stars</strong>
        </li>
        <li>Active in the last 2 years</li>
        <li>Less than 1Gb in disk size </li>
        <li>
          Passes basic name filtering (e.g: awesome, templates, examples, boilerplate, tutorials,
          etc.)
        </li>
      </ol>
      <h3 className="font-serif">I don't see [well-known] in the list</h3>
      <p>
        Since we can only parse open-source repository some technologies never makes the cut (e.g:
        infrastructure, security, some databases, etc.). However sometimes we just don't have a
        configuration for the technology you are looking for. If that's so, you can make a feature
        request or a pull request directly in our GitHub repository.
      </p>
      <div className="flex gap-2">
        <Button variant={'outline'} asChild>
          <a href="https://github.com/specfy/getstack" target="_blank" className="no-underline">
            <img src={`/favicons/github.webp`} className="w-5 h-5" />
            @specfy/getstack
          </a>
        </Button>
        <Button variant={'outline'} asChild>
          <a
            href="https://github.com/specfy/stack-analyser"
            target="_blank"
            className="no-underline"
          >
            <img src={`/favicons/github.webp`} className="w-5 h-5" />
            @specfy/stack-analyzer
          </a>
        </Button>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/about')({
  head: () => {
    const url = `${APP_URL}/about`;
    return {
      meta: [
        ...seo({
          title: `About - getStack`,
          description: `About getstack.dev`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: About,
});
