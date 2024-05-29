/* eslint-disable camelcase */
/**
 * Initial storage object.
 * @type {Object}
 * @property {number} count - The count value.
 */
const initStorage = {
  fetchedUrls: {},
};

const initStorageSummon = {
  summonHistory: [],
  summonCards: {},
  totalMultiSummons: 0,
  totalSingleSummons: 0,
  totalDS: 0,
};

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
      if (tab?.url?.includes(message.gashaId)) chrome.tabs.sendMessage(tab.id, message);
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
const calculateRates = (rates) => {
  const ratesSsr = rates.filter((rate) => rate.rarity === 3);
  const ratesSr = rates.filter((rate) => rate.rarity === 2);
  const ratesR = rates.filter((rate) => rate.rarity === 1);

  return ({
    featuredSSR: ratesSsr[0]?.featured_rate ? parseFloat(ratesSsr[0].featured_rate) / 100 : 0,
    nonFeaturedSSR: ratesSsr[0]?.normal_rate ? parseFloat(ratesSsr[0].normal_rate) / 100 : 0,
    featuredSR: ratesSr[0]?.featured_rate ? parseFloat(ratesSr[0].featured_rate) / 100 : 0,
    nonFeaturedSR: ratesSr[0]?.normal_rate ? parseFloat(ratesSr[0].normal_rate) / 100 : 0,
    R: ratesR[0]?.total_rate ? parseFloat(ratesR[0].total_rate) / 100 : 0,
  });
};

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
  }
  if (rand < rates.featuredSSR + rates.featuredSR) {
    return getRandomItem(cards.featuredSRs);
  }
  if (rand < rates.featuredSSR + rates.featuredSR + rates.nonFeaturedSSR) {
    return getRandomItem(cards.nonFeaturedSSRs);
  }
  if (rand < rates.featuredSSR + rates.nonFeaturedSSR
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

// /**
//  * Returns the category of a card based on its rarity and featured status.
//  *
//  * @param {Object} card - The card object.
//  * @param {number} card.rarity - The rarity of the card.
//  * @param {boolean} card.featured - The featured status of the card.
//  * @returns {string} The category of the card.
//  */
// const getCardCategory = (card) => {
//   switch (card.rarity) {
//     case 3:
//       return card.featured ? 'featuredSSRs' : 'nonFeaturedSSRs';
//     case 2:
//       return card.featured ? 'featuredSRs' : 'nonFeaturedSRs';
//     case 1:
//       return 'Rs';
//     default:
//       return '';
//   }
// };

/**
 * Builds a new storage object with updated summon history, summon count, and total dragon stones.
 *
 * @param {Object} storage - The current storage object.
 * @param {Array} result - The result of the summon.
 * @param {string} summonType - The type of summon.
 * @param {number} summonAmount - The amount of dragon stones used for the summon.
 * @returns {Object} - The new storage object.
 */
const buildNewSummonsStorage = (storage, result, summonType, summonAmount, gashaId) => {
  const storageInit = { ...storage };
  const { summonCards, summonHistory, totalDS } = storageInit[gashaId];

  const newSummonCards = result.reduce((acc, card) => {
    acc[card.id] = { ...card, count: !acc[card.id] ? 1 : acc[card.id].count += 1 };
    return acc;
  }, {
    ...summonCards,
  });

  const newTotalDS = totalDS + summonAmount;
  const newStorage = {
    ...storage,
    [gashaId]: {
      ...storageInit[gashaId],
      summonCards: newSummonCards,
      summonHistory: summonHistory.concat({ result }),
      [summonType]: storageInit[gashaId][summonType] += 1,
      totalDS: newTotalDS,
    },
  };
  return newStorage;
};

/**
 * Event listener for the onMessage event.
 * Handles messages sent from content scripts.
 * @param {Object} message - The message object.
 * @param {Object} sender - The sender object.
 * @param {Function} sendResponse - The response callback function.
 * @returns {boolean} - Whether the response callback function will be called asynchronously.
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case 'USER_SINGLE_SUMMON': {
      const storage = await chrome.storage.local.get();
      const { rates } = storage.fetchedUrls[message.gashaId];

      const summonRates = calculateRates(rates);
      const cardsCategory = getCardsByCategory(storage.fetchedUrls[message.gashaId]);
      const result = summon(cardsCategory, summonRates);

      const newStorage = buildNewSummonsStorage(storage, [result], 'totalSingleSummons', 5, message.gashaId);
      await chrome.storage.local.set({ ...newStorage });

      sendResponse({ result: [result] });
      sendTabsMessage({ action: 'BACKGROUND_SINGLE_SUMMON', result: [result], gashaId: message.gashaId });
      sendTabsMessage({ action: 'BACKGROUND_UPDATE_STORAGE', storage: { ...newStorage }, gashaId: message.gashaId });
      break;
    }

    case 'USER_MULTI_SUMMON': {
      const storage = await chrome.storage.local.get();
      const { rates } = storage.fetchedUrls[message.gashaId];
      const summonRates = calculateRates(rates);
      const cardsCategory = getCardsByCategory(storage.fetchedUrls[message.gashaId]);
      const result = multiSummon(cardsCategory, summonRates);

      const newStorage = buildNewSummonsStorage(storage, result, 'totalMultiSummons', 50, message.gashaId);
      await chrome.storage.local.set({ ...newStorage });

      sendResponse({ ...result });
      sendTabsMessage({ action: 'BACKGROUND_MULTI_SUMMON', result, gashaId: message.gashaId });
      sendTabsMessage({ action: 'BACKGROUND_UPDATE_STORAGE', storage: { ...newStorage }, gashaId: message.gashaId });
      break;
    }

    default:
      // Handle other actions here
      break;
  }
  return true; // Required to keep promise
});

/**
 * Object to store fetched URLs.
 * @type {Object}
 */
const fetchedUrls = {};

/**
 * Event listener for the onBeforeRequest event.
 * Intercepts and fetches data from the specified URL.
 * @param {Object} details - The details object.
 */
chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const url = new URL(details.url);
    const gashaId = url.pathname.split('/').pop();

    if (fetchedUrls[gashaId]) {
      setTimeout(() => {
        chrome.storage.local.set({
          ...initStorage,
          fetchedUrls: { ...fetchedUrls },
          [gashaId]: { ...initStorageSummon },
        });
        sendTabsMessage({
          action: 'REQUEST_INTERCEPTED_GASHA', details, data: fetchedUrls[gashaId], gashaId,
        });
      }, 1000);
    }

    if (!fetchedUrls[gashaId]) {
      fetchedUrls[gashaId] = {};
      fetch(details.url)
        .then((response) => response.json())
        .then((data) => {
          const cardsCategory = getCardsByCategory(data);
          fetchedUrls[gashaId] = { ...data, ...cardsCategory };
          sendTabsMessage({
            action: 'REQUEST_INTERCEPTED_GASHA', details, data, gashaId,
          });
          chrome.storage.local.set({
            ...initStorage,
            fetchedUrls: { ...fetchedUrls },
            [gashaId]: { ...initStorageSummon },
          });
        });
    }
  },
  { urls: ['*://dbz-dokkanbattle.com/api/gasha/*', '*://jpn.dbz-dokkanbattle.com/api/gasha/*'] },
  ['requestBody'],
);
