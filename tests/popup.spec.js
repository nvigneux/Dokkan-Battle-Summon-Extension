const { test, expect } = require('./fixtures/loadExtension');

test.beforeEach(async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
});

test('popup page', async ({ page }) => {
  await expect(page.locator('body')).toHaveText('Dokkan Battle Summons');
});

test('should show skeleton banner', async ({ page }) => {
  const cardPortalSkeleton = await page.getByTestId('card-portal-skeleton');
  await expect(cardPortalSkeleton).toHaveCount(6);
});

test('should change locale of banners', async ({ page }) => {
  await page.getByRole('button', { name: 'Global flag' }).click();
  await expect(page.getByRole('button', { name: 'Japan flag' })).toBeVisible();

  await page.getByRole('button', { name: 'Japan flag' }).click();
  await expect(page.getByRole('button', { name: 'Global flag' })).toBeVisible();
});
