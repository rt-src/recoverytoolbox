Array.prototype.last||(Array.prototype.last=function(){return this[this.length-1]});const debug=!1,BaseUrl="https://access.recoverytoolbox.com/online",API="https://api.recoverytoolbox.com";var nextPage="result.html",nextBasePage=BaseUrl;function get(e){return new Promise((function(t,r){var n=new XMLHttpRequest;n.open("GET",e,!0),n.addEventListener("load",(function(){n.status<400?t(n.responseText):r(n)})),n.addEventListener("error",(function(){r(new Error("Network error"))})),n.send(null)}))}function getParams(){for(var e=[],t=window.location.search.substr(1).split("&"),r=0;r<t.length;r++){var n=t[r].split("=");e[decodeURIComponent(n[0]).toLowerCase()]=decodeURIComponent(n[1])}return e}"undefined"!=typeof resultUrl&&(nextPage=resultUrl),nextBasePage="undefined"!=typeof baseUrl?baseUrl:BaseUrl;