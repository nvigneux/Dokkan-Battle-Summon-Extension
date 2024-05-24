/**
 * Registers a click event listener on the window object.
 * @param {Function} listener - The callback function to be executed when a click event occurs.
 */
function registerClickListener(listener) {
  window.addEventListener('click', listener);
}

/**
 * Sends a message to the background script indicating that the user has clicked.
 */
function countClicks() {
  chrome.runtime.sendMessage({ action: 'USER_CLICKED' }, async (response) => {
    console.log('received clicked from background sendResponse', response);
  });
}

registerClickListener(countClicks);

chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case 'UPDATE_COUNT':
      console.log('received update count from background', message);
      break;
    default:
      // Handle other actions here
      break;
  }
});
