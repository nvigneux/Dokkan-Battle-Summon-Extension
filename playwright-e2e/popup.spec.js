const { test, expect } = require('./fixtures/loadExtension');
const { checkResponseData } = require('./supports/helpers');

const JPN_API = 'https://jpn.dbz-dokkanbattle.com/api/gashas/Gasha::StoneGasha';
const GLO_API = 'https://dbz-dokkanbattle.com/api/gashas/Gasha::StoneGasha';

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

test('should intercept fetch on locale change', async ({ page }) => {
  const response = page.waitForResponse(JPN_API);

  await page.getByRole('button', { name: 'Global flag' }).click();
  await checkResponseData(response, expect);
});

test('should show 6 global banner', async ({ page }) => {
  const response = page.waitForResponse(GLO_API);
  await checkResponseData(response, expect);
  const cardPortal = await page.getByTestId('card-portal');
  await expect(cardPortal).toHaveCount(6);
});

test('should show 6 jp banner', async ({ page }) => {
  await page.getByRole('button', { name: 'Global flag' }).click();

  const response = page.waitForResponse(JPN_API);
  await checkResponseData(response, expect);

  const cardPortal = await page.getByTestId('card-portal');
  await expect(cardPortal).toHaveCount(6);
});

test('should allow clicking on a banner', async ({ page, context }) => {
  const response = page.waitForResponse(GLO_API);
  await checkResponseData(response, expect);

  const cardPortal = await page.getByTestId('card-portal').first();
  await cardPortal.click();

  await page.waitForTimeout(2000); // wait for page loading
  const pages = await context.pages();
  const isSummonPage = pages.some((_page) => _page.url().includes('https://dbz-dokkanbattle.com/summon'));
  await expect(isSummonPage).toBeTruthy();
});
