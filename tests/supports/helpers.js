const { clickMultipleTimes } = require('./utils');

/**
 * Navigates to the summon page with the specified summon ID.
 *
 * @param {import('playwright').Page} page - The page object representing the web page.
 * @param {number} summonId - The ID of the summon page to navigate to.
 * @returns {Promise<void>} - A promise that resolves once the navigation is complete.
 */
const navigateToSummonPage = async (page, summonId) => {
  await page.goto(`https://jpn.dbz-dokkanbattle.com/summon/${summonId}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000); // wait for page loading
  const buttonConsent = await page.getByLabel('Consent', { exact: true });
  await buttonConsent.click();
};

/**
 * Verifies the existence of summon buttons on a page.
 * @param {import('playwright').Page} page - The page object representing the web page.
 * @param {Function} expect - The expect function from a testing framework.
 * @param {number} summonId - The ID of the summon.
 * @returns {Promise<void>} - A promise that resolves when the verification is complete.
 */
const verifySummonButtons = async (page, expect, summonId) => {
  const singleButton = await page.getByTestId(`button-single-${summonId}`);
  const multiButton = await page.getByTestId(`button-multi-${summonId}`);

  await Promise.all([
    expect(singleButton).toBeTruthy(),
    expect(multiButton).toBeTruthy(),
  ]);
};

/**
 * Performs a summon action on the page.
 *
 * @param {import('playwright').Page} page - The page object representing the web page.
 * @param {Function} expect - The expect function from the testing framework.
 * @param {string} buttonTestId - The test ID of the summon button.
 * @param {number} expectedCardCount - The expected number of cards after summoning.
 * @param {number} nbClick - The number of times to click the button.
 * @param {string} expectedDs - The expected value of the summon stats DS.
 * @returns {Promise<void>} - A promise that resolves when the summon action is completed.
 */
const performSummon = async (
  page,
  expect,
  buttonTestId,
  expectedCardCount,
  nbClick,
  expectedDs,
) => {
  const summonButton = await page.getByTestId(buttonTestId);
  await clickMultipleTimes(summonButton, nbClick, page);

  const resultSummon = await page.getByTestId('summon-result').locator('.card');
  await expect(resultSummon).toHaveCount(expectedCardCount);

  const ds = await page.locator('.summon-stats__ds');
  await expect(ds).toContainText(expectedDs);
};

/**
 * Resets the summon by clicking the reset button, and verifies that the summon result
 * and DS count are reset.
 *
 * @param {import('playwright').Page} page - The page object representing the web page.
 * @param {Function} expect - The expect function from the testing framework.
 * @returns {Promise<void>} - A promise that resolves once the summon is reset.
 */
const resetSummon = async (page, expect) => {
  const resetButton = await page.getByTestId('summon-button-reset');
  await resetButton.click();

  const resultSummon = await page.getByTestId('summon-result').locator('.card');
  await expect(resultSummon).toHaveCount(0);

  const ds = await page.locator('.summon-stats__ds');
  await expect(ds).toContainText('0');
};

module.exports = {
  navigateToSummonPage,
  verifySummonButtons,
  performSummon,
  resetSummon,
};
