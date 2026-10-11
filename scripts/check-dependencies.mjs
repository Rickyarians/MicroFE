import { readFile } from 'node:fs/promises';
const manifests = await Promise.all(
  ['shell', 'example'].map(async (name) =>
    JSON.parse(await readFile(new URL(`../apps/${name}/package.json`, import.meta.url), 'utf8')),
  ),
);
for (const dependency of ['react', 'react-dom']) {
  const versions = manifests.map((manifest) => manifest.dependencies[dependency]);
  if (new Set(versions).size !== 1 || !/^\d+\.\d+\.\d+$/.test(versions[0]))
    throw new Error(`${dependency} must use the same exact version in every app`);
}
if (manifests[0].dependencies.react !== manifests[0].dependencies['react-dom'])
  throw new Error('React and React DOM versions must match');
const ui = JSON.parse(
  await readFile(new URL('../packages/ui/package.json', import.meta.url), 'utf8'),
);
if (ui.peerDependencies.react !== manifests[0].dependencies.react)
  throw new Error('UI peer React version must match the apps');
console.log('Shared React versions are consistent.');
