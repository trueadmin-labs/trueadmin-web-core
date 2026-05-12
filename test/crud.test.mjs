import assert from 'node:assert/strict';
import test from 'node:test';
import { serializeCrudParams } from '../src/crud/index.js';

const entries = (params) => Array.from(serializeCrudParams(params).entries());

test('serializes empty crud params', () => {
  assert.deepEqual(entries(), []);
});

test('serializes pagination, keyword, and multi-sort params', () => {
  assert.deepEqual(
    entries({
      page: 1,
      pageSize: 20,
      keyword: 'admin',
      sorts: [
        { field: 'created_at', order: 'desc', nulls: 'last' },
        { field: 'id', order: 'asc' },
      ],
    }),
    [
      ['page', '1'],
      ['pageSize', '20'],
      ['keyword', 'admin'],
      ['sorts[0][field]', 'created_at'],
      ['sorts[0][order]', 'desc'],
      ['sorts[0][nulls]', 'last'],
      ['sorts[1][field]', 'id'],
      ['sorts[1][order]', 'asc'],
    ],
  );
});

test('serializes filter condition params', () => {
  assert.deepEqual(
    entries({
      filters: [
        { field: 'status', op: 'eq', value: 'enabled' },
        { field: 'id', op: 'in', value: [1, 2] },
        { field: 'archived_at', op: 'is_null' },
        { field: '', op: 'eq', value: 'ignored' },
      ],
    }),
    [
      ['filters[0][field]', 'status'],
      ['filters[0][op]', 'eq'],
      ['filters[0][value]', 'enabled'],
      ['filters[1][field]', 'id'],
      ['filters[1][op]', 'in'],
      ['filters[1][value][]', '1'],
      ['filters[1][value][]', '2'],
      ['filters[2][field]', 'archived_at'],
      ['filters[2][op]', 'is_null'],
    ],
  );
});

test('serializes namespaced params and skips empty array items', () => {
  assert.deepEqual(
    entries({
      params: {
        enabled: true,
        ids: [1, undefined, 2, null, ''],
      },
    }),
    [
      ['params[enabled]', 'true'],
      ['params[ids][]', '1'],
      ['params[ids][]', '2'],
    ],
  );
});

test('rejects legacy flat crud params', () => {
  assert.throws(
    () => serializeCrudParams({ filter: { name: 'admin' } }),
    /Unsupported CRUD request param "filter"/,
  );
});
