export const trans = (key, fallback) => ({
  __trans: true,
  key,
  fallback,
});

export const isTransText = (value) =>
  typeof value === 'object' && value !== null && '__trans' in value && value.__trans === true;

export const resolveTrans = (value, translate, fallback = '') => {
  if (isTransText(value)) {
    return translate(value.key, value.fallback ?? fallback);
  }

  return value ?? fallback;
};

export const resolveRenderableTrans = (value, context, translate, fallback = '') => {
  if (typeof value === 'function') {
    return value(context);
  }

  return resolveTrans(value, translate, fallback);
};
