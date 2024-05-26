/**
 * Utility function to get the rarity of a card.
 * @param {number} rarity - The rarity value of the card.
 * @returns {string} - The rarity of the card.
 */
const getCardRarity = (rarity) => {
  switch (rarity) {
    case 0:
      return 'n';
    case 1:
      return 'r';
    case 2:
      return 'sr';
    case 3:
      return 'ssr';
    case 4:
      return 'ur';
    case 5:
      return 'lr';
    default:
      return '';
  }
};

/**
 * Utility function to get the source of the rarity image for a card.
 * @param {number} rarity - The rarity value of the card.
 * @returns {string} - The source of the rarity image.
 */
const getCardRaritySrc = (rarity) => `../../../../img/layout/cha_rare_${rarity}.png`;

/**
 * Utility function to get the element of a card.
 * @param {number} element - The element value of the card.
 * @returns {string} - The element of the card.
 */
const getCardElement = (element) => {
  switch (element) {
    case 0: // agl
      return '00';
    case 1: // teq
      return '01';
    case 2: // int
      return '02';
    case 3: // str
      return '03';
    case 4: // phy
      return '04';
    default:
      return '';
  }
};

/**
 * Utility function to get the source of the element icon for a card.
 * @param {number} element - The element value of the card.
 * @returns {string} - The source of the element icon.
 */
const getCardElementSrc = (element) => `../../../../img/layout/cha_type_icon_${element}.png`;

/**
 * Utility function to get the background image for a card.
 * @param {number} element - The element value of the card.
 * @param {number} rarity - The rarity value of the card.
 * @returns {string} - The background image for the card.
 */
const getCardBackground = (element, rarity) => `../../../../img/layout/character_thumb_bg/cha_base_${getCardElement(element)}_${getCardElement(rarity)}.png`;

/**
 * Creates a card element based on the provided card data.
 * @param {Object} card - The card data.
 * @returns {HTMLElement} - The created card element.
 */
const createCardElement = (card) => {
  const cardItem = document.createElement('div');
  cardItem.classList.add('card');

  const element = getCardElement(card.element);
  const rarity = getCardRarity(card.rarity);

  cardItem.innerHTML = `
      <div class="card__container" style="background-image: url(${getCardBackground(card.element, card.rarity)})">
        <img src="${card.thumb}" alt="${card.name}" title="${card.name}" class="card__thumb" />
        <img src="${getCardRaritySrc(rarity)}" alt="${card.rarity}" class="card__rarity" />
        <img src="${getCardElementSrc(element)}" alt="${card.element}" class="card__element" />
        ${card.count ? (`<span class="card__count">${card.count}</span>`) : ''}
      </div>
    `;

  return cardItem;
};

/**
 * Initializes an element with the specified id if it doesn't already exist.
 * @param {string} id - The id of the element to initialize.
 */
const initId = (id) => {
  if (!document.getElementById(id)) {
    const summonList = document.createElement('div');
    summonList.id = id;
    summonList.classList.add('summon-list');
    document.body.appendChild(summonList);
  }
};

/**
 * Initializes the display of the summon list.
 * @returns {Promise<void>} A promise that resolves when all IDs have been successfully initialized.
 */
const initDisplaySummonList = async () => {
  try {
    await Promise.all([
      initId('summon-buttons'),
      initId('summon-result'), // summons results
      initId('summon-featuredSSRs'),
      initId('summon-nonFeaturedSSRs'),
      initId('cards-list'), // init cards list to load all thumbs
    ]);
  } catch (error) {
    console.error('An error occurred during the initialization of IDs:', error);
  }
};

/**
 * Creates a summon button element.
 *
 * @param {string} gashaId - The ID of the gasha.
 * @param {string} buttonText - The text to display on the button.
 * @param {string} action - The action associated with the button.
 * @returns {HTMLButtonElement} The created button element.
 */
const createSummonButton = (gashaId, buttonText, action) => {
  const button = document.createElement('button');
  button.id = `button-${action}-${gashaId}`;
  button.innerHTML = buttonText;
  button.classList.add('summon-button');
  button.onclick = () => {
    chrome.runtime.sendMessage({ action: `USER_${action.toUpperCase()}_SUMMON`, gashaId });
  };
  return button;
};

/**
 * Displays the summon buttons for a given gashaId.
 *
 * @param {string} gashaId - The ID of the gasha.
 * @returns {void}
 */
const displaySummonButtons = (gashaId) => {
  if (document.getElementById(`button-single-${gashaId}`) || document.getElementById(`button-multi-${gashaId}`)) {
    return;
  }
  const summonButtons = document.getElementById('summon-buttons');

  const buttonSingle = createSummonButton(gashaId, 'Single Summon', 'single');
  summonButtons.appendChild(buttonSingle);

  const buttonMulti = createSummonButton(gashaId, 'Multi Summon', 'multi');
  summonButtons.appendChild(buttonMulti);
};

/**
 * Displays a list of cards on the webpage.
 * @param {Object[]} cards - The list of cards to display.
 */
const displayCardsList = (id, cards, init = false) => {
  const cardsList = document.getElementById(id);
  if (init) { cardsList.innerHTML = ''; }
  cardsList.classList.add('cards-list');

  cards.forEach((card) => {
    const cardItem = createCardElement(card);
    cardsList.appendChild(cardItem);
  });
};

const displaySummonedCardsList = (cards, summonsCards, category, init = false) => {
  const cardsList = document.getElementById(`summon-${category}`);
  if (init) { cardsList.innerHTML = ''; }
  cardsList.classList.add('cards-list');
  cards.forEach((card) => {
    if (!summonsCards[card.id]) {
      return;
    }
    const cardItem = createCardElement(summonsCards[card.id]);
    cardsList.appendChild(cardItem);
  });
};

/**
 * Displays the summoned cards.
 *
 * @param {Object} cards - The object containing the summoned cards.
 * @param {Array} summonCards - The array of cards to be displayed.
 */
const displaySummonedCards = (cards, summonCards) => {
  const { featuredSSRs, nonFeaturedSSRs } = cards;
  displaySummonedCardsList(featuredSSRs, summonCards, 'featuredSSRs', true);
  displaySummonedCardsList(nonFeaturedSSRs, summonCards, 'nonFeaturedSSRs', true);
};

/**
 * Event listener for messages from the background script.
 * @param {Object} message - The message received from the background script.
 */
chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.action) {
    case 'BACKGROUND_SINGLE_SUMMON':
      displayCardsList('summon-result', message.result, true);
      break;
    case 'BACKGROUND_MULTI_SUMMON':
      displayCardsList('summon-result', message.result, true);
      break;
    case 'BACKGROUND_UPDATE_STORAGE': {
      const { summonCards, fetchedUrls } = message.storage;
      displaySummonedCards(fetchedUrls[message.gashaId], summonCards);
      break;
    }
    case 'REQUEST_INTERCEPTED_GASHA': {
      const { gashaId, data } = message;
      await initDisplaySummonList();
      displaySummonButtons(gashaId);
      displayCardsList('cards-list', [...data.featured_cards, ...data.normal_cards], true);
      break;
    }
    default:
      break;
  }
});
