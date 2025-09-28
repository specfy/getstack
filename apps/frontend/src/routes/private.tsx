import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/private')({
  loader: () => {
    return redirect({ to: '/analyze-repository' });
  },
});
