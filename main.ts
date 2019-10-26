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
 * CrawlUrl used to retrieve the list of sites
 */
// const baseUrl = "http://localhost:8080"
const baseUrl = "https://api.yankeemall.ng";
const sitesUrl = `${baseUrl}/base/sites`;
/**
 *  Checkout Url to check out the
 */
const checkoutUrl = "http://www.eromalls.com/checkout";
/**
 * Url used to process items on cartPage
 */
const processUrl = `${baseUrl}/extension/process`;
/**
 *
 */
const cacheTime = 10800000; // 3 hours

/**
 * The next code you see is used to handle
 * Incoming messages from the background script
 *
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.processCartPage) {
        processCartPage();
        sendResponse();
    } else if (request.checkIfIsCartPage) {
        console.log(request);
        sendResponse(isCartPage());
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
        console.log("working");
        await loadSites();
        await setTopBar();
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
        chrome.storage.sync.get("lastRequestTime", async function (obj) {
            console.log('[LAST REQUEST TIME', obj);

            async function requestForSites() {
                // @ts-ignore
                const res = await axios.get(sitesUrl);
                console.log('[REQUEST FOR SITES]');
                if (res.status === 200 && res.data.status === "success") {
                    return res.data.data;
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
                        console.log('[TRY FETCH"ING SUPPORTED SITES IF ELAPSED TIME IS MORE THAN CACHE TIME]', supportedSites);
                        // Check if response is received from the server or else just fetch from the cache
                        if (supportedSites.length > 0) {
                            // Set the retrieved sites as the sites data
                            chrome.storage.sync.set({sites: supportedSites});
                            chrome.storage.sync.set({lastRequestTime: Date.now()});
                        } else {
                            chrome.storage.sync.get("sites", function (sites) {
                                console.log('[SITES FROM STORAGE]', sites);
                                if (sites["sites"] !== undefined) {
                                    supportedSites = sites["sites"];
                                    resolve();
                                }
                            });
                        }

                    } catch (e) {
                    }
                    resolve();
                } else {
                    // Means the time has not been elapsed fetch the already stored data
                    chrome.storage.sync.get("sites", function (sites) {
                        console.log('[SITES FROM STORAGE]', sites);
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
                    console.log('TRY FETCHING SITES IF LAST REQUEST TIME DOES NOT EXISTS', supportedSites)
                } catch (e) {
                }
                if (supportedSites.length > 0) {
                    // Set the retrieved sites as the sites data
                    chrome.storage.sync.set({sites: supportedSites}, () => {
                        // Set the lastRequestTime
                        chrome.storage.sync.set(
                            {lastRequestTime: Date.now()},
                            () => {
                            }
                        );
                    });
                }

                resolve();
            }
        });
    });
}

/**
 * Responsible for setting the top bar that appears on the page
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
    iframe.style.top = "20vh";
    iframe.style.left = "86vw";
    iframe.style.zIndex = "1000000000000000000";
    iframe.style.width = "14vw";
    // iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.opacity = "1";
    // Append Iframe to the body
    const body = document.querySelector("body");
    body.append(iframe);
}

/**
 * Responsible for removing the top bar that
 */
function removeTopBar() {
    // Get the iframe
    const iframe = document.querySelector("#" + yankeemallIframeId);
    iframe.parentNode.removeChild(iframe);
}

/**
 * Sends the cart details to the api
 */
async function sendCartDetailsToApi(html: string) {
    // Send to the api
    try {
        // Get the site info
        const siteInfo = getCurrentSiteInfo();
        console.log('[SEND CART DETAILS SITE INFO]', siteInfo);
        const data = {
            html,
            host: siteInfo.host
        };
        // Arrange the data to send;
        try {
            // @ts-ignore
            const res = await axios.post(processUrl, data);
            console.log('[SEND CART DETAILS SITE INFO]', res);
            if (res.status === 200) {
                // Send the message to the extension to save it cart details
                if (res.data.status === "success") {
                    chrome.storage.sync.set(
                        {cart: res.data.data},
                        function () {
                            sessionStorage.setItem(
                                "yankeeMallData",
                                JSON.stringify(res.data.data)
                            );
                            const win = window.open(
                                `${checkoutUrl}?yankeemallData=${res.data.data}`,
                                "_blank"
                            );
                            win.focus();
                        }
                    );
                }
            }
        } catch (e) {
            if (e.response) {
            }
        }
    } catch (e) {
    }
}

/**
 * Check if the current page is the cart page if it isn't it navigates to the cart page
 * get's the html content of cart page and sends them to the server for processing
 */
function processCartPage() {
    // Check current page is cart page
    if (!isCartPage()) {
        goToCartPage();
        return;
    }
    // Get the body element
    const content = document.querySelector("body");
    const html = "<body>" + content.innerHTML + "</body>";
    (async () => {
        await sendCartDetailsToApi(html);
    })();
}

/**
 * For retrieving the cartUrl of the specified host
 */
function getCurrentSiteInfo() {
    // Check if the host is supported
    if (!siteIsSupported()) {
        return null;
    }
    const site = supportedSites.find(s => location.host.match(s.host));
    if (!site) {
        return null;
    }
    return site;
}

/**
 * To check if the current site is supported
 */
function siteIsSupported(): boolean {
    // Check if the site is supported then set top bar
    return !!supportedSites.find(s => !!location.host.match(s.host));
}

/**
 * Check if cart page
 */
function isCartPage(): boolean {
    const {cartUrls} = getCurrentSiteInfo();
    for (let cartUrl of cartUrls) {
        const pathname = location.pathname === "/" ? "" : location.pathname;
        const fullUrl = location.origin + pathname;
        if (cartUrl === fullUrl) {
            return true;
        }
    }
    return false;
}

/**
 * For navigating to the cart page
 */
function goToCartPage() {
    const site = getCurrentSiteInfo();
    location.href = site.cartUrls[0] + location.search;
}
