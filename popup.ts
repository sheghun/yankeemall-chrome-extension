/** This variable holds the MFA Bookmark URL. */
const BOOKMARK_URL = "https://checkout.mallforafrica.com/";
document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    removeUpdateNotification();
    chrome.tabs.sendMessage(currentTab.id, { isShopify: true }, function(obj) {
      if (!obj) {
        if (currentTab.url.match(/^chrome/)) {
          openNewTab(BOOKMARK_URL);
          return false;
        }
        // const host = currentTab.url.match(/([a-z0-9]+\.)?[a-z0-9][a-z0-9-]*(\.[a-z]{2,6})/g);
        const host = extractHost(currentTab.url);
        if (host) {
          if (!supportSites) {
            chrome.storage.local.get(["supportSites"], function(res) {
              supportSites =
                typeof res["supportSites"] == "string"
                  ? JSON.parse(res["supportSites"])
                  : res["supportSites"];
              handleHost(host);
            });
          } else {
            handleHost(host);
          }
        } else {
          openNewTab(BOOKMARK_URL);
        }
      }
    });
    resetBtnClickedVal(function() {
      setTimeout(function() {
        window.close();
      }, 1000);
    });
  });
});

/**
 * This method checks the host is in supportSites or not, if not, opens BOOKMARK_URL in new tab.
 * @param {string} host - host of the URL to be passed
 */
function handleHost(host) {
  if (typeof supportSites === "object") {
    if (Object.keys(supportSites).indexOf(host) == -1) {
      openNewTab(BOOKMARK_URL);
    }
  }
}
/**
 * This method is used to extract domain from URL.
 * @param {string} url - URL to be passed to extract domain.
 */
var extractDomain = function(url) {
  var domain;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split("/")[2];
  } else {
    domain = url.split("/")[0];
  }
  //find & remove port number
  domain = domain.split(":")[0];
  return domain;
};
/**
 * This method is used to extract host from URL.
 * @param {string} url - URL to be passed to extract host.
 */
function extractHost(url) {
  var domain;
  if (url.indexOf("://") > -1) {
    domain = url.split("/")[2];
  } else {
    domain = url.split("/")[0];
  }
  domain = domain.split(":")[0];
  var temp = domain.split(".").reverse();
  var host = temp[1];
  return host;
}
