var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
// const baseUrl = "http://localhost:8080"
var baseUrl = "https://api.yankeemall.ng";
var sitesUrl = baseUrl + "/base/sites";
/**
 *  Checkout Url to check out the
 */
var checkoutUrl = "http://www.eromalls.com/checkout";
/**
 * Url used to process items on cartPage
 */
var processUrl = baseUrl + "/extension/process";
/**
 *
 */
var cacheTime = 10800000; // 3 hours
/**
 * The next code you see is used to handle
 * Incoming messages from the background script
 *
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.processCartPage) {
        processCartPage();
        sendResponse();
    }
    else if (request.checkIfIsCartPage) {
        console.log(request);
        sendResponse(isCartPage());
    }
});
// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    initializeExtension();
});
/**
 * Responsible for starting the initialization of the extension of the plugin
 */
function initializeExtension() {
    var _this = this;
    // Load the sites
    (function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("working");
                    return [4 /*yield*/, loadSites()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, setTopBar()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })();
}
/**
 * Responsible for retrieving the list of supported sites
 * @returns {Array<string>} - `The list of supported sites`
 */
function loadSites() {
    return new Promise(function (resolve, _) {
        /**
         * Try to check if the data has been stored
         * Retrieve the last ajax request time
         */
        chrome.storage.sync.get("lastRequestTime", function (obj) {
            return __awaiter(this, void 0, void 0, function () {
                function requestForSites() {
                    return __awaiter(this, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, axios.get(sitesUrl)];
                                case 1:
                                    res = _a.sent();
                                    console.log('[REQUEST FOR SITES]');
                                    if (res.status === 200 && res.data.status === "success") {
                                        return [2 /*return*/, res.data.data];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
                var elapsedTime, e_1, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('[LAST REQUEST TIME', obj);
                            if (!(obj["lastRequestTime"] !== undefined)) return [3 /*break*/, 7];
                            elapsedTime = Number(Date.now()) - Number(obj["lastRequestTime"]);
                            console.log('ELAPSED TIME', elapsedTime);
                            if (!cacheTime) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, requestForSites()];
                        case 2:
                            supportedSites = _a.sent();
                            console.log('[TRY FETCHING SUPPORTED SITES IF ELAPSED TIME IS MORE THAN CACHE TIME]', supportedSites);
                            // Check if response is received from the server or else just fetch from the cache
                            if (supportedSites.length > 0) {
                                // Set the retrieved sites as the sites data
                                chrome.storage.sync.set({ sites: supportedSites });
                                chrome.storage.sync.set({ lastRequestTime: Date.now() });
                            }
                            else {
                                chrome.storage.sync.get("sites", function (sites) {
                                    console.log('[SITES FROM STORAGE]', sites);
                                    if (sites["sites"] !== undefined) {
                                        supportedSites = sites["sites"];
                                        resolve();
                                    }
                                });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            resolve();
                            return [3 /*break*/, 6];
                        case 5:
                            // Means the time has not been elapsed fetch the already stored data
                            chrome.storage.sync.get("sites", function (sites) {
                                console.log('[SITES FROM STORAGE]', sites);
                                if (sites["sites"] !== undefined) {
                                    supportedSites = sites["sites"];
                                    resolve();
                                }
                            });
                            _a.label = 6;
                        case 6: return [3 /*break*/, 11];
                        case 7:
                            _a.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, requestForSites()];
                        case 8:
                            supportedSites = _a.sent();
                            console.log('TRY FETCHING SITES IF LAST REQUEST TIME DOES NOT EXISTS', supportedSites);
                            return [3 /*break*/, 10];
                        case 9:
                            e_2 = _a.sent();
                            return [3 /*break*/, 10];
                        case 10:
                            if (supportedSites.length > 0) {
                                // Set the retrieved sites as the sites data
                                chrome.storage.sync.set({ sites: supportedSites }, function () {
                                    // Set the lastRequestTime
                                    chrome.storage.sync.set({ lastRequestTime: Date.now() }, function () {
                                    });
                                });
                            }
                            resolve();
                            _a.label = 11;
                        case 11: return [2 /*return*/];
                    }
                });
            });
        });
    });
}
/**
 * Responsible for setting the top bar that appears on the page
 */
