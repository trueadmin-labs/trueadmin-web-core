export type ApiEnvelope<T> = {
  code: string;
  message: string;
  data: T;
};

export type PageResult<TItem, TMeta = Record<string, unknown>> = {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
  meta?: TMeta;
};
