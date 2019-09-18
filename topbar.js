var button = document.querySelector("#yankeemall_checkout_button");
button.addEventListener("click", function () {
    chrome.runtime.sendMessage({ checkoutButtonClicked: true }, function () { });
});
//# sourceMappingURL=topbar.js.map