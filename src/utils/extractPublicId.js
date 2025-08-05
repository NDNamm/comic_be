export const extractPublicId = (url) => {
  if (!url) return null;
  const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z]+$/;
  const match = url.match(regex);

  return match ? match[1] : null;
};