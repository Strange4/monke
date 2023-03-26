import Cookies from "js-cookie";

/**
 * Sets the cookie in the browser with the given name, 
 * value and expiry date of current date + 100 000 days.
 * @param {string} cookieName, the name of the cookie that will be created. 
 * @param {string} cookieValue, the value of the cookie that will be created.
 */
function setCookie(cookieName, cookieValue){
    if (getCookieValue(cookieName) === undefined)
        Cookies.set(cookieName, cookieValue, {expires: 100000, sameSite: 'Strict', secure: false});
}

/**
 * Checks if the cookie exist and gets the value if it does.
 * @param {string} cookieName,  the name of the cookie. 
 * @returns the value of the cookie associated with the name of the cookie name.
 */
function getCookieValue(cookieName){
    return Cookies.get(cookieName);
}

/**
 * Deletes the cookie with the given name.
 * @param {string} cookieName, the name of the cookie.
 */
function deleteCookie(cookieName){
    Cookies.remove(cookieName);
}

export {setCookie, getCookieValue, deleteCookie};