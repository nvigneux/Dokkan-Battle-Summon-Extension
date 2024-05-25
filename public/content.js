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
        <img src="${getCardElementSrc(element)}" alt="${card.element}" class="card__element"
      </div>
    `;

  return cardItem;
};

/**
 * Displays a list of cards on the webpage.
 * @param {Object[]} cards - The list of cards to display.
 */
const displayCardsList = (id, cards) => {
  let cardsList = null;
  if (!document.getElementById(id)) {
    cardsList = document.createElement('div');
  } else {
    cardsList = document.getElementById(id);
    cardsList.innerHTML = '';
  }
  cardsList.id = id;
  cardsList.classList.add('cards-list');
  document.body.appendChild(cardsList);

  cards.forEach((card) => {
    const cardItem = createCardElement(card);
    cardsList.appendChild(cardItem);
  });
};

const displaySummonButtons = (gashaId) => {
  if (document.getElementById(`button-single-${gashaId}`) || document.getElementById(`button-multi-${gashaId}`)) {
    return;
  }

  const buttonSingle = document.createElement('button');
  buttonSingle.id = `button-single-${gashaId}`;
  buttonSingle.innerHTML = 'Single Summon';
  buttonSingle.classList.add('summon-button');
  buttonSingle.onclick = () => {
    chrome.runtime.sendMessage({ action: 'USER_SINGLE_SUMMON', gashaId });
  };
  document.body.appendChild(buttonSingle);

  const buttonMulti = document.createElement('button');
  buttonMulti.id = `button-multi-${gashaId}`;
  buttonMulti.innerHTML = 'Multi Summon';
  buttonMulti.classList.add('summon-button');
  buttonMulti.onclick = () => {
    chrome.runtime.sendMessage({ action: 'USER_MULTI_SUMMON', gashaId });
  };
  document.body.appendChild(buttonMulti);
};

/**
 * Event listener for messages from the background script.
 * @param {Object} message - The message received from the background script.
 */
chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case 'BACKGROUND_UPDATE_COUNT':
      // console.log('Received update count from background', message);
      break;
    case 'BACKGROUND_SINGLE_SUMMON':
      console.log('Received single summon from background', message.result);
      displayCardsList('summon-list', message.result);
      break;
    case 'BACKGROUND_MULTI_SUMMON':
      console.log('Received single summon from background', message.result);
      displayCardsList('summon-list', message.result);
      break;
    case 'BACKGROUND_UPDATE_STORAGE':
      console.log('Received storage update from background', message);
      break;
    case 'REQUEST_INTERCEPTED_GASHA': {
      const { gashaId, data } = message;
      console.log('Received request intercepted from background', message);

      displaySummonButtons(gashaId);
      displayCardsList('cards-list', [...data.featured_cards, ...data.normal_cards]);
    }
      break;
    default:
      // Handle other actions here
      break;
  }
});
