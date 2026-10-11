const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolveRuntimeConfig } = require('../config/runtime-config.cjs');

test('development works without deployment settings', () => {
  assert.deepEqual(resolveRuntimeConfig({}), {
    environment: 'development',
    exampleUrl: 'http://localhost:3001/remoteEntry.js',
  });
});

test('staging and production use their configured remote URL', () => {
  for (const environment of ['staging', 'production']) {
    assert.deepEqual(
      resolveRuntimeConfig({
        MICROFE_ENV: environment,
        MICROFE_EXAMPLE_URL: 'https://example.company.test/remoteEntry.js',
      }),
      {
        environment,
        exampleUrl: 'https://example.company.test/remoteEntry.js',
      },
    );
  }
});

test('deployment configuration fails closed on missing or invalid values', () => {
  for (const environment of ['staging', 'production']) {
    assert.throws(() => resolveRuntimeConfig({ MICROFE_ENV: environment }), /MICROFE_EXAMPLE_URL/);
    for (const url of [
      'http://example.company.test/remoteEntry.js',
      'javascript:alert(1)',
      '/remoteEntry.js',
      'https://user:password@example.company.test/remoteEntry.js',
    ]) {
      assert.throws(() =>
        resolveRuntimeConfig({ MICROFE_ENV: environment, MICROFE_EXAMPLE_URL: url }),
      );
    }
  }
  assert.throws(() => resolveRuntimeConfig({ MICROFE_ENV: 'prod' }), /MICROFE_ENV/);
});

test('development may point to a custom HTTP remote', () => {
  assert.equal(
    resolveRuntimeConfig({ MICROFE_EXAMPLE_URL: 'http://localhost:4001/remoteEntry.js' })
      .exampleUrl,
    'http://localhost:4001/remoteEntry.js',
  );
});
