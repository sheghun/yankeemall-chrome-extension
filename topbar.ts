const button = document.querySelector(".yankeemall_check_out_button") as HTMLButtonElement;
const textEl = document.querySelector(".text") as HTMLSpanElement;

button.addEventListener("click", function () {
    chrome.runtime.sendMessage({checkoutButtonClicked: true}, function () {
    });
    textEl.innerText = 'Processing';
    button.innerHTML = `<img src="images/loader.svg" height="40px"/>`;

    setTimeout(() => {
        textEl.innerText = 'Transferring your cart to eromalls';
        setTimeout(() => {
            textEl.innerText = 'Please hold on a sec while we get all the items';
            setTimeout(() => {
                textEl.innerText = 'Transferring your cart to eromalls';
            }, 5000)
        }, 5000)
    }, 5000)
});

chrome.runtime.sendMessage({checkIfIsCartPage: true}, function () {
});

// Listen to the message
chrome.runtime.onMessage.addListener(function (request) {
    if (request.isCartPage) {
        button.innerText = 'Checkout';
        textEl.innerText = 'Click the button to checkout';
    }
});
