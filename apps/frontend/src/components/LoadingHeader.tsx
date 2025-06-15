import { Skeleton } from './ui/skeleton';

export const LoadingHeader: React.FC = () => {
  return (
    <div>
      <header className="flex gap-2 justify-between mt-10">
        <h2 className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-neutral-100 rounded-md p-1 border">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2 w-10" />
            <div className="text-2xl font-semibold leading-6">
              <Skeleton className="h-10 w-50 max-w-2xl" />
            </div>
          </div>
        </h2>
      </header>
      <Skeleton className="h-10 w-full mt-4" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-4 mt-10">
        <Skeleton className="h-20 w-full " />
        <Skeleton className="h-20 w-full " />
      </div>
    </div>
  );
};
