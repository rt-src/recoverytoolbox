function getInfo(fileId) {
    if (debug) {
        console.log("getInfo", fileId);
    }
    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('getInfo reqReadyStateChange', request, resp);
            }

            if (resp) {
                if (resp.complete) {
                    if (resp.success) {
                        window.location = nextBasePage + "/" + nextPage + "?id=" + fileId;
                    } else {

                        if (typeof gtag !== 'undefined') {
                            gtag("event", "repearing_file_fail");
                        }

                        var td = document.getElementById('text_detail');
                        if (td) {
                            if (typeof td.innerText !== 'undefined') {
                                td.innerText = resp.stateDetail;
                            } else if (typeof td.textContent !== 'undefined') {
                                td.textContent = resp.stateDetail;
                            }
                            td.removeAttribute("hidden");
                        }
                    }
                }
            }
        }
    }

    request.open("GET", API + "/api/repair/info/" + fileId, true);
    // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = reqReadyStateChange;
    request.send();
}

var $_GET = getParams();

if ($_GET && $_GET["id"]) {
    getInfo($_GET["id"]);
}

function page_load_complete() {
    var rdb = document.getElementsByClassName("btn-paid");
    if (rdb instanceof HTMLCollection && rdb && rdb.length > 0) {
        rdb[0].addEventListener("click", function () {
            window.location = nextBasePage + "/";
        }, false);
    }
    rdb = document.getElementsByClassName("rt-fail-button");
    if (rdb instanceof HTMLCollection && rdb && rdb.length > 0) {
        rdb[0].addEventListener("click", function () {
            window.location = nextBasePage + "/";
        }, false);
    }
}

if (window.attachEvent) {
    window.attachEvent('onload', page_load_complete);
} else if (window.addEventListener) {
    window.addEventListener('load', page_load_complete, false);
} else {
    document.addEventListener('load', page_load_complete, false);
}