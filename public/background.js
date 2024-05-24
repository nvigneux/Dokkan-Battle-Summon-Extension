const initStorage = { count: 0 };

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'USER_CLICKED':
      chrome.storage.local.get().then((res) => {
        const newRes = { ...initStorage, ...res, count: res.count += 1 };
        sendResponse({ ...newRes });
        sendTabsMessage({ action: 'UPDATE_COUNT', newRes });
        chrome.storage.local.set({ ...newRes });
      });
      break;
    default:
      // Handle other actions here
      break;
  }
  return true; // Required to keep promise
});
