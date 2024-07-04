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

test('should Single Summon on banner', async ({ page }) => {
  await page.goto('https://jpn.dbz-dokkanbattle.com/summon/1445');

  const buttonConsent = await page.getByLabel('Consent', { exact: true });
  await buttonConsent.click();

  const singleButton = await page.locator('.summon-button__single').first();
  await singleButton.click();

  const ds = await page.locator('.summon-stats__ds').first();
  expect(ds).toContainText('5');

  const resultSummon = await page.locator('#summon-result').first();
  expect(resultSummon).toBeTruthy();

  const resulsSummonCards = await page.locator('#summon-result .card');
  expect(resulsSummonCards).toHaveCount(1);
});
