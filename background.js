/** This variable is used for tracking popups shown in tabs. */
var popupsShowInTabs = {};
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
    if (request.checkoutButtonClicked) {
        // Send message to process cart page
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { processCartPage: true }, function () { });
        });
    }
    else if (request.saveCartItems) {
        // Save the cart items
        chrome.storage.sync.set({ cart: request.cart }, function () {
            openNewTab("http://localhost:8080/checkout");
        });
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
 * Listens when tabs are created
 */
chrome.tabs.onCreated.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {
        tabClose: true
    }, function () { });
});
/**
 * Listens when tabs are removed or closed
 */
chrome.tabs.onRemoved.addListener(function (tabs) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tab) {
        var currentTabId = tab[0].id;
        chrome.tabs.sendMessage(currentTabId, {
            tabClose: true
        }, function () { });
    });
    // Remove the tabs from the list of tabs
    if (popupsShowInTabs.hasOwnProperty(tabs)) {
        delete popupsShowInTabs[tabs];
    }
    if (loginPopupsShowInTabs.hasOwnProperty(tabs)) {
        delete loginPopupsShowInTabs[tabs];
    }
});
/**
 * Listens when tabs are updated
 * i.e when the url in a tab is set
 */
chrome.tabs.onUpdated.addListener(function (tab) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tab) {
        var currentTabId = tab[0].id;
        chrome.tabs.sendMessage(currentTabId, {
            tabClose: true
        }, function () { });
    });
});
/**
 * This method is used to extract domain from URL.
 * @param {string} url - url from which domain is extracted
 */
function extractRootDomain(url) {
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split("/")[2];
    }
    else {
        domain = url.split("/")[0];
    }
    domain = domain.split(":")[0];
    var temp = domain.split(".").reverse();
    return temp[1] + "." + temp[0];
}
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
function resetBtnClickedVal(callback) {
    isBtnClicked = true;
    if (typeof callback == "function") {
        callback();
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
/**
 *
 * @param {string} needle to check
 * @param {object} haystack object to search
 * @param {boolean} argStrict if it has to be strictly checked
 */
function inArray(needle, haystack, argStrict) {
    var strict = !!argStrict;
    if (strict) {
        for (var key in haystack) {
            if (haystack.hasOwnProperty(key)) {
                if (haystack[key] === needle) {
                    return true;
                }
            }
        }
    }
    else {
        for (var key in haystack) {
            if (haystack.hasOwnProperty(key)) {
                if (haystack[key] == needle) {
                    return true;
                }
            }
        }
    }
    return false;
}
installNotice();
extensionVersion();
setUpdateNotification();
//# sourceMappingURL=background.js.map