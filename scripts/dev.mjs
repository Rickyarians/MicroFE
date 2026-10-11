import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cli = fileURLToPath(new URL('../node_modules/webpack-cli/bin/cli.js', import.meta.url));
const children = ['shell', 'example'].map((name) =>
  spawn(process.execPath, [cli, 'serve', '--mode', 'development'], {
    cwd: fileURLToPath(new URL(`../apps/${name}`, import.meta.url)),
    stdio: 'inherit',
  }),
);
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = code;
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop());
for (const child of children) child.on('exit', (code) => stop(code ?? 1));
for (const child of children)
  child.on('error', (error) => {
    console.error(error);
    stop(1);
  });
