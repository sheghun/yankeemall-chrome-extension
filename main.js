/**
 * Contains the list of supported sites
 * Gotten from the backend
 */
var supportedSites = [];
/**
 * The string for the extension iframe id
 */
var yankeemallIframeId = "yankeemall_iframe";
/**
 * CrawlUrl used to retrieve the list of sites
 */
var sitesUrl = "https://";
/**
 *
 */
var cacheTime = 10800000; // 3 hours
// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    initializeExtension();
});
/**
 * Responsible for starting the initialization of the extension of the plugin
 */
function initializeExtension() {
    // Load the sites
    supportedSites = loadSites();
    setTopBar();
}
/**
 * Responsible for retrieving the list of supported sites
 * @returns {Array<string>} - `The list of supported sites`
 */
function loadSites() {
    /**
     * Try to check if the data has been stored
     * Retrieve the last ajax request time
     */
    chrome.storage.local.get("time", function (obj) {
        function requestForSites() {
            // @ts-ignore
            axios.get(sitesUrl)
                .then(function (res) { })
                .catch(function (err) { });
        }
        // Check if the time has been saved before
        if (obj["time"] !== undefined) {
            // calculate the time
            var elapsedTime = Number(Date.now()) - Number(obj["time"]);
            if (elapsedTime > cacheTime) {
            }
            return;
        }
        // Ajax request has not been sent, send it
    });
    return [];
}
/**
 * Responsible for setting the popover bar that appears on the page
 */
function setTopBar() {
    // Create the iframe
    var iframe = document.createElement("iframe");
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
    // Append Iframe to the body
    var body = document.querySelector("body");
    body.append(iframe);
}
function removeTopBar() {
    // Get the iframe
    var iframe = document.querySelector("#" + yankeemallIframeId);
    iframe.parentNode.removeChild(iframe);
}