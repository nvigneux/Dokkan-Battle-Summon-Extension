/* eslint-disable camelcase */
/**
 * Initial storage object.
 * @type {Object}
 * @property {number} count - The count value.
 */
const initStorage = {
  count: 0,
  fetchedUrls: {},
  summonHistory: {
    featuredSSRs: {},
    nonFeaturedSSRs: {},
    featuredSRs: {},
    nonFeaturedSRs: {},
  },
  totalSummons: 0,
  totalDS: 0,
};

/**
 * Object to store fetched URLs.
 * @type {Object}
 */
const fetchedUrls = {};

/**
 * Event listener for the onInstalled event.
 * Sets the initial storage value when the extension is installed or updated.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ ...initStorage });
});

/**
 * Sends a message to the background script and all active tabs.
 * @param {any} message - The message to be sent.
 */
const sendTabsMessage = (message) => {
  // send requestStatus to every active tab
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab?.url) chrome.tabs.sendMessage(tab.id, message);
    });
  });
};

/**
 * Returns a random item from the given array.
 *
 * @param {Array} items - The array from which to select a random item.
 * @returns {*} - A random item from the array.
 */
const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

/**
 * Retrieves cards categorized by their rarity.
 *
 * @param {Object} cards - The object containing the cards.
 * @returns {Object} - An object containing different categories of cards based on their rarity.
 */
const getCardsByCategory = (cards) => ({
  featuredSSRs: cards.featured_cards.filter((card) => card.rarity === 3).map((card) => ({
    ...card,
    featured: true,
  })),
  nonFeaturedSSRs: cards.normal_cards.filter((card) => card.rarity === 3),
  featuredSRs: cards.featured_cards.filter((card) => card.rarity === 2).map((card) => ({
    ...card,
    featured: true,
  })),
  nonFeaturedSRs: cards.normal_cards.filter((card) => card.rarity === 2),
  Rs: cards.normal_cards.filter((card) => card.rarity === 1),
});

/**
 * Calculates the rates for different card types based on the provided rates array.
 *
 * @param {Array} rates - The rates array containing the rates for different card types.
 * @returns {Object} - An object containing the calculated rates for different card types.
 */
const calculateRates = (rates) => ({
  featuredSSR: parseFloat(rates[0].featured_rate) / 100,
  nonFeaturedSSR: parseFloat(rates[0].normal_rate) / 100,
  featuredSR: parseFloat(rates[1].featured_rate) / 100,
  nonFeaturedSR: parseFloat(rates[1].normal_rate) / 100,
  R: parseFloat(rates[2].total_rate) / 100,
});

/**
 * Selects a guaranteed SSR card from the given set of cards.
 * @param {Object} cards - The set of cards to choose from.
 * @param {Array} cards.featuredSSRs - The array of featured SSR cards.
 * @param {Array} cards.nonFeaturedSSRs - The array of non-featured SSR cards.
 * @returns {Object} - The selected SSR card.
 */
const summonGuaranteedSSR = (cards) => {
  const rand = Math.random();
  if (rand < 0.05) { // 5% chance for a featured SSR
    return getRandomItem(cards.featuredSSRs);
  }
  // 95% chance for a non-featured SSR
  return getRandomItem(cards.nonFeaturedSSRs);
};

/**
 * Utility function to simulate a summon.
 * @param {Object} cards - The cards object.
 * @param {Object} rates - The rates object.
 * @returns {string} - The summoned item.
 */
const summon = (cards, rates) => {
  const rand = Math.random();

  if (rand < rates.featuredSSR) {
    return getRandomItem(cards.featuredSSRs);
  } if (rand < rates.featuredSSR + rates.nonFeaturedSSR) {
    return getRandomItem(cards.nonFeaturedSSRs);
  } if (rand < rates.featuredSSR + rates.nonFeaturedSSR + rates.featuredSR) {
    return getRandomItem(cards.featuredSRs);
  } if (rand < rates.featuredSSR + rates.nonFeaturedSSR
    + rates.featuredSR + rates.nonFeaturedSR) {
    return getRandomItem(cards.nonFeaturedSRs);
  }
  return getRandomItem(cards.Rs);
};

/**
 * Performs a multi-summon in the Dragon Ball Z Dokkan Battle game.
 *
 * @param {Object} cards - The collection of available cards.
 * @param {Object} rates - The summon rates for each card category.
 * @returns {Array} - An array of summoned cards.
 */
const multiSummon = (cards, rates) => {
  const results = [];
  for (let i = 0; i < 9; i += 1) {
    results.push(summon(cards, rates));
  }
  results.push(summonGuaranteedSSR(cards));
  return results;
};

/**
 * Event listener for the onMessage event.
 * Handles messages sent from content scripts.
 * @param {Object} message - The message object.
 * @param {Object} sender - The sender object.
 * @param {Function} sendResponse - The response callback function.
 * @returns {boolean} - Whether the response callback function will be called asynchronously.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'USER_CLICKED':
      chrome.storage.local.get().then((res) => {
        const newRes = { ...initStorage, ...res, count: res.count += 1 };
        sendResponse({ ...newRes });
        sendTabsMessage({ action: 'BACKGROUND_UPDATE_COUNT', newRes });
        chrome.storage.local.set({ ...newRes });
      });
      break;

    case 'USER_SINGLE_SUMMON': {
      chrome.storage.local.get().then((res) => {
        const { rates } = res.fetchedUrls[message.gashaId];
        const summonRates = calculateRates(rates);
        const cardsCategory = getCardsByCategory(res.fetchedUrls[message.gashaId]);

        const result = summon(cardsCategory, summonRates);
        sendResponse({ ...result });
        sendTabsMessage({ action: 'BACKGROUND_SINGLE_SUMMON', result });
      });
      break;
    }

    case 'USER_MULTI_SUMMON': {
      chrome.storage.local.get().then((res) => {
        const { rates } = res.fetchedUrls[message.gashaId];
        const summonRates = calculateRates(rates);
        const cardsCategory = getCardsByCategory(res.fetchedUrls[message.gashaId]);

        const result = multiSummon(cardsCategory, summonRates);
        sendResponse({ ...result });
        sendTabsMessage({ action: 'BACKGROUND_MULTI_SUMMON', result });
      });
      break;
    }

    default:
      // Handle other actions here
      break;
  }
  return true; // Required to keep promise
});

/**
 * Event listener for the onBeforeRequest event.
 * Intercepts and fetches data from the specified URL.
 * @param {Object} details - The details object.
 */
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    const gashaId = url.pathname.split('/').pop();
    if (!fetchedUrls[gashaId]) {
      fetchedUrls[gashaId] = {};
      fetch(details.url)
        .then((response) => response.json())
        .then((data) => {
          fetchedUrls[gashaId] = data;
          sendTabsMessage({
            action: 'REQUEST_INTERCEPTED_GASHA', details, data, gashaId,
          });
          chrome.storage.local.set({ fetchedUrls });
        });
    }
  },
  { urls: ['*://dbz-dokkanbattle.com/api/gasha/*', '*://jpn.dbz-dokkanbattle.com/api/gasha/*'] },
  ['requestBody'],
);
