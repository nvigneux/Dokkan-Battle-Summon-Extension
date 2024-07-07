/* @typedef {import('playwright').Locator} Locator */

/**
 * Clicks the specified button and checks if it has been clicked successfully.
 * If the button is not clicked successfully, it recursively calls
 * itself until the button is clicked.
 * @param {import('playwright').Locator} button - The button element to click.
 * @returns {Promise<void>} - A promise that resolves when the button is clicked successfully.
 */
const clickAndCheck = async (button, page) => {
  await button.click();
  // @ts-ignore
  const clicked = await button.evaluate((el) => (el).classList.contains('summon-button__clicked'));
  if (!clicked) {
    await clickAndCheck(button, page);
  }
};

/**
 * Clicks a button multiple times.
 *
 * @param {import('playwright').Locator} button - The button element to click.
 * @param {number} times - The number of times to click the button.
 * @returns {Promise<void>} - A promise that resolves when all clicks are completed.
 */
const clickMultipleTimes = async (button, times, page) => {
  if (times > 0) {
    await clickAndCheck(button, page);
    await clickMultipleTimes(button, times - 1, page);
  }
};

module.exports = {
  clickAndCheck,
  clickMultipleTimes,
};
