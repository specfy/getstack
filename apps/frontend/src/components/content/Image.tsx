export const Image = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="my-8 rounded-md border border-gray-200 p-1">
      <img src={src} alt={alt} className={'my-0 rounded-md'} />
    </div>
  );
};
