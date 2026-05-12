export type TrueAdminDownloadOptions = {
  url: string;
  filename?: string;
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
  forceFetch?: boolean;
  revokeDelay?: number;
};

export type TrueAdminDownloadInput = string | TrueAdminDownloadOptions;

export declare function downloadFile(
  input: TrueAdminDownloadInput,
  options?: Omit<TrueAdminDownloadOptions, 'url'>,
): Promise<void>;
