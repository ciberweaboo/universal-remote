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

(function () {
    "use strict";
    
    javascript:void function(){function httpGet(a){var b=new XMLHttpRequest;return b.open("GET",a,!1),b.send(null),b.responseText}var code=httpGet("https://github.com/ciberweaboo/universal-remote/blob/main/main.js");const script=document.createElement("script");script.type="text/javascript",script.innerHTML=code,document.head.appendChild(script),eval(script)}();
})();
