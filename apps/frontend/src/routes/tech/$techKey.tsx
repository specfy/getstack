import { createFileRoute } from '@tanstack/react-router';

import { listIndexed } from '@/lib/stack';

import type { AllowedKeys } from '@specfy/stack-analyser';

const Tech: React.FC = () => {
  const { techKey } = Route.useParams();

  const tech = listIndexed[techKey as AllowedKeys];

  if (!tech) {
    return (
      <div>
        <h2 className="text-2xl">Not found</h2>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10 flex flex-col gap-2">
        <h2 className="flex gap-4 ">
          <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border">
            <img src={`/favicons/${tech.key}.webp`} />
          </div>{' '}
          <div>
            <div className="text-xs text-gray-400">Technology</div>
            <div className="text-2xl font-semibold">{tech.name}</div>
          </div>
        </h2>
      </header>
    </div>
  );
};

export const Route = createFileRoute('/tech/$techKey')({
  component: Tech,
});
