const { writeFileSync, renameSync } = require('node:fs');
const { resolveRuntimeConfig, runtimeConfigSource } = require('./runtime-config.cjs');
const config = resolveRuntimeConfig(process.env);
const destination = '/usr/share/nginx/html/runtime-config.js';
// Validate first, then atomically replace the public runtime configuration.
writeFileSync(`${destination}.tmp`, runtimeConfigSource(config));
renameSync(`${destination}.tmp`, destination);
console.log(`Configured shell container for ${config.environment}.`);
