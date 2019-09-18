/**
 * Contains the list of supported sites
 * Gotten from the backend
 */
let supportedSites = [] as Array<{
    id: number;
    host: string;
    domains: string[];
    cartUrls: string[];
}>;
/**
 * The string for the extension iframe id
 */
const yankeemallIframeId = "yankeemall_iframe";
/**
 * The string for the extension checkout button Id
 */
const yankeemallCheckoutButtonId = "yankeemall_checkout_button";
/**
 * CrawlUrl used to retrieve the list of sites
 */
// const sitesUrl = "http://api.yankeemall.ng/sites";
const sitesUrl = "http://localhost:8080/sites";
/**
 *
 */
const cacheTime = 10800000; // 3 hours

/**
 * The next code you see is used to handle
 * Incoming messages from the background script
 *
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.processCartPage) {
        sendResponse();
    }
});

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    initializeExtension();
});

/**
 * Responsible for starting the initialization of the extension of the plugin
 */
function initializeExtension() {
    // Load the sites
    (async () => {
        await loadSites();
        await setTopBar();
        // Check if the site supported then
        // Append the event listener to the check out button
        if (siteIsSupported()) {
            // @ts-ignore
            const res = await axios.get(chrome.runtime.getURL("topbar.html"));

            const iframeDocuments = new DOMParser().parseFromString(
                res.data,
                "text/html"
            );
            // Get the checkout button and append the event listener
            const checkoutButton: HTMLButtonElement = iframeDocuments.querySelector(
                "#" + yankeemallCheckoutButtonId
            );
            if (checkoutButton) {
            }
        }
    })();
}

/**
 * Responsible for retrieving the list of supported sites
 * @returns {Array<string>} - `The list of supported sites`
 */
function loadSites() {
    return new Promise((resolve, _) => {
        /**
         * Try to check if the data has been stored
         * Retrieve the last ajax request time
         */
        chrome.storage.sync.get("lastRequestTime", async function(obj) {
            async function requestForSites() {
                // @ts-ignore
                const res = await axios.get(sitesUrl);
                if (res.status === 200) {
                    return res.data;
                }
            }
            // Check if the time has been saved before
            if (obj["lastRequestTime"] !== undefined) {
                // calculate the time
                const elapsedTime =
                    Number(Date.now()) - Number(obj["lastRequestTime"]);
                if (elapsedTime > cacheTime) {
                    // Fetch the sites from the server
                    try {
                        supportedSites = await requestForSites();
                    } catch (e) {}
                    // Set the retrieved sites as the sites data

                    chrome.storage.sync.set({ sites: supportedSites });
                    resolve();
                } else {
                    // Means the time has not been elapsed fetch the already stored data
                    chrome.storage.sync.get("sites", function(sites) {
                        if (sites["sites"] !== undefined) {
                            supportedSites = sites["sites"];
                            resolve();
                        }
                    });
                }
            } else {
                // Fetch the sites from the server
                try {
                    supportedSites = await requestForSites();
                } catch (e) {}
                // Set the retrieved sites as the sites data
                chrome.storage.sync.set({ sites: supportedSites });
                // Set the lastRequestTime
                chrome.storage.sync.set({ lastRequestTime: Date.now() });
                resolve();
            }
        });
    });
}

/**
 * Responsible for setting the topbar that appears on the page
 */
async function setTopBar() {
    // Check if the site supported
    if (!siteIsSupported()) {
        return;
    }
    // Create the iframe
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("topbar.html");
    iframe.id = yankeemallIframeId;
    iframe.style.position = "fixed";
    iframe.style.top = "0px";
    iframe.style.left = "0px";
    iframe.style.zIndex = "1000000000000000000";
    iframe.style.width = "100%";
    // iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.maxHeight = "64px";
    iframe.style.opacity = "1";
    // Append Iframe to the body
    const body = document.querySelector("body");
    body.style.marginTop = "64px";
    body.append(iframe);
}

/**
 * Responsible for removing the topbar that
 */
function removeTopBar() {
    // Get the iframe
    const iframe = document.querySelector("#" + yankeemallIframeId);
    iframe.parentNode.removeChild(iframe);
}

/**
 * The Check out button event listener
 */
function checkoutHandler() {
    alert("clicked");
}

/**
 * For retrieving the cartUrl of the specified host
 * @param {string} host location.host
 */
function getCartUrl(host: string) {
    // Check if the host is supported
    if (siteIsSupported()) {
    }
}

/**
 * To check if the current site is supported
 */
function siteIsSupported() {
    // Check if the site is supported then set top bar
    return !!supportedSites.find(s => !!location.host.match(s.host));
}

/**
 * For navigating to the cart page
 */
function goToCartPage() {}
