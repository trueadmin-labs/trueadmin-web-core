import assert from 'node:assert/strict';
import test from 'node:test';
import { defineModule, definePluginConfig, serializeCrudParams } from '../src/index.js';
import { defineModule as defineModuleEntry } from '../src/module/index.js';
import { definePluginConfig as definePluginConfigEntry } from '../src/plugin/index.js';

test('root entry exports core helpers', () => {
  assert.equal(typeof serializeCrudParams, 'function');
  assert.equal(defineModule, defineModuleEntry);
  assert.equal(definePluginConfig, definePluginConfigEntry);
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
