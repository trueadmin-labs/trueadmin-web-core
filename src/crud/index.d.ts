export type { PageResult } from '../http/index.js';

export type CrudSortOrder = 'asc' | 'desc';

export type CrudOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'in'
  | 'between'
  | 'is_null'
  | 'not_null';

export type CrudScalar = string | number | boolean;

export type CrudFilterValue = CrudScalar | CrudScalar[];

export type CrudFilterCondition = {
  field: string;
  op: CrudOperator;
  value?: CrudFilterValue;
};

export type CrudSortRule = {
  field: string;
  order: CrudSortOrder;
  nulls?: 'first' | 'last';
};

export type CrudListParams = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  filters?: CrudFilterCondition[];
  sorts?: CrudSortRule[];
  params?: Record<string, CrudFilterValue | undefined>;
};

export type CrudRequestOptions = {
  params: string;
};

export declare const serializeCrudParams: (params?: CrudListParams) => URLSearchParams;

export declare const toCrudRequestParams: (params?: CrudListParams) => string;

export declare const crudRequestOptions: (
  params?: CrudListParams,
) => CrudRequestOptions | undefined;
