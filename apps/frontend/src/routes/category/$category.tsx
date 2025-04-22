import { createFileRoute } from '@tanstack/react-router';

const Category: React.FC = () => {
  return <div className="p-2">Hello from Category!</div>;
};

export const Route = createFileRoute('/category/$category')({
  component: Category,
});
