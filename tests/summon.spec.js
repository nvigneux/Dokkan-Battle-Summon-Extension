// @ts-check
const { test, expect } = require('./fixtures/load-extension');

test('should check if extension buttons are loaded', async ({ page }) => {
  await page.goto('https://jpn.dbz-dokkanbattle.com/summon/1445');

  const buttonConsent = await page.getByLabel('Consent', { exact: true });
  await buttonConsent.click();

  const singleButton = await page.locator('.summon-button__single').first();
  const multiButton = await page.locator('.summon-button__multi').first();

  expect(singleButton).toBeTruthy();
  expect(multiButton).toBeTruthy();
});
