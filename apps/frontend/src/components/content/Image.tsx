export const Image = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} className={'rounded-md border border-gray-200'} />;
};
