/**
 * Contains the list of supported sites
 * Gotten from the backend
 */
import local = chrome.storage.local;

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
const sitesUrl = "http://api.yankeemall.ng/sites";
/**
 *
 */
const cacheTime = 10800000; // 3 hours
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
        setTopBar();
    })();

    // setTopBar();
}

/**
 * Responsible for retrieving the list of supported sites
 * @returns {Array<string>} - `The list of supported sites`
 */
function loadSites() {
    return new Promise((resolve, reject) => {
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
 * Responsible for setting the popover bar that appears on the page
 */
function setTopBar() {
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
    iframe.style.height = "64px";
    iframe.style.opacity = "1";
    // Check if the site supported
    if (siteIsSupported()) {
        // Append Iframe to the body
        const body = document.querySelector("body");
        body.append(iframe);
    }
}

function removeTopBar() {
    // Get the iframe
    const iframe = document.querySelector("#" + yankeemallIframeId);
    iframe.parentNode.removeChild(iframe);
}

/**
 * For retrieving the cartUrl of the specified host
 * @param {string} host location.host
 */
function getCartUrl(host: string) {
    // Check if the host is supported
    // host = supportedSites.map();
    // if (supportedSites[host]) {
    // }
}

function siteIsSupported() {
    // Check if the site is supported then set top bar
    return !!supportedSites.find(s => !!location.host.match(s.host));
}
