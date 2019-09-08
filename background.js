/**
 * This method opens chrome extension URL when extension is installed for the first time
 */
function install_notice() {
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
install_notice();
//# sourceMappingURL=background.js.map