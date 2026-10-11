const path = require('node:path');
const { writeFileSync } = require('node:fs');
const { readRuntimeConfig, runtimeConfigSource } = require('../config/runtime-config.cjs');
const config = readRuntimeConfig();
// Configure an existing build without changing its compiled bundles.
writeFileSync(
  path.join(__dirname, '../apps/shell/dist/runtime-config.js'),
  runtimeConfigSource(config),
);
console.log(`Configured shell runtime for ${config.environment}.`);
