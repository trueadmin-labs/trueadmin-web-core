import assert from 'node:assert/strict';
import test from 'node:test';
import { serializeCrudParams } from '../src/crud/index.js';

const entries = (params) => Array.from(serializeCrudParams(params).entries());

test('serializes empty crud params', () => {
  assert.deepEqual(entries(), []);
});

test('serializes pagination, keyword, and sort params', () => {
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
});

test('serializes filter and operator params', () => {
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
});

test('serializes booleans and skips empty array items', () => {
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
});
