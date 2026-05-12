export type { PageResult } from '../http/index.js';

export type CrudOrder = 'asc' | 'desc';

export type CrudOperator = '=' | '<>' | '>' | '>=' | '<' | '<=' | 'like' | 'in' | 'between';

export type CrudScalar = string | number | boolean;

export type CrudFilterValue = CrudScalar | CrudScalar[];

export type CrudListParams = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: CrudOrder;
  filter?: Record<string, CrudFilterValue | undefined>;
  op?: Record<string, CrudOperator | undefined>;
  [key: string]: unknown;
};

export declare const serializeCrudParams: (params?: CrudListParams) => URLSearchParams;
