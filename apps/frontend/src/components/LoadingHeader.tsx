import { Skeleton } from './ui/skeleton';

export const LoadingHeader: React.FC = () => {
  return (
    <div>
      <header className="mt-10 flex justify-between gap-2">
        <h2 className="flex items-center gap-4">
          <div className="size-14 rounded-md border bg-neutral-100 p-1">
            <Skeleton className="size-full" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2 w-10" />
            <div className="text-2xl font-semibold leading-6">
              <Skeleton className="w-50 h-10 max-w-2xl" />
            </div>
          </div>
        </h2>
      </header>
      <Skeleton className="mt-4 h-10 w-full" />
      <div className="mt-10 grid grid-cols-1 gap-y-4 md:grid-cols-4 md:gap-4">
        <Skeleton className="h-20 w-full " />
        <Skeleton className="h-20 w-full " />
      </div>
    </div>
  );
};
