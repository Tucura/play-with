/*
 * Hand the URL of the current tab over to the content script.
 * TODO: user feedback for 'bad' URLs
 */
function invoke(info, tab) {
  var url = tab.url;
  if (info) {
    url = info.linkUrl || info.srcUrl;
  }
  console.log("play-with attempting to play url " + url);
  chrome.tabs.sendMessage(tab.id, {url: url});
}

/*
 * Create the context menu for links.
 */
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      id: "play-with",
      title: chrome.i18n.getMessage("actionName"),
      contexts: ["link", "video"]
    });
});

/*
 * Register listener for the button.
 */
chrome.browserAction.onClicked.addListener((tab) => {
  invoke(null, tab);
});

/*
 * Register listener for the context menu.
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  invoke(info, tab);
});
