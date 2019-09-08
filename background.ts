/**
 * This method opens chrome extension URL when extension is installed for the first time
 */
function install_notice() {
  // Check if the extension has been installed before then exit this function
  if (localStorage.getItem("install_time")) return;

  // Run this line of code if the install_time never exists
  const now = new Date().getTime();
  localStorage.setItem("install_time", String(now));
  const badgeText = "NEW";
  chrome.browserAction.setBadgeText({
    text: badgeText
  });
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tab => {
      // Get the tab Id
      const currentTabId = tab[0].id;
      const post_install_url = "https://google.com";
      chrome.tabs.update(currentTabId, { url: post_install_url });
    }
  );
}

install_notice();
