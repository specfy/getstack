import { createFileRoute } from '@tanstack/react-router';

import { Newsletter } from '@/components/Newsletter';

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
  component: RouteComponent,
});
