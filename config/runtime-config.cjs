const path = require('node:path');
const { existsSync } = require('node:fs');

function resolveRuntimeConfig(values = process.env) {
  const environment = values.MICROFE_ENV ?? 'development';
  if (!['development', 'staging', 'production'].includes(environment)) {
    throw new Error('MICROFE_ENV must be development, staging, or production');
  }
  const exampleUrl =
    values.MICROFE_EXAMPLE_URL ??
    (environment === 'development' ? 'http://localhost:3001/remoteEntry.js' : undefined);
  if (!exampleUrl) throw new Error('MICROFE_EXAMPLE_URL is required for staging and production');
  let url;
  try {
    url = new URL(exampleUrl);
  } catch {
    throw new Error('MICROFE_EXAMPLE_URL must be an absolute URL');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('MICROFE_EXAMPLE_URL must use HTTP(S) without embedded credentials');
  }
  if (environment !== 'development' && url.protocol !== 'https:') {
    throw new Error('MICROFE_EXAMPLE_URL must use HTTPS for staging and production');
  }
  return { environment, exampleUrl: url.href };
}

function readRuntimeConfig() {
  const localFile = path.join(__dirname, '../.env.local');
  // Node preserves existing process environment values over entries in this file.
  if (existsSync(localFile)) process.loadEnvFile(localFile);
  return resolveRuntimeConfig();
}

function runtimeConfigSource(config) {
  // Only these public fields are emitted. Never serialize process.env.
  return `window.__MICROFE_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;
}

module.exports = { resolveRuntimeConfig, readRuntimeConfig, runtimeConfigSource };
