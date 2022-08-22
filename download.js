var count_try = 0;

function getDownloadInfo(fileId) {
    if (debug) {
        console.log("getDownloadInfo", fileId);
    }
    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('getDownloadInfo reqReadyStateChange', request, resp);
            }

            if (resp) {
                if (resp.Paid) {
                    document.getElementById("rt-download-button").removeAttribute("hidden");

                    document.getElementById("rt-download-button")
                        .addEventListener("click", function () {
                            if (typeof gtag !== 'undefined') {
                                gtag("event", "download_repeared_file");
                            }                            
                            window.open(resp.DownloadUrl, "_blank");
                        }, false);
                } else if (!resp.Paid && $_GET["ya_pay"] && count_try < 10) {
                    setTimeout(function () {
                        getDownloadInfo(fileId);
                        count_try++;
                    }, 1000);
                }
            }
        }
    }

    // var url = "${API}/api/repair/files/${fileId}/${$_GET["ya_pay"] ? 'ya_pay_fallback' : 'result'}";
    var url = API + "/api/repair/files/" + fileId + "/result";
    request.open("GET", url, true);
    request.onreadystatechange = reqReadyStateChange;
    request.send();
}

function getResultInfoByOrderId(orderId) {
    if (debug) {
        console.log("getResultInfoByOrderId", orderId);
    }
    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('getInfo reqReadyStateChange', request, resp);
            }

            if (resp && resp.success) {
                getDownloadInfo(resp.downloadId);
            }
        }
    }
    // 
    request.open("GET", API + "/api/payments/getcid/" + orderId, true);
    // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = reqReadyStateChange;
    request.send();
}

var $_GET = getParams();

if ($_GET && $_GET["order_id"]) {
    if (debug) {
        console.log('gotted order_id', $_GET["order_id"]);
    }
    getResultInfoByOrderId($_GET["order_id"]);

} else if ($_GET && $_GET["id"]) {
    sessionStorage.setItem("recoverytoolbox.lastid", $_GET["id"])
    getDownloadInfo($_GET["id"]);
} else {
    const id = sessionStorage.getItem("recoverytoolbox.lastid")
    if (id) {
        $_GET["id"] = id;
        getDownloadInfo($_GET["id"]);
    }
}