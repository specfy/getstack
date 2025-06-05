import { Button } from './ui/button';

export const Report: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="text-xs text-gray-600">Missing something?</div>
      <div>
        <a href="https://github.com/specfy/stack-analyser/issues?utm_source=getstack.dev">
          <Button variant={'outline'} size={'xs'} className="text-gray-600">
            Report a bug
          </Button>
        </a>
      </div>
    </div>
  );
};
