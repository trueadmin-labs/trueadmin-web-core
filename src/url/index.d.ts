export declare const stringifyRawSearchParams: (params: URLSearchParams) => string;

export declare const updateRawSearchParams: (
  current: URLSearchParams,
  updater: (params: URLSearchParams) => void,
) => string;
