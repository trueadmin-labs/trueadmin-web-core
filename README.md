# TrueAdmin Web Core

Framework-neutral web protocol utilities and types for TrueAdmin.

This package provides stable web framework helpers and protocol types for TrueAdmin.
Endpoint-specific runtime config still belongs to each application; this package only carries reusable framework behavior.

## Exports

- `@trueadmin/web-core/crud`
- `@trueadmin/web-core/download`
- `@trueadmin/web-core/error`
- `@trueadmin/web-core/http`
- `@trueadmin/web-core/i18n`
- `@trueadmin/web-core/plugin`
- `@trueadmin/web-core/module`
- `@trueadmin/web-core/url`

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
