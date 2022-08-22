var langVar = 'en';
if (typeof lang !== 'undefined') {
    langVar = lang;
}

function getFileInfo(fileId) {
    if (debug) {
        console.log("getInfo", fileId);
    }
    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('getFileInfo reqReadyStateChange', request, resp);
            }
            if (resp) {
                if (typeof resp.is_payed !== 'undefined' && resp.is_payed == true){
                    window.location = nextBasePage + "/download.html?id=" + fileId;
                }
                // lang = resp.lang;
                var amountPpEl = document.getElementById('amount_pp');
                if (amountPpEl) {
                    if (typeof amountPpEl.innerText !== 'undefined') {
                        amountPpEl.innerText = resp.amount_pp ? resp.amount_pp : '';
                    } else if (typeof amountPpEl.textContent !== 'undefined') {
                        amountPpEl.textContent = resp.amount_pp ? resp.amount_pp : '';
                    }
                }
                if (amountPpEl) {
                    if (typeof amountPpEl.innerText !== 'undefined' && amountPpEl.innerText != '') {
                        var val = amountPpEl.innerText.split(" ");
                        var valNum = Number(val);
                        gtag("event", "generate_lead", {
                            currency: "USD",
                            value: valNum
                        });
                    } else if (typeof amountPpEl.textContent !== 'undefined' && amountPpEl.textContent != '') {
                        var val = amountPpEl.textContent.split(" ");
                        var valNum = Number(val);
                        gtag("event", "generate_lead", {
                            currency: "USD",
                            value: valNum
                        });
                    }
                }
                var amountYaEl = document.getElementById('amount_ya');
                if (amountYaEl) {
                    if (typeof amountYaEl.innerText !== 'undefined') {
                        amountYaEl.innerText = resp.amount_ya ? resp.amount_ya : '';
                    } else if (typeof amountYaEl.textContent !== 'undefined') {
                        amountYaEl.textContent = resp.amount_ya ? resp.amount_ya : '';
                    }
                }
                
                if (resp.amount_ya) {
                    var parent = document.getElementById("amount_ya").parentElement.parentElement.parentElement;
                    if (parent.hasChildNodes()) {
                        var children = parent.childNodes;
                        for (var i = 0; i < children.length; ++i) {
                            if (children[i].removeAttribute) {children[i].removeAttribute("hidden");}
                        }
                    }
                    var or_el = document.getElementById('card-ya').parentNode.previousElementSibling;
                    if (or_el){
                        or_el.classList.add("order-2");
                    }      
                    or_el = document.getElementById('card-pp').parentNode.previousElementSibling;
                    if (or_el){
                        or_el.classList.add("order-2");
                    }
                    if (resp.is_ru_by){
                        var ya_el = document.getElementById('card-ya').parentElement;
                        if (ya_el){
                            ya_el.classList.add("order-1");
                        }
                        var pp_el = document.getElementById('card-pp').parentElement;
                        if (pp_el){
                            pp_el.classList.add("order-3");
                        }
                    } else {
                        var ya_el = document.getElementById('card-ya').parentElement;
                        if (ya_el){
                            ya_el.classList.add("order-3");
                        }
                        var pp_el = document.getElementById('card-pp').parentElement;
                        if (pp_el){
                            pp_el.classList.add("order-1");
                        }
                    }
                }
            }
        }
    }
    request.open("GET", API + "/api/repair/files/" + langVar + "/" + fileId + "/amount", true);
    request.onreadystatechange = reqReadyStateChange;
    request.send();
}

function getPayLink(fileId) {
    if (debug) {
        console.log("getPayLink", fileId);
    }
    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {

            if (debug) {
                console.log('getInfo reqReadyStateChange', request, request.response);
            }

            if (request.response) {
                var resp = JSON.parse(request.response);

                var cardPpEl = document.getElementById('card-pp');
                if (cardPpEl) {
                    cardPpEl.href = resp.pay_pro ? resp.pay_pro : '';
                } else {
                    document.getElementsByClassName('credit-card')[0].href = resp.pay_pro ? resp.pay_pro : '';
                    document.getElementById("link-text").href = resp.pay_pro ? resp.pay_pro : '';
                }
            }
        }
    }
    request.open("GET", API + "/api/repair/files/" + langVar + "/" + fileId +"/pay_link", true);
    request.onreadystatechange = reqReadyStateChange;
    request.send();
}

function getPayLinkForYa(fileId) {
    if (debug) {
        console.log("getPayLinkForYa", fileId);
    }
    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {

            if (debug) {
                console.log('getPayLinkForYa reqReadyStateChange', request, request.response);
            }

            var amountYaEl = document.getElementById('amount_ya');
            if (amountYaEl){
                if (typeof amountYaEl.innerText !== 'undefined' && amountYaEl.innerText != '') {
                    var val = amountYaEl.innerText.split(" ");
                    var valNum = Number(val);
                    gtag("event", "generate_lead", {
                       currency: "RUB",
                       value: valNum
                     }); 
                } else if (typeof amountYaEl.textContent !== 'undefined' && amountYaEl.textContent != ''){
                    var val = amountYaEl.textContent.split(" ");
                    var valNum = Number(val);
                    gtag("event", "generate_lead", {
                       currency: "RUB",
                       value: valNum
                     }); 
                }
            }

            if (request.response) {
                var resp = JSON.parse(request.response);

                if (debug) {
                    console.log('getPayLinkForYa reqReadyStateChange', request, request.response);
                }
    
                if (resp) {
                    window.open(resp.ya_link, "_self");
                }
            }
        }
    }
    request.open("GET", API + "/api/repair/files/" + langVar + "/" + fileId + "/pay_link_ya", true);
    request.onreadystatechange = reqReadyStateChange;
    request.send();
}

var $_GET = getParams();

if ($_GET && $_GET["id"]) {
    sessionStorage.setItem("recoverytoolbox.lastid", $_GET["id"])
    getFileInfo($_GET["id"]);
    getPayLink($_GET["id"]);
} else {
    const id = sessionStorage.getItem("recoverytoolbox.lastid")
    if (id) {
        $_GET["id"] = id;
        getFileInfo(id);
    }
}

function page_load_complete() {
    var btn = document.getElementById("card-ya");
    if (btn) {
        btn.addEventListener("click", function(event) {

            if (typeof gtag !== 'undefined') {
                gtag("event", "click_yandex_payment");
            } 

            event.preventDefault();
            event.stopPropagation();
            getPayLinkForYa($_GET["id"]);
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
