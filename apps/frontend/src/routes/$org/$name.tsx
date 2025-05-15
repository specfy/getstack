import { createFileRoute } from '@tanstack/react-router';

const Repo: React.FC = () => {
  const { org, name } = Route.useParams();
  return (
    <div>
      Hello {org}/{name}
    </div>
  );
};

export const Route = createFileRoute('/$org/$name')({
  component: Repo,
});
