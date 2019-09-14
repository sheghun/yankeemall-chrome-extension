// /**
//  * Get the country the user is browsing from
//  */
// const userCountryOrigin = ""; // Get the country the user is browsing from
// /**
//  * The base url of YANKEEMALL used to load assets and files
//  * from the website
//  */
// const baseDomainUrl = "";
// /**
//  * The url used to get the list of sites to crawl
//  */
// const crawUrl = "https://mfaplus.com/ws/mfaws4.asmx/GetSites1";
// /**
//  * The url used to transfer existing cart data to YANKEEMALL checkout page
//  */
// const cartInfoUrl = "";
// /**
//  * windowHost is location.host
//  * @returns {string} The current host of the shopping site e.g www.example.com
//  */
// const windowHost = location.host;
// /**
//  * This variable is to find current page is Shopify site or not
//  * @private
//  * @default false
//  */
// let isShopifySite: any = false;
// /**
// /**
//  *  windowHref is location.href
//  *  @returns The full url of the current page
//  */
// const windowHref = location.href;
// /**
//  * siteProtocol is location.protocol
//  * @returns ~ The protocol of the current site e.g http or https
//  */
// const siteProtocol = location.protocol;
// /**
//  * This variable has list of supported sites in JSON format
//  */
// const supportSites = {};
// /**
//  * This variable keep tracks of how many calls made to processSitesJson method
//  * @default 0
//  */
// const processSitesJSONCalls = 0;
// /**
//  * support sites are refreshed after cacheTime is expired
//  * @default 10800000 i.e., 3 hours
//  */
// const cacheTime = 10800000; // 3 hours
// /**
//  * Boolean variable to check getSites is called or not
//  * @private
//  * @default false
//  */
// let getSitesCalled = false;
// /**
//  * Boolean variable to check processItemsOnCartPage is called or not
//  * @private
//  * @default false
//  */
// let processItemsOnCartPageCalled = false;
// /**
//  * Hidden div id for holding cartdata
//  * @default '#yankeemall_inject_cartdata'
//  */
// const yankeeMallInjectCartdataDivId = "yankeemall_inject_cartdata";
// /**
//  * Div Id for __
//  * @default #yankeemall_inject
//  */
// const yankeeMallInjectDivId = "yankeemall_inject";
// /**
//  * List of sites that work in both http and https
//  */
// const secureProbSite = [
//     "bestbuy",
//     "carters",
//     "shopify",
//     "kitson",
//     "autopartswarehouse",
//     "bathandbodyworks",
//     "boscovs",
//     "ulta",
//     "sephora",
//     "bananarepublic"
// ];
//
// /**
//  * <pre>
//  *  encode : returns a Base64 encoded ASCII string
//  *  decode : returns decoded string which has been encoded using Base64 encoding
//  * </pre>
//  *
//  **/
// const Base64 = {
//     /**
//      * @property {string} Base64._keyStr
//      * @private
//      */
//     _keyStr:
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
//     /**
//      * @namespace
//      * @property {function} Base64.encode - returns a Base64 encoded ASCII string
//      * @param {string} input - string to be encoded
//      */
//     encode: function(input) {
//         let output = "";
//         let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
//         let i = 0;
//         input = Base64._utf8_encode(input);
//         while (i < input.length) {
//             chr1 = input.charCodeAt(i++);
//             chr2 = input.charCodeAt(i++);
//             chr3 = input.charCodeAt(i++);
//             enc1 = chr1 >> 2;
//             enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
//             enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
//             enc4 = chr3 & 63;
//             if (isNaN(chr2)) {
//                 enc3 = enc4 = 64;
//             } else if (isNaN(chr3)) {
//                 enc4 = 64;
//             }
//             output =
//                 output +
//                 this._keyStr.charAt(enc1) +
//                 this._keyStr.charAt(enc2) +
//                 this._keyStr.charAt(enc3) +
//                 this._keyStr.charAt(enc4);
//         }
//         return output;
//     },
//     /**
//      * @namespace
//      * @property {function} Base64.decode - returns decoded string which has been encoded using Base64 encoding
//      * @param {string} input - string to be encoded
//      */
//     decode: function(input) {
//         let output = "";
//         let chr1, chr2, chr3;
//         let enc1, enc2, enc3, enc4;
//         let i = 0;
//         input = input.replace(/[^A-Za-z0-9+\/=]/g, "");
//         while (i < input.length) {
//             enc1 = this._keyStr.indexOf(input.charAt(i++));
//             enc2 = this._keyStr.indexOf(input.charAt(i++));
//             enc3 = this._keyStr.indexOf(input.charAt(i++));
//             enc4 = this._keyStr.indexOf(input.charAt(i++));
//             chr1 = (enc1 << 2) | (enc2 >> 4);
//             chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
//             chr3 = ((enc3 & 3) << 6) | enc4;
//             output = output + String.fromCharCode(chr1);
//             if (enc3 != 64) {
//                 output = output + String.fromCharCode(chr2);
//             }
//             if (enc4 != 64) {
//                 output = output + String.fromCharCode(chr3);
//             }
//         }
//         output = Base64._utf8_decode(output);
//         return output;
//     },
//     /**
//      * @namespace
//      * @property {function} Base64._utf8_encode - returns the string UTF-8 encoded
//      * @param {string} string - string to be encoded
//      * @private
//      */
//     _utf8_encode: function(string) {
//         string = string.replace(/\r\n/g, "\n");
//         let UTFText = "";
//         for (let n = 0; n < string.length; n++) {
//             let c = string.charCodeAt(n);
//             if (c < 128) {
//                 UTFText += String.fromCharCode(c);
//             } else if (c > 127 && c < 2048) {
//                 UTFText += String.fromCharCode((c >> 6) | 192);
//                 UTFText += String.fromCharCode((c & 63) | 128);
//             } else {
//                 UTFText += String.fromCharCode((c >> 12) | 224);
//                 UTFText += String.fromCharCode(((c >> 6) & 63) | 128);
//                 UTFText += String.fromCharCode((c & 63) | 128);
//             }
//         }
//         return UTFText;
//     },
//     /**
//      * @namespace
//      * @property {function} Base64._utf8_decode - returns the string UTF-8 decoded
//      * @param {string} UTFText - string to be decoded
//      * @private
//      */
//     _utf8_decode: function(UTFText) {
//         let string = "";
//         let i = 0;
//         let c1, c2, c3;
//         let c = (c1 = c2 = 0);
//         while (i < UTFText.length) {
//             c = UTFText.charCodeAt(i);
//             if (c < 128) {
//                 string += String.fromCharCode(c);
//                 i++;
//             } else if (c > 191 && c < 224) {
//                 c2 = UTFText.charCodeAt(i + 1);
//                 string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
//                 i += 2;
//             } else {
//                 c2 = UTFText.charCodeAt(i + 1);
//                 c3 = UTFText.charCodeAt(i + 2);
//                 string += String.fromCharCode(
//                     ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
//                 );
//                 i += 3;
//             }
//         }
//         return string;
//     }
// };
//
// /**
//  *
//  * This code is to call startYankeeExt method whenever content script is loaded
//  * This initializer of the script
//  */
// window.onload = function() {
//     chrome.runtime.sendMessage(
//         {
//             method: "code"
//         },
//         function() {
//             initializeExtension();
//         }
//     );
// };
//
// /**
//  * This method is called when the page is loaded
//  * This starts the process
//  * TODO call resetBin function
//  */
// function initializeExtension() {
//     // Get the sites
//     getSites();
// }
// /**
//  * getSites method checks data in extension's local storage with cacheTime if data is expired, an Ajax call will be made to crawlUrl<br />
//  * and saves the response in extension's local storage and sends the response as an argument to processSitesJson<br />
//  * if data is not expired, data is fetched from extension's local storage and passed as an argument to processSitesJson
//  */
// function getSites() {
//     if (getSitesCalled === true) {
//         return false;
//     }
//     getSitesCalled = true;
//     injectScript(function() {
//         chrome.storage.local.get("sites_info", function(res) {
//             chrome.storage.local.get("saved_time", function(timeObj) {
//                 const dataSavedBeforeTime =
//                     new Date().getTime() - timeObj["saved_time"];
//                 // Check if data saved before time is up to cacheTime
//                 if (dataSavedBeforeTime < cacheTime && res["sites_data"]) {
//                     //
//                     getSitesCalled = false;
//                     const now = +new Date().getTime();
//                     chrome.storage.local.set(
//                         {
//                             saved_time: now
//                         },
//                         function() {
//                             processSitesJson(res);
//                         }
//                     );
//                 } else {
//                     // Fetch the sites from the url
//                     axios
//                         .get(crawUrl)
//                         .then(res => {
//                             getSitesCalled = false;
//                             chrome.storage.local.set(
//                                 {
//                                     sites_info: res
//                                 },
//                                 function() {
//                                     const now = Date.now();
//                                     chrome.storage.local.set(
//                                         {
//                                             saved_time: now
//                                         },
//                                         function() {
//                                             processSitesJson(res);
//                                         }
//                                     );
//                                 }
//                             );
//                         })
//                         .catch(err => {
//                             getSitesCalled = false;
//                         });
//                 }
//             });
//         });
//     });
//     return false;
// }
// /**
//  * This method appends a &lt;div&gt; element with id *yankeemall_inject* <br />
//  * And &lt;script&gt; element to the head of page with src pointing to inject.js.<br />
//  * div#yankeemall_inject element can be used as message platform, where message from content script to background and vice versa is possible.
//  */
// function injectScript(callback: () => void) {
//     // create hidden cartdata div if it doesn't exist for storing cart data
//     let cartDataDiv = $("#" + yankeeMallInjectCartdataDivId);
//     if (cartDataDiv.length == 0) {
//         $("<div />", {
//             id: yankeeMallInjectCartdataDivId,
//             hidden: true
//         }).appendTo($("body"));
//     }
//     // Re-assign the element after creating it so we will get the updated element
//     // @ts-ignore
//     cartDataDiv = $("#" + yankeeMallInjectCartdataDivId);
//     if (cartDataDiv.length > 0) {
//         cartDataDiv.on("GET_CART_ITEMS", function() {
//             const jsonData = $("#" + yankeeMallInjectCartdataDivId).text();
//             if (jsonData) {
//                 const cartUrl = getCartUrl();
//                 processItemsOnCartPage(cartUrl, jsonData, windowHost);
//             }
//         });
//     }
//     let injectDiv = $("#" + yankeeMallInjectDivId);
//     if (injectDiv.length === 0) {
//         $("<div />", {
//             id: yankeeMallInjectDivId,
//             hidden: true
//         }).appendTo($("body"));
//         injectDiv = $("#" + yankeeMallInjectDivId);
//
//         if (injectDiv.length > 0) {
//             injectDiv.on("GET_VARIABLE", function() {
//                 if (injectDiv.html()) {
//                     isShopifySite = injectDiv.html();
//                 }
//                 if (typeof callback === "function") {
//                     callback();
//                 }
//             });
//         }
//         const src = chrome.runtime.getURL("inject.js");
//         console.log(src);
//         $("<script />", {
//             type: "text/javascript",
//             src: src,
//             async: false
//         }).appendTo($("head"));
//     } else if (typeof callback === "function") {
//         callback();
//     }
// }
//
// /**
//  * This method matches current page url with support sites and returns first cart url
//  * @return Cart URL
//  */
// function getCartUrl(): string {
//     let host = getHostName(windowHost);
//     let cartUrl = "";
//     // Check if the host name already exists
//     if (!supportSites.hasOwnProperty(host)) {
//         host = getDomain(windowHost);
//     }
//     const cartUrls = supportSites[host]
//         ? supportSites[host]["cartUrls"]["cartUrl"]
//         : "";
//     if (typeof supportSites[host] !== "undefined") {
//         if (typeof cartUrls === "string") {
//             cartUrl = cartUrls;
//         } else {
//             for (let y = 0; y < cartUrls.length; y++) {
//                 const temp = getLocation(cartUrls[y]);
//                 const temp1 = getLocation(cartUrls[y]);
//                 if (temp.hostname === temp1.hostname) {
//                     cartUrl = cartUrls[y];
//                     break;
//                 }
//             }
//             if (cartUrl == "") {
//                 cartUrl = cartUrls[0];
//             }
//             if (host == "zara") {
//                 cartUrl = cartUrl[0];
//             }
//         }
//     }
//     return cartUrl;
// }
//
// /**
//  * getHostName returns host name using full url or domain
//  */
// function getHostName(host) {
//     let hostname = host.split(".");
//     if (host.indexOf("//") != -1) {
//         hostname = host.split("//");
//         host = hostname.join(".");
//     }
//     if (host.indexOf(":.") != -1) {
//         hostname = host.split(":.");
//         host = hostname[1];
//     }
//     if (host.indexOf("-") != -1) {
//         if (host.split(".")[1] == "net-a-porter") {
//             host = "www.net-a-porter.com";
//         } else {
//             hostname = host.split("-");
//             host = hostname[1];
//         }
//     }
//     if (host.split(".") && host.split(".")[2] == "ebay") {
//         host = "ebay";
//     }
//     if (
//         host.split(".") &&
//         host.split(".")[1] == "com" &&
//         host == "beautifullyundressed.com"
//     ) {
//         host = host.split(".")[0];
//     }
//     if (host == "checkout.autopartswarehouse.com") {
//         host = "autopartswarehouse";
//     }
//     if (host == "us.topshop.com") {
//         host = "topshop";
//     }
//     if (host == "ralphlauren.borderfree.com") {
//         host = "ralphlauren";
//     }
//     host = host.replace(/\/.*/, ""); // code for removing trailing slash
//     return host;
// }
//
// /**
//  * This method returns domain of host passed as an argument
//  * @returns domain Eg. getDomain('www.amazon.com') => amazon
//  */
// function getDomain(host: string): string {
//     const hostArray = host.split(".");
//     let dom;
//     if (hostArray.length > 2) {
//         dom = hostArray[1];
//     } else {
//         dom = hostArray[0];
//     }
//     if (dom == "gap") {
//         dom = hostArray[0];
//         if (dom.indexOf("-") >= 0) {
//             dom = host.split("-")[1];
//         }
//     }
//     if (dom == "webstorepowered") {
//         //      condition for oka-b
//         dom = "oka-b";
//     }
//     if (dom == "payments") {
//         dom = "ebay";
//     }
//     if (dom == "store") {
//         dom = "apple";
//     }
//     if (dom.indexOf("//") != -1) {
//         dom = hostArray[0];
//         if (hostArray[1] == "gap") {
//             dom = hostArray[0].split("//")[1];
//         }
//         dom = dom.split("//")[1];
//     }
//     return dom;
// }
//
// /**
//  * This method takes URL as an argument and returns anchor element with href pointed to that URL
//  * @param {string} href - URL assigned as href to the anchor element.
//  */
// function getLocation(href: string): HTMLAnchorElement {
//     const l = document.createElement("a");
//     l.href = href;
//     return l;
// }
//
// /**
//  * This method processes current page HTML or HTML passed as parameters<br />
//  * If site is Amazon, it finds the shipping price of each cart element and passed them to get_cart_url
//  * Some sites are excluded, if it has cart data saved in JSON format and has some URL which can be accessed. (Instead of using page's HTML, one can directly get the cart contents from the URL)<br />
//  * Sending message to background.js when error is received from get_cart_url
//  * checkoutCart is called when response from get_cart_url is success
//  * @param {string} url - URL is to set as params for GetSiteInfo1 call
//  * @param {string} html - Page's HTML or JSON data from cart page
//  * @param {string} domain - domain is to set as params for GetSiteInfo1 call
//  */
// function processItemsOnCartPage(url, html, domain) {
//     if (processItemsOnCartPageCalled === true) {
//         return false;
//     }
//     processItemsOnCartPageCalled = true;
//     let strData, fullUrl;
//     if (url) {
//         fullUrl = url;
//         strData = Base64.encode(html);
//     } else {
//         const jsonDataSites = [];
//         jsonDataSites["www.aldoshoes.com"] = "www.aldoshoes.com";
//         jsonDataSites["www.amazon.com"] = "www.amazon.com";
//         jsonDataSites["www.anntaylor.com"] = "www.anntaylor.com";
//         jsonDataSites["www.mrporter.com"] = "www.mrporter.com";
//         jsonDataSites["www.net-a-porter.com"] = "www.net-a-porter.com";
//         jsonDataSites["www.walmart.com"] = "www.walmart.com";
//         jsonDataSites["www.boscovs.com"] = "www.boscovs.com";
//         jsonDataSites["www.bestbuy.com"] = "www.bestbuy.com";
//         jsonDataSites["www-ssl.bestbuy.com"] = "www.bestbuy.com";
//         jsonDataSites["www.hm.com"] = "www.hm.com";
//         jsonDataSites["www.urbanoutfitters.com"] = "www.urbanoutfitters.com";
//         jsonDataSites["www.ae.com"] = "www.ae.com";
//         jsonDataSites["www1.macys.com"] = "www1.macys.com";
//         jsonDataSites["www.carters.com"] = "www.carters.com";
//         jsonDataSites["www.juicycouture.com"] = "www.juicycouture.com";
//         jsonDataSites["www.firebox.com"] = "www.firebox.com";
//         jsonDataSites["www.sephora.com"] = "www.sephora.com";
//         jsonDataSites["www.thomaspink.com"] = "www.thomaspink.com";
//         jsonDataSites["247shopaholic.com"] = "247shopaholic.com";
//         if (isShopifySite) {
//             jsonDataSites[location.hostname] = location.hostname;
//         }
//         let cartUrl;
//         if (
//             windowHref.indexOf("?") == windowHref.length - 1 ||
//             windowHref.indexOf("/") == windowHref.length - 1
//         ) {
//             cartUrl = windowHref.substring(0, windowHref.length - 1);
//         } else {
//             cartUrl = windowHref;
//         }
//         cartUrl = getCartUrl();
//         if (
//             (typeof jsonDataSites[windowHost] !== "undefined" &&
//                 !html &&
//                 cartUrl) ||
//             (jsonDataSites[windowHost] === undefined && isShopifySite)
//         ) {
//             processItemsOnCartPageCalled = false;
//             getHTML();
//             return false;
//         }
//         domain = windowHost;
//         fullUrl = windowHref;
//         strData = Base64.encode(document.body.innerHTML);
//     }
//     checkShippingPrice(html, cartArray => {
//         // Check if the site is shopify site
//         const shopifySite = isShopifySite && "1";
//         const host = getHostName(windowHost);
//         const start = new Date();
//
//     });
// }
//
// /**
//  * This method checks current page is cart page or checkout page to get cart items and sends them to processItemsOnCartPage
//  * supported sites using ajax to get cart items are called separately to get cart items from ajax and the response is passed to processItemsOnCartPage
//  * if cart items are not crawled, page redirects to cart page
//  * TODO complete the function
//  */
// function getHTML() {
//     let host = getHostName(windowHost);
//     if (typeof supportSites[host] === "undefined") {
//         host = getDomain(windowHost);
//     }
//     const cartUrl = getCartUrl();
//     const cartHost = getLocation(cartUrl);
//     const excludeAjaxSites = new Array();
//     excludeAjaxSites.push("www.ae.com");
//     excludeAjaxSites.push("www.abercrombie.com");
//     excludeAjaxSites.push("www.anntaylor.com");
//     excludeAjaxSites.push("www.6pm.com");
//     excludeAjaxSites.push("www.lanebryant.com");
//     excludeAjaxSites.push("www.burlingtoncoatfactory.com");
//     excludeAjaxSites.push("www.charlotterusse.com");
//     excludeAjaxSites.push("www.childrensplace.com");
//     excludeAjaxSites.push("direct.asda.com");
//     excludeAjaxSites.push("www.dsw.com");
//     excludeAjaxSites.push("www.walmart.com");
//     excludeAjaxSites.push("www.marksandspencer.com");
//     excludeAjaxSites.push("www.zappos.com");
//     excludeAjaxSites.push("www.mrporter.com");
//     excludeAjaxSites.push("www.net-a-porter.com");
//     excludeAjaxSites.push("www.payless.com");
//     excludeAjaxSites.push("www.zara.com");
//     excludeAjaxSites.push("www.victoriassecret.com");
//     excludeAjaxSites.push("www.shoemetro.com");
//     excludeAjaxSites.push("www.tmlewin.co.uk");
//     excludeAjaxSites.push("www.yankeecandle.com");
//     excludeAjaxSites.push("www.topman.com");
//     excludeAjaxSites.push("www.hollisterco.com");
//     excludeAjaxSites.push("www.houseoffraser.co.uk");
//     excludeAjaxSites.push("www.bestbuy.com");
//     excludeAjaxSites.push("www.boden.co.uk");
//     excludeAjaxSites.push("www.dorothyperkins.com");
//     excludeAjaxSites.push("secure-bananarepublic.gap.com");
//     excludeAjaxSites.push("www.urbanoutfitters.com");
//     excludeAjaxSites.push("www.juicycouture.com");
//     excludeAjaxSites.push("www.firebox.com");
//     excludeAjaxSites.push("www.sephora.com");
//     excludeAjaxSites.push("www.thomaspink.com");
//     excludeAjaxSites.push("www.ctshirts.com");
//     excludeAjaxSites.push("247shopaholic.com");
//
//     if (
//         cartHost.hostname == windowHost &&
//         excludeAjaxSites.indexOf(windowHost) == -1 &&
//         isShopifySite == false
//     ) {
//         axios
//             .get(cartUrl)
//             .then((res: AxiosResponse) => {
//                 // Get the data
//                 let data = res.data;
//                 console.log(res);
//                 const contentType = res.headers["Content-Type"] as string;
//                 // Check if the type of the data is json
//                 if (contentType && contentType.match("application/json")) {
//                     if (typeof data === "object") {
//                         data = JSON.parse(data);
//                     }
//                 }
//                 console.log(data);
//                 processItemsOnCartPage(cartUrl, data, windowHost);
//             })
//             .catch(err => {
//                 // If errors redirect v the cart page
//                 const cartUrl = getCartUrl();
//                 if (cartUrl && location.href.indexOf(cartUrl) === -1) {
//                     location.href = cartUrl;
//                 }
//             });
//     } else {
//         const supportSitesCustom = {}; //id based
//         supportSitesCustom["www.shoemetro.com"] =
//             "ctl00_ctl13_pnlMinicartControl";
//         supportSitesCustom["www.boden.co.uk"] = "bagPreviewDetail";
//         //supportSitesCustom['www.childrensplace.com'] = 'add2bag-quickview';
//
//         const supportSitesCustomJson = {}; //json based
//         supportSitesCustomJson["www.ae.com"] =
//             "https://www.ae.com/api/2.0/cart?ctx.locale=en&ctx.shipTo=US&ctx.currency=USD";
//         supportSitesCustomJson["www.anntaylor.com"] =
//             siteProtocol +
//             "//www.anntaylor.com/cws/common/order.jsp?=" +
//             Date.now();
//         supportSitesCustomJson["www.bestbuy.com"] =
//             siteProtocol + "//www.bestbuy.com/cart/json?_=" + Date.now();
//         supportSitesCustomJson["bestbuy"] =
//             "http://www.bestbuy.com/cart/json?_=" + Date.now();
//         supportSitesCustomJson["www.boscovs.com"] =
//             siteProtocol +
//             "//www.boscovs.com/shop/shopping-bag-preview.json?_=" +
//             Date.now();
//         supportSitesCustomJson["boscovs"] =
//             siteProtocol +
//             "//www.boscovs.com/shop/shopping-bag-preview.json?_=" +
//             Date.now();
//         supportSitesCustomJson["www.mrporter.com"] =
//             siteProtocol +
//             "//www.mrporter.com/intl/api/header/info.json?datascope=basket_items&_=" +
//             Date.now();
//         supportSitesCustomJson["www.net-a-porter.com"] =
//             siteProtocol +
//             "//www.net-a-porter.com/gb/en/api/basket/view.json?_=" +
//             Date.now(); // http://www.net-a-porter.com/apac/api/basket/view.json
//         supportSitesCustomJson["www.urbanoutfitters.com"] =
//             "https://www.urbanoutfitters.com/orders/current?siteCode=urban";
//         supportSitesCustomJson["www.walmart.com"] =
//             siteProtocol +
//             "//www.walmart.com/api/cart/:CRT?shipMethodDefaultRule=SHIP_RULE_1";
//         supportSitesCustomJson["walmart"] =
//             siteProtocol +
//             "//www.walmart.com/api/cart/:CRT?shipMethodDefaultRule=SHIP_RULE_1";
//         supportSitesCustomJson["www.juicycouture.com"] =
//             siteProtocol +
//             "//www.juicycouture.com/Cart/Full?withCheckoutInfo=false&withFulfillmentInfo=true";
//         supportSitesCustomJson["www.firebox.com"] =
//             "https://www.firebox.com/checkout/save-state";
//         supportSitesCustomJson["www.sephora.com"] =
//             "https://www.sephora.com/api/users/profiles/current/full";
//         supportSitesCustomJson["www.thomaspink.com"] =
//             "https://www.thomaspink.com/us/ssn/session-data.json?_=" +
//             Date.now();
//         supportSitesCustomJson["247shopaholic.com"] =
//             "http://247shopaholic.com/frontapi.asp?module=cartajax";
//         //https://www.mrporter.com/am/api/header/info.json?datascope=basket_items
//         const supportSitesIframe = {}; //iframe based
//         supportSitesIframe["www.victoriassecret.com"] =
//             "www.victoriassecret.com";
//         if (isShopifySite) {
//             supportSitesCustomJson[host] = location.origin + "/cart.json";
//         }
//         if (typeof supportSitesCustomJson[host] !== "undefined") {
//             const html = getHtmlById();
//         }
//     }
// }
//
// function getHtmlById() {}
//
// function processSitesJson(res) {}
//
// /**
//  * This method is only for Amazon website, which returns cart array by setting its value with shipping price
//  * @param {string} html - Cart page HTML
//  * @param {string} callback - callback to call after setting products' shipping prices in cart array
//  */
// function checkShippingPrice(html, callback: (Array) => void) {}
