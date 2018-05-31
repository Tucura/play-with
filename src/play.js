/*
 * Create a M3U playlist file, paste the passed URL into it and download it.
 */
function download(url) {
  var filename = "stream.m3u";
  var content = "#EXTM3U\n" + url;
  var element = document.createElement('a');
  var mime = 'video/x-mpegurl';
  // this prevents FF from remembering to "always open with..."
  //element.setAttribute('download', filename);
  element.setAttribute('href', 'data:' + mime + ';charset=utf-8,' + encodeURIComponent(content));
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function messageListener(request, sender, sendResponse) {
  download(request.url);
}

/*
 * Register listener for message from background script.
 */
browser.runtime.onMessage.addListener(messageListener);

var keyBinding;
var modifier;

function keyListener(e) {
  var evtobj = window.event ? event : e;
  switch (modifier) {
    case "ctrl":
      modifierMatch = evtobj.ctrlKey;
      break;
    case "alt":
      modifierMatch = evtobj.altKey;
      break;
    case "shift":
      modifierMatch = evtobj.shiftKey;
      break;
    default:
      break;
  }
  if (evtobj.key == keyBinding && modifierMatch) download("TODO: insert url");
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  keyBinding = item.keyBinding;
  modifier = item.modifier;
  /*
   * Register listener for KeyboardEvent
   */
  document.onkeydown = keyListener;
  // document.body.style.border = "10px solid " + color;
}

var getting = browser.storage.local.get(["keyBinding", "modifier"]);
getting.then(onGot, onError);

