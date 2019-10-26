var tooltip = document.querySelector(".tooltip");
tooltip.innerHTML = "Add items to cart, go to your cart and click the icon";
var icon = document.querySelector(".image");
icon.addEventListener("click", function () {
    tooltip.innerHTML = 'Processing';
    chrome.runtime.sendMessage({ checkoutButtonClicked: true }, function () {
    });
});
icon.addEventListener('mouseover', function () {
    tooltip.classList.add('animate_in');
    tooltip.classList.remove('animate_out');
});
icon.addEventListener('mouseleave', function () {
    tooltip.classList.add('animate_out');
    tooltip.classList.remove('animate_in');
});
chrome.runtime.sendMessage({ checkIfIsCartPage: true }, function () {
});
// Listen to the message
chrome.runtime.onMessage.addListener(function (request) {
    if (request.isCartPage) {
        tooltip.innerHTML =
            "Hi you are on the cart page click the icon to checkout";
    }
});
//# sourceMappingURL=topbar.js.map