/*
 * Workaround for issue #1/upstream bug 1465458
 */
var firstRunElapsed;

function onError(error) {
  console.log(`Error: ${error}`);
  firstRunElapsed = false;
}

/*
 * Chrome callback handling
 */
function onGot(item) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    firstRunElapsed = item.firstRunElapsed || false;
  }
}

chrome.storage.local.get(["firstRunElapsed"], onGot);

/*
 * Create a M3U playlist file, paste the passed URL into it and download it.
 */
function download(request, sender, sendResponse) {
  var content = "#EXTM3U\n" + request.url;
  var element = document.createElement('a');
  var mime = 'video/x-mpegurl';

  if (!firstRunElapsed) {
    // this prevents FF from remembering to "always open with..."
    var filename = "stream.m3u";
    element.setAttribute('download', filename);
    chrome.storage.local.set({
      firstRunElapsed: true
    });
  }

  element.setAttribute('href', 'data:' + mime + ';charset=utf-8,' + encodeURIComponent(content));
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/*
 * Register listener for message from background script.
 */
chrome.runtime.onMessage.addListener(download);
