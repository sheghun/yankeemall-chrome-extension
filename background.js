/** This variable is used for tracking popups shown in tabs. */
var popupsShowInTabs = {};
var eromallsWelcome = 'http://eromalls.com';
var loginPopupsShowInTabs = {};
/** This variable is used for finding Checkout button on top bar is clicked or not. */
var isBtnClicked = false;
/**
 * This function opens new tab
 * @param {string} url - url to be opened.
 */
function openNewTab(url) {
    chrome.tabs.create({
        url: url
    }, function () { });
}
/**
 * Extension Message listener listens to incoming message from the content_scripts
 * @param {Object} request - an object received from caller
 * @param {string} sender - caller
 * @param {string} sendResponse - sendResponse is an acknowledgement
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.checkoutButtonClicked) {
        // Send message to process cart page
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { processCartPage: true }, function () { });
        });
    }
    else if (request.checkIfIsCartPage) {
        console.log(sender);
        // send message to main.ts to know if its cart page
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { checkIfIsCartPage: true }, function (isCartPage) {
                if (isCartPage) {
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { isCartPage: true }, function () { });
                    });
                }
            });
        });
    }
    else if (request.popUpClicked) {
        removeUpdateNotification();
        openNewTab(eromallsWelcome);
    }
});
/**
 * External Message listener listens to incoming message from external extensions
 * @param {Object} request - an object received from caller
 * @param {string} sender - caller
 * @param {string} sendResponse - sendResponse is an acknowledgement
 */
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    if (request) {
        if (request.hasOwnProperty("installedExtension")) {
            var version = chrome.runtime.getManifest().version;
            sendResponse({
                version: version
            });
        }
    }
    else if (request.retrieveCartString) {
        chrome.storage.sync.get("cart", function (_a) {
            var cart = _a.cart;
            if (cart !== null && typeof cart === "string") {
                sendResponse(cart);
            }
        });
    }
    return true;
});
/**
 * This method opens chrome extension URL when extension is installed for the first time
 */
function installNotice() {
    // Check if the extension has been installed before then exit this function
    if (localStorage.getItem("install_time"))
        return;
    // Run this line of code if the install_time never exists
    var now = new Date().getTime();
    localStorage.setItem("install_time", String(now));
    var badgeText = "NEW";
    chrome.browserAction.setBadgeText({
        text: badgeText
    });
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tab) {
        // Get the tab Id
        var currentTabId = tab[0].id;
        var post_install_url = "https://google.com";
        chrome.tabs.update(currentTabId, { url: post_install_url });
    });
}
/**
 * This method gets the version of extension when installed
 */
function extensionVersion() {
    if (localStorage.getItem("last_installed_version")) {
        return localStorage.getItem("last_installed_version");
    }
}
/**
 * This method changes the toolbar icon if version is updated
 */
function setUpdateNotification() {
    var current_version = extensionVersion(), updated_version = chrome.runtime.getManifest().version;
    if (current_version != updated_version) {
        var txt = "NEW";
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#f81523"
        });
        chrome.browserAction.setBadgeText({
            text: txt
        });
    }
    setTimeout(setUpdateNotification, 10000);
}
/**
 * This method removes the notification icon to default icon after its updated an when user clicks on toolbar icon
 * Also updates last_installed_version variable to the last latest version updated to.
 */
function removeUpdateNotification() {
    chrome.browserAction.setBadgeText({
        text: ""
    });
    var last_installed_version = chrome.runtime.getManifest().version;
    localStorage.setItem("last_installed_version", last_installed_version);
}
installNotice();
extensionVersion();
setUpdateNotification();
//# sourceMappingURL=background.js.map