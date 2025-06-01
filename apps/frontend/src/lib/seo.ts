export const seo = ({
  title,
  description,
  image,
  url,
}: {
  title: string;
  url: string;
  description: string;
  image?: string;
}) => {
  const tags = [
    { title },
    { name: 'description', content: description },

    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:creator', content: '@samdotb' },
    { name: 'twitter:site', content: '@samdotb' },
    { name: 'twitter:url', content: url },
    { name: 'twitter:card', content: 'summary_large_image' },

    { name: 'og:type', content: 'website' },
    { name: 'og:title', content: title },
    { name: 'og:url', content: url },
    { name: 'og:description', content: description },
    ...(image
      ? [
          { name: 'twitter:image', content: image },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'og:image', content: image },
        ]
      : []),
  ];

  return tags;
};
