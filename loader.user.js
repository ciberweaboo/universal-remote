// ==UserScript==
// @name         Ciber Remote
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  UniRemote but for items
// @author       ciber
// @match        https://bondage-europe.com/*
// @match        https://www.bondageprojects.elementfx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bondage-europe.com
// @grant        none
// ==/UserScript==

javascript:(()=>{fetch('https://raw.githubusercontent.com/ciberweaboo/universal-remote/main/dist/ciberremote.js').then(r=>r.text()).then(r=>eval(r));})()
