export const stringifyRawSearchParams = (params) =>
  Array.from(params.entries())
    .filter(([key]) => key.length > 0)
    .map(([key, value]) => (value.length > 0 ? `${key}=${value}` : key))
    .join('&');

export const updateRawSearchParams = (current, updater) => {
  const next = new URLSearchParams(current);
  updater(next);
  return stringifyRawSearchParams(next);
};
