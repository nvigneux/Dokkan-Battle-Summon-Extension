// @ts-check
// Fixtures
const { test, expect } = require('./fixtures/loadExtension');
// Helpers
const {
  navigateToSummonPage, verifySummonButtons, performSummon, resetSummon,
} = require('./supports/helpers');

// Constants
const SUMMON_ID = 1445;

// Tests
test.beforeEach(async ({ page }) => {
  await navigateToSummonPage(page, SUMMON_ID);
});

// Test cases
test('should check if extension summon buttons are loaded', async ({ page }) => {
  await verifySummonButtons(page, expect, SUMMON_ID);
});

test('should single summon on banner', async ({ page }) => {
  await verifySummonButtons(page, expect, SUMMON_ID);
  await performSummon(page, expect, `button-single-${SUMMON_ID}`, 1, 1, '5');
});

test('should multi summon on banner', async ({ page }) => {
  await verifySummonButtons(page, expect, SUMMON_ID);
  await performSummon(page, expect, `button-multi-${SUMMON_ID}`, 10, 1, '50');
});

test('should reset summons', async ({ page }) => {
  await verifySummonButtons(page, expect, SUMMON_ID);
  await performSummon(page, expect, `button-single-${SUMMON_ID}`, 1, 1, '5');

  await resetSummon(page, expect);
});

test('should single summon many times on banner', async ({ page }) => {
  await verifySummonButtons(page, expect, SUMMON_ID);
  await performSummon(page, expect, `button-single-${SUMMON_ID}`, 1, 4, '20');
});

test('should multi summon many times on banner', async ({ page }) => {
  await verifySummonButtons(page, expect, SUMMON_ID);
  await performSummon(page, expect, `button-multi-${SUMMON_ID}`, 10, 4, '200');
});

test('should summon many single & multi on banner and reset', async ({ page }) => {
  await verifySummonButtons(page, expect, SUMMON_ID);

  await performSummon(page, expect, `button-multi-${SUMMON_ID}`, 10, 2, '100');
  await performSummon(page, expect, `button-single-${SUMMON_ID}`, 1, 4, '120');
  await performSummon(page, expect, `button-multi-${SUMMON_ID}`, 10, 2, '220');

  await resetSummon(page, expect);
});
