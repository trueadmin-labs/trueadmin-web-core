import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ApiError,
  defineModule,
  definePluginConfig,
  downloadFile,
  errorCenter,
  normalizeError,
  resolveTrans,
  serializeCrudParams,
  stringifyRawSearchParams,
  trans,
} from '../src/index.js';
import { downloadFile as downloadFileEntry } from '../src/download/index.js';
import { errorCenter as errorCenterEntry } from '../src/error/index.js';
import { trans as transEntry } from '../src/i18n/index.js';
import { defineModule as defineModuleEntry } from '../src/module/index.js';
import { definePluginConfig as definePluginConfigEntry } from '../src/plugin/index.js';
import { stringifyRawSearchParams as stringifyRawSearchParamsEntry } from '../src/url/index.js';

test('root entry exports core helpers', () => {
  assert.equal(typeof serializeCrudParams, 'function');
  assert.equal(defineModule, defineModuleEntry);
  assert.equal(definePluginConfig, definePluginConfigEntry);
  assert.equal(downloadFile, downloadFileEntry);
  assert.equal(errorCenter, errorCenterEntry);
  assert.equal(trans, transEntry);
  assert.equal(stringifyRawSearchParams, stringifyRawSearchParamsEntry);
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
