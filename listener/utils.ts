export const isValidUrl = (url: string) => {
  const regexp = new RegExp("^https?://.*$");
  return regexp.test(url);
};
