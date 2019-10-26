const tooltip = document.querySelector(".tooltip");
tooltip.innerHTML = "Add items to cart, go to your cart and click the icon";
const icon = document.querySelector(".image") as HTMLImageElement;

icon.addEventListener("click", function () {
    tooltip.innerHTML = 'Processing';
    icon.style.width = '65px';
    chrome.runtime.sendMessage({checkoutButtonClicked: true}, function () {
    });
});

icon.addEventListener('mouseover', () => {
    tooltip.classList.add('animate_in');
    tooltip.classList.remove('animate_out')
});

icon.addEventListener('mouseleave', () => {
    tooltip.classList.add('animate_out');
    tooltip.classList.remove('animate_in');
});


chrome.runtime.sendMessage({checkIfIsCartPage: true}, function () {
});

// Listen to the message
chrome.runtime.onMessage.addListener(function (request) {
    if (request.isCartPage) {
        tooltip.innerHTML =
            "Hi you are on the cart page click the icon to checkout";
    }
});
