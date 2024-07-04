// @ts-check
const { test, expect } = require('./fixtures/load-extension');

const SUMMON_ID = 1445;
test.beforeEach(async ({ page }) => {
  await page.goto(`https://jpn.dbz-dokkanbattle.com/summon/${SUMMON_ID}`);
  const buttonConsent = await page.getByLabel('Consent', { exact: true });
  await buttonConsent.click();
});

/**
 * Clicks the specified button and checks if it has been successfully clicked.
 * If the button is not clicked, it recursively calls itself until the button is clicked.
 * @param {import('playwright/test').ElementHandle} button - The button element to be clicked.
 * @returns {Promise<void>} - A promise that resolves when the button is successfully clicked.
 */
const clickAndCheck = async (button) => {
  await button.click();
  // @ts-ignore
  const clicked = await button.evaluate((el) => (el).classList.contains('summon-button__clicked'));
  if (!clicked) {
    await clickAndCheck(button);
  }
};

test('should check if extension summon buttons are loaded', async ({ page }) => {
  const singleButton = await page.getByTestId(`button-single-${SUMMON_ID}`);
  const multiButton = await page.getByTestId(`button-multi-${SUMMON_ID}`);

  expect(singleButton).toBeTruthy();
  expect(multiButton).toBeTruthy();
});

test('should Single Summon on banner', async ({ page }) => {
  const summonButtons = await page.getByTestId('summon-buttons').locator('button');
  expect(summonButtons).toHaveCount(2);

  const summonSingleButton = await page.getByTestId(`button-single-${SUMMON_ID}`);
  // @ts-ignore
  await clickAndCheck(summonSingleButton);
  await page.waitForTimeout(1000); // wait for the summon cards display

  const resultSummon = await page.getByTestId('summon-result').locator('.card');
  expect(resultSummon).toHaveCount(1);

  const ds = await page.locator('.summon-stats__ds').first();
  expect(ds).toContainText('5');
});

test('should Multi Summon on banner', async ({ page }) => {
  const summonButtons = await page.getByTestId('summon-buttons').locator('button');
  expect(summonButtons).toHaveCount(2);

  const summonMultiButton = await page.getByTestId(`button-multi-${SUMMON_ID}`);
  // @ts-ignore
  await clickAndCheck(summonMultiButton);
  await page.waitForTimeout(1000); // wait for the summon cards display

  const resultSummon = await page.getByTestId('summon-result').locator('.card');
  expect(resultSummon).toHaveCount(10);

  const ds = await page.locator('.summon-stats__ds').first();
  expect(ds).toContainText('50');
});
