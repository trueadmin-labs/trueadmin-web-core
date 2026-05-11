export const serializeCrudParams = (params = {}) => {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (key === 'filter' || key === 'op') {
      appendNestedParams(search, key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        search.append(key, String(item));
      }
      continue;
    }

    search.set(key, String(value));
  }

  return search;
};

const appendNestedParams = (search, prefix, value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (nestedValue === undefined || nestedValue === null || nestedValue === '') {
      continue;
    }

    const param = `${prefix}[${key}]`;
    if (Array.isArray(nestedValue)) {
      for (const item of nestedValue) {
        search.append(param, String(item));
      }
      continue;
    }

    search.set(param, String(nestedValue));
  }
};
