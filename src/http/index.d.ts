export type ApiEnvelope<T> = {
  code: string | number;
  message: string;
  data: T;
  success?: boolean;
};

export type PageResult<TItem, TMeta = Record<string, unknown>> = {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
  meta?: TMeta;
};
