export const Image = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="border border-gray-200 p-1 rounded-md mt-8 mb-8">
      <img src={src} alt={alt} className={'rounded-md h-full mt-0 mb-0'} />
    </div>
  );
};
