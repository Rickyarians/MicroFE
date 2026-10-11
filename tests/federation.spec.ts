import { expect, test } from '@playwright/test';

test('loads a real remote widget and opens its screen through a callback', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const remoteEntry = page.waitForResponse(response =>
    response.url().includes(':3001/remoteEntry.js') && response.ok());
  await page.goto('/');
  await remoteEntry;
  await expect(page.getByRole('heading', { name: 'Widget dari remote' })).toBeVisible();
  await page.getByRole('button', { name: 'Klik: 0', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Klik: 1', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Buka screen remote' }).click();
  await expect(page).toHaveURL(/#\/example$/);
  await expect(page.getByRole('heading', { name: 'Screen dari remote' })).toBeVisible();
  await page.getByRole('button', { name: 'Kembali ke dashboard' }).click();
  await expect(page.getByRole('heading', { name: 'Widget dari remote' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('keeps the shell usable when the remote cannot load', async ({ page }) => {
  await page.route('**/remoteEntry.js', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Modul tidak tersedia');
  await expect(page.getByRole('heading', { name: 'MicroFE' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
});

test('opens a remote screen directly from the URL', async ({ page }) => {
  await page.goto('/#/example');
  await expect(page.getByRole('heading', { name: 'Screen dari remote' })).toBeVisible();
});

test('runs the remote independently of the shell', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await expect(page.getByRole('heading', { name: 'Widget dari remote' })).toBeVisible();
  await page.getByRole('button', { name: 'Buka screen remote' }).click();
  await expect(page.getByRole('heading', { name: 'Screen dari remote' })).toBeVisible();
});

test('shows a fallback for unknown routes', async ({ page }) => {
  await page.goto('/#/missing');
  await expect(page.getByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeVisible();
});

test('uses the remote URL from runtime configuration', async ({ page }) => {
  await page.route('**/runtime-config.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.__MICROFE_CONFIG__ = { exampleUrl: "http://localhost:3001/alternate-entry.js" };',
  }));
  await page.route('**/alternate-entry.js', async route => {
    const response = await route.fetch({ url: 'http://localhost:3001/remoteEntry.js' });
    await route.fulfill({ response });
  });
  const alternate = page.waitForResponse('**/alternate-entry.js');
  await page.goto('/');
  await alternate;
  await expect(page.getByRole('heading', { name: 'Widget dari remote' })).toBeVisible();
});

test('loads runtime configuration alongside a shell deployed under a path prefix', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.route('**/mounted/**', async route => {
    const response = await route.fetch({ url: route.request().url().replace('/mounted/', '/') });
    await route.fulfill({ response });
  });
  // Forward the remote too: a fulfilled document has an unknown network address space in Chromium.
  await page.route('http://localhost:3001/**', async route => {
    await route.fulfill({ response: await route.fetch() });
  });
  await page.goto('/mounted/');
  await expect(page.getByRole('heading', { name: 'Widget dari remote' })).toBeVisible();
  expect(requests).toContain('http://localhost:3000/mounted/runtime-config.js');
});
