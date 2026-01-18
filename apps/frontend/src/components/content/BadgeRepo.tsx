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
      className="inline-flex gap-1 rounded-md border px-[4px] py-px text-sm !text-gray-800 no-underline"
      to={'/$org/$name'}
      params={{ org, name }}
    >
      <div className="flex size-5 shrink-0 items-center justify-center bg-gray-50">
        <img
          src={avatar_url}
          className="size-4 overflow-hidden rounded-sm"
          alt={`${org} logo`}
          width={16}
          height={16}
        />
      </div>
      <div className="flex leading-5">
        <div className="text-gray-800">{org}/</div>
        <div className="">{name}</div>
      </div>
    </Link>
  );
};
