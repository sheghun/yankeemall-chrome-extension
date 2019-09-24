const button = document.querySelector("#yankeemall_checkout_button");
button.addEventListener("click", function() {
    chrome.runtime.sendMessage({ checkoutButtonClicked: true }, function() {});
});

// Listen to the message
chrome.runtime.onMessage.addListener(function(request) {
    if (request.processCartPage) {
        button.innerHTML = "Processing";
    }
});