function setTopBar() {
    return __awaiter(this, void 0, void 0, function () {
        var iframe, body;
        return __generator(this, function (_a) {
            // Check if the site supported
            if (!siteIsSupported()) {
                return [2 /*return*/];
            }
            iframe = document.createElement("iframe");
            iframe.src = chrome.runtime.getURL("topbar.html");
            iframe.id = yankeemallIframeId;
            iframe.style.position = "fixed";
            iframe.style.top = "20vh";
            iframe.style.left = "86vw";
            iframe.style.zIndex = "1000000000000000000";
            iframe.style.width = "12vw";
            // iframe.style.height = "100%";
            iframe.style.border = "none";
            iframe.style.display = "block";
            iframe.style.opacity = "1";
            body = document.querySelector("body");
            body.append(iframe);
            return [2 /*return*/];
        });
    });
}
/**
 * Responsible for removing the top bar that
 */
function removeTopBar() {
    // Get the iframe
    var iframe = document.querySelector("#" + yankeemallIframeId);
    iframe.parentNode.removeChild(iframe);
}
/**
 * Sends the cart details to the api
 */
function sendCartDetailsToApi(html) {
    return __awaiter(this, void 0, void 0, function () {
        var siteInfo, data, res_1, e_3, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    siteInfo = getCurrentSiteInfo();
                    console.log('[SEND CART DETAILS SITE INFO]', siteInfo);
                    data = {
                        html: html,
                        host: siteInfo.host
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post(processUrl, data)];
                case 2:
                    res_1 = _a.sent();
                    console.log('[SEND CART DETAILS SITE INFO]', res_1);
                    if (res_1.status === 200) {
                        // Send the message to the extension to save it cart details
                        if (res_1.data.status === "success") {
                            chrome.storage.sync.set({ cart: res_1.data.data }, function () {
                                sessionStorage.setItem("yankeeMallData", JSON.stringify(res_1.data.data));
                                var win = window.open(checkoutUrl + "?yankeemallData=" + res_1.data.data, "_blank");
                                win.focus();
                            });
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    if (e_3.response) {
                    }
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_4 = _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if the current page is the cart page if it isn't it navigates to the cart page
 * get's the html content of cart page and sends them to the server for processing
 */
function processCartPage() {
    var _this = this;
    // Check current page is cart page
    if (!isCartPage()) {
        goToCartPage();
        return;
    }
    // Get the body element
    var content = document.querySelector("body");
    var html = "<body>" + content.innerHTML + "</body>";
    (function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendCartDetailsToApi(html)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })();
}
/**
 * For retrieving the cartUrl of the specified host
 */
function getCurrentSiteInfo() {
    // Check if the host is supported
    if (!siteIsSupported()) {
        return null;
    }
    var site = supportedSites.find(function (s) { return location.host.match(s.host); });
    if (!site) {
        return null;
    }
    return site;
}
/**
 * To check if the current site is supported
 */
function siteIsSupported() {
    // Check if the site is supported then set top bar
    return !!supportedSites.find(function (s) { return !!location.host.match(s.host); });
}
/**
 * Check if cart page
 */
function isCartPage() {
    var cartUrls = getCurrentSiteInfo().cartUrls;
    for (var _i = 0, cartUrls_1 = cartUrls; _i < cartUrls_1.length; _i++) {
        var cartUrl = cartUrls_1[_i];
        var pathname = location.pathname === "/" ? "" : location.pathname;
        var fullUrl = location.origin + pathname;
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
    var site = getCurrentSiteInfo();
    location.href = site.cartUrls[0] + location.search;
}
//# sourceMappingURL=main.js.map