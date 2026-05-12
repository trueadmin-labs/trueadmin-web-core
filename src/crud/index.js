export const serializeCrudParams = (params = {}) => {
  assertCrudListParams(params);

  const search = new URLSearchParams();

  appendParamValue(search, 'page', params.page);
  appendParamValue(search, 'pageSize', params.pageSize);
  appendParamValue(search, 'keyword', params.keyword);

  if (Array.isArray(params.filters)) {
    params.filters.forEach((filter, index) => appendFilter(search, index, filter));
  }

  if (Array.isArray(params.sorts)) {
    params.sorts.forEach((sort, index) => appendSort(search, index, sort));
  }

  if (isPlainObject(params.params)) {
    appendNestedParams(search, 'params', params.params);
  }

  return search;
};

export const toCrudRequestParams = (params) => serializeCrudParams(params).toString();

export const crudRequestOptions = (params) => {
  const query = toCrudRequestParams(params);
  return query ? { params: query } : undefined;
};

const isEmptyParamValue = (value) => value === undefined || value === null || value === '';

const isPlainObject = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));

const isEmptyArray = (value) => Array.isArray(value) && value.every(isEmptyParamValue);

const shouldSkipParamValue = (value) => isEmptyParamValue(value) || isEmptyArray(value);

const CRUD_LIST_PARAM_KEYS = new Set(['page', 'pageSize', 'keyword', 'filters', 'sorts', 'params']);

const assertCrudListParams = (params) => {
  if (!isPlainObject(params)) {
    throw new TypeError('CRUD request params must be a plain object.');
  }

  for (const key of Object.keys(params)) {
    if (!CRUD_LIST_PARAM_KEYS.has(key)) {
      throw new TypeError(`Unsupported CRUD request param "${key}".`);
    }
  }
};

const appendParamValue = (search, key, value) => {
  if (shouldSkipParamValue(value)) {
    return;
  }

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
  if (!isPlainObject(value)) {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (shouldSkipParamValue(nestedValue)) {
      continue;
    }

    appendParamValue(search, `${prefix}[${key}]`, nestedValue);
  }
};

const appendFilter = (search, index, filter) => {
  if (!isPlainObject(filter) || isEmptyParamValue(filter.field) || isEmptyParamValue(filter.op)) {
    return;
  }

  const prefix = `filters[${index}]`;
  appendParamValue(search, `${prefix}[field]`, filter.field);
  appendParamValue(search, `${prefix}[op]`, filter.op);
  appendParamValue(search, `${prefix}[value]`, filter.value);
};

const appendSort = (search, index, sort) => {
  if (!isPlainObject(sort) || isEmptyParamValue(sort.field) || isEmptyParamValue(sort.order)) {
    return;
  }

  const prefix = `sorts[${index}]`;
  appendParamValue(search, `${prefix}[field]`, sort.field);
  appendParamValue(search, `${prefix}[order]`, sort.order);
  appendParamValue(search, `${prefix}[nulls]`, sort.nulls);
};
