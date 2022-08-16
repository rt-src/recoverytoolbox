if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
};

const debug = false;

console.log("Start Config");

// const BaseUrl = "https://access.recoverytoolbox.com/online";
const BaseUrl = "https://access.recoverytoolbox.com/online";
//const BaseUrl = "https://www.repairtoolbox.com";

// const API = "http://127.0.0.1:8190";
// const API = "http://localhost:28747";
const API = "http://www.old.recoverytoolbox.com/api";

var nextPage = 'result.html';
var nextBasePage = BaseUrl;
if (typeof resultUrl !== 'undefined') {
    nextPage = resultUrl;
}
if (typeof baseUrl !== 'undefined') {
    nextBasePage = baseUrl;
} else {
    nextBasePage = BaseUrl;
}

function get(url) {
    return new Promise(function (succeed, fail) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", function () {
            if (req.status < 400)
                succeed(req.responseText);
            else
                fail(req);
        });
        req.addEventListener("error", function () {
            fail(new Error("Network error"));
        });
        req.send(null);
    });
}

function getParams() {
    var $_GET = [];
    var parts = window.location.search.substr(1).split("&");
    for (var i = 0; i < parts.length; i++) {
        var temp = parts[i].split("=");
        $_GET[decodeURIComponent(temp[0]).toLowerCase()] = decodeURIComponent(temp[1]);
    }
    return $_GET;
}