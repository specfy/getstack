import { Link } from '@tanstack/react-router';

export const BadgeRepo: React.FC<{ avatar_url: string; name: string; org: string }> = ({
  avatar_url,
  name,
  org,
}: {
  avatar_url: string;
  name: string;
  org: string;
}) => {
  return (
    <Link
      className="inline-flex gap-1 border rounded-md px-[4px] py-[1px] text-sm !text-gray-800 no-underline"
      to={'/$org/$name'}
      params={{ org, name }}
    >
      <div className="bg-gray-50 w-5 h-5 flex items-center justify-center shrink-0">
        <img src={avatar_url} className="w-4 h-4 rounded-sm overflow-hidden" />
      </div>
      <div className="flex leading-5">
        <div className="text-gray-800">{org}/</div>
        <div className="">{name}</div>
      </div>
    </Link>
  );
};
