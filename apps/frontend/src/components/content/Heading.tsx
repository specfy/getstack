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
      className="flex items-center gap-5 text-xl h-10 mt-20 no-underline"
      id={tech}
      href={`#${tech}`}
    >
      <span className="text-gray-400 font-bold text-3xl">#{position}</span>
      <div className="flex items-center gap-2">
        <div className="flex w-7 h-7 rounded overflow-hidden items-center justify-center">
          <img src={`/favicons/${tech}.webp`} className="h-full w-full" alt={children as string} />
        </div>
        <h2 className="leading-10 mt-0 mb-0">{children}</h2>
      </div>
    </a>
  );
};
