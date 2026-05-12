# TrueAdmin Web Core

Framework-neutral web protocol utilities and types for TrueAdmin.

This package provides stable web framework helpers and protocol types for TrueAdmin.
Endpoint-specific runtime config still belongs to each application; this package only carries reusable framework behavior.
It has no React, Ant Design, or Vite dependency.

It is shared by every web-based end that chooses the TrueAdmin protocol. Admin-only layout, menu, RBAC UI, and business components stay in the admin template or admin-specific packages.

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

`@trueadmin/web-core/crud` exports the shared list-query types, `serializeCrudParams`, `toCrudRequestParams`, and `crudRequestOptions`.

```js
import { serializeCrudParams } from '@trueadmin/web-core/crud';

const query = serializeCrudParams({
  page: 1,
  pageSize: 20,
  keyword: 'admin',
  filters: [
    { field: 'status', op: 'eq', value: 'enabled' },
    { field: 'id', op: 'in', value: [1, 2] },
  ],
  sorts: [
    { field: 'created_at', order: 'desc' },
    { field: 'id', order: 'asc' },
  ],
  params: {
    includeChildren: true,
  },
});

query.toString();
// page=1&pageSize=20&keyword=admin&filters%5B0%5D%5Bfield%5D=status&filters%5B0%5D%5Bop%5D=eq&filters%5B0%5D%5Bvalue%5D=enabled&filters%5B1%5D%5Bfield%5D=id&filters%5B1%5D%5Bop%5D=in&filters%5B1%5D%5Bvalue%5D%5B%5D=1&filters%5B1%5D%5Bvalue%5D%5B%5D=2&sorts%5B0%5D%5Bfield%5D=created_at&sorts%5B0%5D%5Border%5D=desc&sorts%5B1%5D%5Bfield%5D=id&sorts%5B1%5D%5Border%5D=asc&params%5BincludeChildren%5D=true
```
