export const HTop = ({
  children,
  position,
  tech,
}: {
  children: React.ReactNode;
  position: number;
  tech: string;
}) => {
  return (
    <a
      className="mt-20 flex h-10 items-center gap-5 text-xl no-underline"
      id={tech}
      href={`#${tech}`}
    >
      <span className="text-3xl font-bold text-gray-400">#{position}</span>
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center overflow-hidden rounded">
          <img
            src={`/favicons/${tech}.webp`}
            className="size-full"
            alt={children as string}
            width={28}
            height={28}
          />
        </div>
        <h2 className="my-0 leading-10">{children}</h2>
      </div>
    </a>
  );
};
