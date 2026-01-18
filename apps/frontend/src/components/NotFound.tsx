import { Link } from '@tanstack/react-router';

import { Button } from './ui/button';

export const NotFound: React.FC = () => {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Page Not Found</h1>
        <p className="text-gray-700">We're sorry, but this page could not be found.</p>

        <Button className="cursor-pointer" asChild>
          <Link to={'/'} className="mt-4">
            Go back to homepage
          </Link>
        </Button>
      </div>
    </div>
  );
};
