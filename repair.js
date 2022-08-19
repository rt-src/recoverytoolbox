confirm = (fileId) => {
    if (debug) {
        console.log("confirm", fileForUpload);
    }
    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('confirm reqReadyStateChange', request, resp);
            }
            if (resp.success) {

                if (typeof gtag !== 'undefined') {
                    gtag("event", "repairing_file_start");     
                }
                //TODO: return
                document.getElementById('progress-text').innerText = 0;
                document.getElementById("label_upload").setAttribute("hidden", true);
                document.getElementById("label_repair").removeAttribute("hidden");

                document.getElementById("progress-bar").classList.add("bg-success");
                setRepairProgress(0);
                setTimeout(getInfo, 1000, fileId);
            }
        }
    }

    request.open("POST", `${API}/api/files/confirm/${fileId}`, true);
    request.onreadystatechange = reqReadyStateChange;
    request.send();
}

getInfo = (fileId) => {
    if (debug) {
        console.log("getInfo", fileForUpload);
    }
    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('getInfo reqReadyStateChange', request, resp);
            }

            if (resp) {
                if (resp && resp.percent >= 0) {
                    setRepairProgress(resp.percent);
                    document.getElementById('progress-text').innerText = resp.percent;
                }
                if (resp.complete) {                    
                    setRepairProgress(100);

                    if (typeof gtag !== 'undefined') {
                        gtag("event", "repairing_file_finish");     
                    }

                    document.getElementById('progress-text').innerText = 100;
                    if (resp.success) {
                        window.location = `${nextBasePage}/${nextPage}?id=${fileId}`;
                    } else {
                        window.location = `${nextBasePage}/fail.html?id=${fileId}`;
                    }
                } else {
                    setTimeout(getInfo, 1000, fileId);
                }
            }
        }
    }

    request.open("GET", `${API}/api/repair/info/${fileId}`, true);
    // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = reqReadyStateChange;
    request.send();
}