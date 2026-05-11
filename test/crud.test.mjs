import assert from 'node:assert/strict';
import { serializeCrudParams } from '../src/crud/index.js';

const entries = (params) => Array.from(serializeCrudParams(params).entries());

assert.deepEqual(entries(), []);

assert.deepEqual(
  entries({
    page: 1,
    pageSize: 20,
    keyword: 'admin',
    sort: 'created_at',
    order: 'desc',
  }),
  [
    ['page', '1'],
    ['pageSize', '20'],
    ['keyword', 'admin'],
    ['sort', 'created_at'],
    ['order', 'desc'],
  ],
);

assert.deepEqual(
  entries({
    filter: {
      status: 'enabled',
      id: [1, 2],
      empty: '',
      nil: null,
    },
    op: {
      status: '=',
      id: 'in',
      empty: undefined,
    },
  }),
  [
    ['filter[status]', 'enabled'],
    ['filter[id][]', '1'],
    ['filter[id][]', '2'],
    ['op[status]', '='],
    ['op[id]', 'in'],
  ],
);

assert.deepEqual(
  entries({
    enabled: true,
    ids: [1, undefined, 2, null, ''],
  }),
  [
    ['enabled', 'true'],
    ['ids[]', '1'],
    ['ids[]', '2'],
  ],
);
