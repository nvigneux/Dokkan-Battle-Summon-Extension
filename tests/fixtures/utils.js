const clickAndCheck = async (button) => {
  await button.click();
  // @ts-ignore
  const clicked = await button.evaluate((el) => (el).classList.contains('summon-button__clicked'));
  if (!clicked) {
    await clickAndCheck(button);
  }
};

const clickMultipleTimes = async (button, times) => {
  if (times > 0) {
    await clickAndCheck(button);
    await clickMultipleTimes(button, times - 1);
  }
};

module.exports = {
  clickAndCheck,
  clickMultipleTimes,
};
