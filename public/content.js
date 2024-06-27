const LABEL = {
  featuredSSRs: 'SSR détecteur',
  nonFeaturedSSRs: 'SSR hors détecteur',
};

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
 * Creates a section element with the specified id and title.
 *
 * @param {string} id - The id of the section element.
 * @param {string} title - The title of the section element.
 * @returns {HTMLElement} The created section element.
 */
const createSection = (id, title) => {
  const section = document.createElement('div');
  section.id = id;
  section.classList.add('section');
  section.innerHTML = `
      <img class="section__dragon-ball" src="../../../img/ui/dragon-ball-loader.png" alt="dragon-ball-loader">
      <span class="section__title">${title}</span>
      <img class="section__dragon-ball" src="../../../img/ui/dragon-ball-loader.png" alt="dragon-ball-loader">
  `;
  return section;
};

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
const initId = (id, target) => new Promise((resolve, reject) => {
  if (!document.getElementById(id)) {
    const summonList = document.createElement('div');
    summonList.id = id;
    summonList.classList.add('summon-list');
    target.appendChild(summonList);
    resolve();
  } else {
    reject(new Error(`Element with id ${id} already exists.`));
  }
});

const initSummonId = (id, target) => new Promise((resolve, reject) => {
  if (!document.getElementById(id)) {
    const summonList = document.createElement('div');
    summonList.id = id;
    summonList.innerHTML = `
      <div id="section-${id}"></div>
      <div id="summon-${id}"></div>
    `;
    target.appendChild(summonList);
    resolve();
  } else {
    reject(new Error(`Element with id ${id} already exists.`));
  }
});

/**
 * Initializes a section with the given id and title.
 * If a section with the given id does not exist,
 * it creates a new section and appends it to the 'summon-list' element.
 *
 * @param {string} id - The id of the section.
 * @param {string} title - The title of the section.
 */
const initSectionId = (id, target, title) => new Promise((resolve, reject) => {
  if (!document.getElementById(id)) {
    const section = createSection(id, title);
    target.appendChild(section);
    resolve();
  } else {
    reject(new Error(`Section with id ${id} already exists.`));
  }
});

/**
 * Removes an element from the DOM based on its ID.
 * @param {string} id - The ID of the element to be removed.
 */
const removeId = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
};

/**
 * Finds the animated image element for a given gasha ID.
 * @param {string} gashaId - The ID of the gasha.
 * @returns {Element|null} - The animated image element if found, or null if not found.
 */
const findAnimatedImgGasha = (gashaId) => {
  try {
    const gashaElement = document.getElementById(`gasha_${gashaId}`).parentNode.parentNode.children[2].children[3];
    return gashaElement;
  } catch (error) {
    return null;
  }
};

/**
 * Finds the static image element for a given gasha ID.
 * @param {string} gashaId - The ID of the gasha.
 * @returns {HTMLImageElement|null} - The image element if found, or null if not found.
 */
const findStaticImgGasha = (gashaId) => {
  try {
    const imgElement = document.querySelector(`img[src="../../../img/gashas/gashas_${gashaId}.png"]`);
    return imgElement.parentNode.parentNode.parentNode.children[2].children[3];
  } catch (error) {
    return null;
  }
};

/**
 * Initializes the display of the summon list.
 * @returns {Promise<void>} A promise that resolves when all IDs have been successfully initialized.
 */
const initDisplaySummonList = async (gashaId) => {
  const staticTarget = findStaticImgGasha(gashaId);
  const animatedTarget = findAnimatedImgGasha(gashaId);

  const target = staticTarget || animatedTarget;
  try {
    await Promise.all([
      initSectionId('section-summon', target, 'Summon Simulator'),
      initId('summon-stats', target),
      initId('summon-buttons', target),
      initId('summon-result', target), // summons results

      initSummonId('featuredSSRs', target),
      initSummonId('nonFeaturedSSRs', target),

      initId('cards-list', document.body), // init cards list to load all thumbs
    ]);
  } catch (error) {
    return false;
  }
  return true;
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

  const url = chrome.runtime.getURL(`assets/${action}_summon.webp`);

  button.style.backgroundImage = `url(${url})`;
  button.classList.add('summon-button', `summon-button__${action}`);
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
  if (cardsList && init) { cardsList.innerHTML = ''; }
  cardsList.classList.add('cards-list');

  cards.forEach((card) => {
    const cardItem = createCardElement(card);
    // add class to featured card
    if (card?.featured && card.rarity === 3) {
      cardItem.classList.add('card--featured');
    }
    cardsList.appendChild(cardItem);
  });
};

