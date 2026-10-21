chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'open-extension-settings') {
    chrome.tabs.create({
      url: `chrome://extensions/?id=${chrome.runtime.id}`,
    });
  }
});