export const serializeCrudParams = (params = {}) => {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (isEmptyParamValue(value)) {
      continue;
    }

    if (key === 'filter' || key === 'op') {
      appendNestedParams(search, key, value);
      continue;
    }

    appendParamValue(search, key, value);
  }

  return search;
};

const isEmptyParamValue = (value) => value === undefined || value === null || value === '';

const appendParamValue = (search, key, value) => {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isEmptyParamValue(item)) {
        search.append(`${key}[]`, String(item));
      }
    }
    return;
  }

  search.set(key, String(value));
};

const appendNestedParams = (search, prefix, value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (isEmptyParamValue(nestedValue)) {
      continue;
    }

    appendParamValue(search, `${prefix}[${key}]`, nestedValue);
  }
};
