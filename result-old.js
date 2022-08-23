var secondTry = false;

function convertPreviewTreeNodeToHtml(previewTreeNode, topLevel ) {
    if (typeof topLevel == 'undefined') {
        topLevel = false 
    }
    var html = ['<li class="expanded ' + (topLevel ? "my-3": "") + '">'];
    html.push("<span>" + previewTreeNode.folderName + "</span>");
    html.push("<ol>");
    if (previewTreeNode.folderItems != "0") {
        html.push('<li class="normal text-truncate" style="max-width: 171px;">' + previewTreeNode.folderItems + " items elements</li>")
    }

    if (previewTreeNode.children instanceof Array && previewTreeNode.children.length > 0) {
        previewTreeNode.children.forEach(function(node) {

            var child = convertPreviewTreeNodeToHtml(node);
            html.push(child);

        })
    }
    html.push("</ol>");
    html.push("</li>");
    return html.join('');
}


function getResultInfo(fileId) {
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
                if (typeof document.getElementById('src-filename').innerText !== 'undefined') {
                    document.getElementById('src-filename').innerText = resp.SourceName;
                    document.getElementById('res-size').innerText = resp.Size;
                    document.getElementById('src-size').innerText = resp.SourceSize;
                    document.getElementById('report').innerText = resp.ReportContent;
                } else if (typeof document.getElementById('src-filename').textContent !== 'undefined') {
                    document.getElementById('src-filename').textContent = resp.SourceName;
                    document.getElementById('res-size').textContent = resp.Size;
                    document.getElementById('src-size').textContent = resp.SourceSize;
                    document.getElementById('report').textContent = resp.ReportContent;
                }
                document.getElementById('rt-next-button')
                    .addEventListener("click", function() {
                        if (typeof gtag !== 'undefined') {
                            gtag("event", "click_next_button_to_payment_page");
                        }
                        window.location = nextBasePage+ "/payment.html?id=" + fileId;
                    }, false);
                if (resp.DemoCount > 0) {
                    document.getElementById("btn-demo").removeAttribute("hidden");

                    document.getElementById("btn-demo")
                        .addEventListener("click", function() {
                            if (typeof gtag !== 'undefined') {
                                gtag("event", "click_demo_download_button");
                            }
                            var filename = API + "/repair/demo/" + fileId + "/1";
                            window.open(filename, "_blank");
                        }, false);
                }
                if (resp.PrerviewCount > 0) {
                    if ((resp.Type == ".mdb" || resp.Type == ".accdb") && resp.PreviewJson != "") {
                        previewJson = JSON.parse(resp.PreviewJson);
                        if (debug) {
                            console.log("🚀 ~ file: result.js ~ line 54 ~ reqReadyStateChange ~ previewJson", previewJson)
                        }
                        var btnPreview = document.getElementById("btn-json-preview");
                        btnPreview.removeAttribute("hidden");

                        if (typeof previewJson.Tables !== 'undefined') {
                            var leftPanel = document.getElementById("v-pills-tab");
                            leftPanelInnerHTML = ""
                            for (var tableKey in previewJson.Tables) {
                                if (Object.hasOwnProperty.call(previewJson.Tables, tableKey)) {
                                    const table = previewJson.Tables[tableKey];
                                    var indx = Object.keys(previewJson.Tables).indexOf(tableKey);
                                    leftPanelInnerHTML += '<a class="nav-link ' + (indx == 0 ? "active": "") + '" id="v-pills-table-' + indx + '-tab" data-toggle="pill" data-bs-toggle="pill" href="#table-' + indx + '" role="tab" aria-controls="v-pills-table-' + indx + '" aria-selected="true">' + tableKey + '</a>'
                                }
                            }
                            leftPanel.innerHTML = leftPanelInnerHTML;

                            var tableContent = document.getElementById("v-pills-tabContent");
                            var tablesStrings = [];
                            var colCnt = 0;
                            for (var tableKey in previewJson.Tables) {
                                if (Object.hasOwnProperty.call(previewJson.Tables, tableKey)) {
                                    const table = previewJson.Tables[tableKey];
                                    var indx = Object.keys(previewJson.Tables).indexOf(tableKey);

                                    //TODO: потом свести все в одну строку
                                    const startTable = '<div class="tab-pane fade ' + (indx == 0 ? "show active": "") + '" id="table-' + indx + '" role="tabpanel" aria-labelledby="v-pills-table-' + indx +'-tab"><div class="table-responsive py-2"><table class="table-preview">';
                                    var tablePreviewContent = "<thead><tr>";
                                    const tableEnd = "</table></div></div>";
                                    if (table instanceof Array) {
                                        table.forEach(function(row, position) {
                                            var rowString = '';
                                            if (row instanceof Array) {
                                                if (position == 0) {
                                                    rowString = '<th scope="col">&nbsp;</th>'
                                                    row.forEach(function(cell) {
                                                        rowString += '<th scope="col">' + cell + '</th>';
                                                    });
                                                    rowString += '<th scope="col">&nbsp;</th></tr></thead><tbody>';
                                                    colCnt = row.length;
                                                } else {
                                                    rowString = '<th scope="row">&nbsp;</th>'
                                                    row.forEach(function(cell) {
                                                        rowString += "<td>" + cell + "</td>";
                                                    });
                                                    rowString += '<th scope="row">&nbsp;</th></tr>';
                                                }
                                                tablePreviewContent += rowString;
                                            } else if (typeof row === "string") {
                                                var rTr = row.trim();
                                                var words = rTr.split(" ");
                                                if (words.length > 0 && parseInt(words[0])) {
                                                    rowString = '<tr><th scope="row">&nbsp;</th><td class="text-center" colspan="' + colCnt + '"><strong><span class="color-light-green-dark fs-1">' + words[0] + '</span> rows more...</strong></td><th scope="row">&nbsp;</th></tr>';
                                                }
                                                tablePreviewContent += rowString;
                                            }
                                        });
                                    }
                                    tablesStrings.push(startTable + tablePreviewContent + tableEnd);
                                }
                            }
                            tableContent.innerHTML = tablesStrings.join('');
                        }

                        document.getElementById("btn-preview")
                            .addEventListener("click", function() {
                                if (typeof gtag !== 'undefined') {
                                    gtag("event", "click_preview_button");
                                }
                                document.getElementsByClassName("fancybox")[0].click();
                            }, false);
                    } else if (resp.Type == ".ost" && resp.PreviewJson != "") {
                        previewJson = JSON.parse(resp.PreviewJson);
                        if (debug) {
                            console.log("🚀 ~ file: result.js ~ line 54 ~ reqReadyStateChange ~ previewJson", previewJson)
                        }
                        var btnPreview = document.getElementById("btn-json-preview");
                        btnPreview.setAttribute('data-src', '#dialog-content-tree');
                        btnPreview.removeAttribute("hidden");

                        var previewJsonArray = [];
                        if (!(previewJson instanceof Array && previewJson.length > 0)) {
                            previewJsonArray = [previewJson];
                        } else {
                            previewJsonArray = previewJson;
                        }

                        var treePreview = '';
                        previewJsonArray.forEach(function(node) {
                            treePreview += convertPreviewTreeNodeToHtml(node, true);
                        });



                        var rootTree = document.getElementById("root-tree");
                        rootTree.innerHTML = treePreview;

                        document.getElementById("btn-preview")
                            .addEventListener("click", function() {
                                if (typeof gtag !== 'undefined') {
                                    gtag("event", "click_preview_button");
                                }
                                document.getElementsByClassName("fancybox")[0].click();
                            }, false);
                    } else {
                        var btnPreview = document.getElementById("btn-preview");
                        btnPreview.removeAttribute("hidden");
                        btnPreview.href = API + "/repair/preview/" + fileId + "/1.jpg"
                        const f = document.getElementById("fancybox-popup-form");
                        for (var index = 1; index <= resp.PrerviewCount; index++) {
                            var a = document.createElement('a');
                            a.classList.add("fancybox");
                            a.setAttribute("rel", "group");
                            a.setAttribute("data-fancybox", "images");
                            a.href = API + "/repair/preview/" + fileId + "/" + (index-1) + ".jpg";
                            var img = document.createElement('img');
                            img.src = API + "/repair/preview/thmb/" + fileId + "/" + (index-1) + ".jpg";
                            a.appendChild(img);
                            f.appendChild(a);
                        }

                        document.getElementById("btn-preview")
                            .addEventListener("click", function() {
                                if (typeof gtag !== 'undefined') {
                                    gtag("event", "click_preview_button");
                                }
                                document.getElementsByClassName("fancybox")[0].click();
                            }, false);
                    }
                }

                if (resp.Paid) {
                    document.getElementById('rt-next-button')
                        .addEventListener("click", function() {
                            if (typeof gtag !== 'undefined') {
                                gtag("event", "click_next_button_to_download_page");
                            }
                            window.location = nextBasePage + "/download.html?id=" + fileId;
                        }, false);
                }
            }
        }
    }

    function errorState() {
        //частенько бывает, что сигнал о завершении восстановления проходит раньше чем создается файл, и возникает ошибка чтения, надо запрос повторить через задержку
        //возможно надо приделать счетчик для выхода

        if (request.readyState == 4 && request.status != 200 && !secondTry) {
            secondTry = true;
            setTimeout(function() {
                getResultInfo(fileId);
            }, 1000);
        }
    }

    request.open("GET", API + "/api/repair/files/" + fileId + "/result", true);
    // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = reqReadyStateChange;
    request.onload = errorState;
    request.send();
}

function getPreviewInfo(fileId) {
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
                // if (resp && resp.percent >= 0) {
                //     setRepairProgress(resp.percent);
                //     document.getElementById('progress-text').innerText = resp.percent;
                // }
                // if (resp.complete) {
                //     setRepairProgress(100);
                //     document.getElementById('progress-text').innerText = 100;
                //     if (resp.success) {
                //         window.location = "${nextBasePage}/${nextPage}?id=${fileId}";
                //     } else {
                //         window.location = "${nextBasePage}/fail.html?id=${fileId}";
                //     }
                // } else {
                //     setTimeout(getInfo, 1000, fileId);
                // }
            }
        }
    }
    // 
    request.open("GET", API + "/api/repair/files/" + fileId + "/preview", true);
    // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
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
                getResultInfo(resp.downloadId);
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
    getResultInfo($_GET["id"]);
    getPreviewInfo($_GET["id"]);
} else {
    const id = sessionStorage.getItem("recoverytoolbox.lastid")
    if (id) {
        $_GET["id"] = id;
        getResultInfo(id);
        getPreviewInfo(id);
    }
}