const displaySummonedCardsList = (cards, summonsCards, category, init = false) => {
  const cardsList = document.getElementById(`summon-${category}`);
  if (cardsList && init) { cardsList.innerHTML = ''; }

  if (!document.getElementById(`section-${category}`)?.firstChild) {
    const section = createSection(`section-${category}`, LABEL[category]);
    const sectionContainer = document.getElementById(`section-${category}`);
    if (sectionContainer) { sectionContainer.appendChild(section); }
  }

  if (cardsList) {
    cardsList.classList.add('cards-list');
    cards.forEach((card) => {
      if (!summonsCards[card.id]) {
        return;
      }
      const cardItem = createCardElement(summonsCards[card.id]);
      cardsList.appendChild(cardItem);
    });
  }
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
 * Displays the summon statistics on the page.
 *
 * @param {number} totalMulti - The total number of multi summons.
 * @param {number} totalSingle - The total number of single summons.
 * @param {number} totalDs - The total number of dragon stones used.
 */
const displaySummonStats = (totalMulti, totalSingle, totalDs) => {
  const dsImg = chrome.runtime.getURL('assets/ds.webp');
  const summonStats = document.getElementById('summon-stats');

  summonStats.innerHTML = `
    <div class="summon-stats__wrapper">
      <div class="summon-stats">
        <div class="summon-stats__row">
          <span class="summon-stats__title">Single: </span>
          <span class="summon-stats__value">${totalSingle}</span>
        </div>
        <div class="summon-stats__row">
          <span class="summon-stats__title">Multi: </span>
          <span class="summon-stats__value">${totalMulti}</span>
        </div>
      </div>
      <div class="summon-stats">
        <div class="summon-stats__row" id="summon-button-reset">
        </div>
        <div class="summon-stats__row">
          <img src="${dsImg}" class="summon-stats__img" />
          <span class="summon-stats__ds">${totalDs}</span>
        </div>
      </div>
    </div>
  `;
};

/**
 * Displays a reset button for a summon.
 * @param {string} gashaId - The ID of the summon.
 */
const displaySummonResetButton = (gashaId) => {
  const summonButtonReset = document.getElementById('summon-button-reset');
  const buttonReset = document.createElement('button');
  buttonReset.innerHTML = 'Reset';
  buttonReset.id = 'button-reset';
  buttonReset.classList.add('summon-button', 'summon-button__reset');
  buttonReset.onclick = () => {
    chrome.runtime.sendMessage({ action: 'USER_RESET_SUMMONS', gashaId });
  };

  summonButtonReset.appendChild(buttonReset);
};

/**
 * Event listener for messages from the background script.
 * @param {Object} message - The message received from the background script.
 */
chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.action) {
    case 'BACKGROUND_SINGLE_SUMMON':
      await initDisplaySummonList(message.gashaId);
      displayCardsList('summon-result', message.result, true);
      break;
    case 'BACKGROUND_MULTI_SUMMON':
      await initDisplaySummonList(message.gashaId);
      displayCardsList('summon-result', message.result, true);
      break;
    case 'BACKGROUND_UPDATE_STORAGE': {
      const {
        fetchedUrls,
      } = message.storage;
      const {
        totalMultiSummons,
        totalSingleSummons,
        totalDS,
        summonCards,
      } = message.storage[message.gashaId];

      displaySummonStats(totalMultiSummons, totalSingleSummons, totalDS, message.gashaId);
      if (totalDS !== 0) {
        displaySummonResetButton(message.gashaId);
        displaySummonedCards(fetchedUrls[message.gashaId], summonCards);
      }
      break;
    }

    case 'REQUEST_INTERCEPTED_GASHA': {
      const { gashaId } = message;

      await initDisplaySummonList(gashaId);
      displaySummonButtons(gashaId);
      displaySummonStats(0, 0, 0);
      break;
    }

    case 'BACKGROUND_RESET_SUMMONS': {
      displayCardsList('summon-result', [], true);
      removeId('summon-result');
      removeId('featuredSSRs');
      removeId('nonFeaturedSSRs');
      break;
    }
    default:
      break;
  }
});
