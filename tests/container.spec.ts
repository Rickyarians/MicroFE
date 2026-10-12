import { expect, test } from '@playwright/test';

test.skip(process.env.MICROFE_TEST_TARGET !== 'container', 'Requires running Docker Compose');

test('container serves health, config and cache headers without an asset fallback', async ({
  request,
}) => {
  for (const origin of ['http://localhost:3000', 'http://localhost:3001']) {
    const health = await request.get(`${origin}/health`);
    expect(health.status()).toBe(200);
    expect(await health.text()).toBe('healthy\n');
    const missing = await request.get(`${origin}/missing.js`);
    expect(missing.status()).toBe(404);
    const html = await request.get(origin);
    expect(html.headers()['cache-control']).toBe('no-cache');
    const chunk = (await html.text()).match(/src=["']?([^"'\s>]+\.js)/)?.[1];
    expect(chunk).toBeTruthy();
    const asset = await request.get(`${origin}/${chunk}`);
    expect(asset.status()).toBe(200);
    expect(asset.headers()['cache-control']).toContain('immutable');
    expect(asset.headers()['content-type']).toMatch(/javascript/);
  }
  for (const url of [
    'http://localhost:3000/runtime-config.js',
    'http://localhost:3001/remoteEntry.js',
  ]) {
    const response = await request.get(url);
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe('no-cache');
  }
});
