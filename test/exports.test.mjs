import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import test from 'node:test';
import {
  ApiError,
  defineModule,
  definePluginConfig,
  downloadFile,
  errorCenter,
  normalizeError,
  crudRequestOptions,
  resolveTrans,
  serializeCrudParams,
  stringifyRawSearchParams,
  toCrudRequestParams,
  trans,
} from '../src/index.js';
import { downloadFile as downloadFileEntry } from '../src/download/index.js';
import { errorCenter as errorCenterEntry } from '../src/error/index.js';
import { trans as transEntry } from '../src/i18n/index.js';
import { defineModule as defineModuleEntry } from '../src/module/index.js';
import { definePluginConfig as definePluginConfigEntry } from '../src/plugin/index.js';
import { stringifyRawSearchParams as stringifyRawSearchParamsEntry } from '../src/url/index.js';

const sourceFiles = (directoryUrl) =>
  readdirSync(directoryUrl, { withFileTypes: true }).flatMap((entry) => {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl);
    if (entry.isDirectory()) {
      return sourceFiles(entryUrl);
    }
    return statSync(entryUrl).isFile() ? [entryUrl] : [];
  });

test('package exposes protocol subpaths', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(packageJson.exports['./http'].types, './src/http/index.d.ts');
  assert.equal(packageJson.exports['./http'].default, './src/http/index.js');
});

test('package source stays framework neutral', () => {
  const forbiddenPatterns = [
    /\bfrom ['"]react['"]/,
    /\bfrom ['"]antd['"]/,
    /\bfrom ['"]@ant-design\//,
    /\bReactNode\b/,
  ];
  for (const fileUrl of sourceFiles(new URL('../src/', import.meta.url))) {
    const source = readFileSync(fileUrl, 'utf8');
    for (const pattern of forbiddenPatterns) {
      assert.doesNotMatch(source, pattern, fileUrl.pathname);
    }
  }
});

test('root entry exports core helpers', () => {
  assert.equal(typeof serializeCrudParams, 'function');
  assert.equal(typeof toCrudRequestParams, 'function');
  assert.equal(typeof crudRequestOptions, 'function');
  assert.equal(defineModule, defineModuleEntry);
  assert.equal(definePluginConfig, definePluginConfigEntry);
  assert.equal(downloadFile, downloadFileEntry);
  assert.equal(errorCenter, errorCenterEntry);
  assert.equal(trans, transEntry);
  assert.equal(stringifyRawSearchParams, stringifyRawSearchParamsEntry);
});

test('crud request helpers serialize query options', () => {
  assert.equal(
    toCrudRequestParams({ page: 2, filters: [{ field: 'name', op: 'like', value: 'admin' }] }),
    'page=2&filters%5B0%5D%5Bfield%5D=name&filters%5B0%5D%5Bop%5D=like&filters%5B0%5D%5Bvalue%5D=admin',
  );
  assert.deepEqual(crudRequestOptions({ page: 2 }), { params: 'page=2' });
  assert.equal(crudRequestOptions(), undefined);
});

test('module and plugin helpers preserve manifest identity', () => {
  const moduleManifest = {
    id: 'system',
    routes: [{ path: '/dashboard' }],
    menus: [{ code: 'system.dashboard', path: '/dashboard' }],
  };
  const pluginConfig = {
    'acme.demo': {
      enabled: true,
      config: {
        color: 'green',
      },
    },
  };

  assert.equal(defineModule(moduleManifest), moduleManifest);
  assert.equal(definePluginConfig(pluginConfig), pluginConfig);
});

test('i18n helpers resolve translatable text', () => {
  const text = trans('demo.title', 'Demo');
  assert.deepEqual(text, { __trans: true, key: 'demo.title', fallback: 'Demo' });
  assert.equal(
    resolveTrans(text, (key, fallback) => `${key}:${fallback ?? ''}`),
    'demo.title:Demo',
  );
});

test('error helpers normalize unknown errors', () => {
  const normalized = normalizeError({ code: 'DEMO.ERROR', message: 'Demo failed', status: '422' });
  assert.ok(normalized instanceof ApiError);
  assert.equal(normalized.code, 'DEMO.ERROR');
  assert.equal(normalized.status, 422);
});

test('url helpers preserve raw query brackets', () => {
  const params = new URLSearchParams();
  params.set('filter[name]', 'admin');
  params.set('empty', '');
  assert.equal(stringifyRawSearchParams(params), 'filter[name]=admin&empty');
});
