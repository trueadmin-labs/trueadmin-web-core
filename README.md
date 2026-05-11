# TrueAdmin Web Core

Framework-neutral web protocol utilities and types for TrueAdmin.

This package intentionally starts small. It reserves the public npm package and provides stable protocol helpers that do not depend on React, Ant Design, Vite, or a specific application runtime.

## Exports

- `@trueadmin/web-core/crud`
- `@trueadmin/web-core/plugin`
- `@trueadmin/web-core/module`

## CRUD Query Protocol

`@trueadmin/web-core/crud` exports the shared list-query types and `serializeCrudParams`.

```js
import { serializeCrudParams } from '@trueadmin/web-core/crud';

const query = serializeCrudParams({
  page: 1,
  pageSize: 20,
  keyword: 'admin',
  filter: {
    status: 'enabled',
    id: [1, 2],
  },
  op: {
    status: '=',
    id: 'in',
  },
  sort: 'created_at',
  order: 'desc',
});

query.toString();
// page=1&pageSize=20&keyword=admin&filter%5Bstatus%5D=enabled&filter%5Bid%5D%5B%5D=1&filter%5Bid%5D%5B%5D=2&op%5Bstatus%5D=%3D&op%5Bid%5D=in&sort=created_at&order=desc
```
