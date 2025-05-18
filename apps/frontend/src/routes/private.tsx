import { createFileRoute } from '@tanstack/react-router';

import { Newsletter } from '@/components/Newsletter';

export const Route = createFileRoute('/private')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col justify-center items-center h-full text-center">
      <h1 className="text-4xl font-bold">Coming Soon</h1>
      <p className="text-lg mt-4">We're working hard to bring this feature to you. Stay tuned!</p>
      <div className="mt-18">
        <Newsletter title="Subscribe to receive an update" />
      </div>
    </div>
  );
}
