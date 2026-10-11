import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
const servers = ['shell', 'example'].map((name, index) => {
  const root = fileURLToPath(new URL(`../apps/${name}/dist/`, import.meta.url));
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root)) { response.writeHead(403).end(); return; }
      const content = await readFile(file);
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }).end(content);
    } catch { response.writeHead(404).end('Not found'); }
  });
  server.listen(3000 + index, () => console.log(`${name}: http://localhost:${3000 + index}`));
  return server;
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => servers.forEach(server => server.close()));
