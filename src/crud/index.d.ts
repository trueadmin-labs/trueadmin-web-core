export type CrudOrder = 'asc' | 'desc';

export type CrudScalar = string | number | boolean;

export type CrudFilterValue = CrudScalar | CrudScalar[];

export type CrudListParams = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: CrudOrder;
  filter?: Record<string, CrudFilterValue | undefined>;
  op?: Record<string, string | undefined>;
  [key: string]: unknown;
};

export type PageResult<TItem> = {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
};

export declare const serializeCrudParams: (params?: CrudListParams) => URLSearchParams;
