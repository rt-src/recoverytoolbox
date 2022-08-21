const allowedExt = ["ai", "pdf", "rtf", "doc", "docx", "dot", "dotx", "xsl", "xls", "xlt", "xlsx", "xlsm", "xltm", "xltx", "xlam", "dbf", "ppt", "pptx", "mpp", "dbx", "psd", "ost", "pst", "dwg", "cdr", "mdb", "accdb"];

if (typeof Dropzone !== 'undefined' && Dropzone != null) {
    Dropzone.autoDiscover = false;
}

const chunkSize = 1024 * 1024 * 5;
var fileForUpload = null;
var site = "access"
var reviewInfo = {}

var gaCode = 'G-C9KGLPG7VW';
if (typeof gacode !== 'undefined') {
    gaCode = gacode;
}

function validateEmail() {
    if (debug) {
        console.log("validateEmail");
    }
    var ok = true;
    var failMessage = '';
    var email = document.getElementById('email').value;
    if (!email || email.length == 0) {
        ok = false;
        failMessage = "Empty email";
    }

    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!re.test(String(email).toLowerCase())) {
        ok = false;
        failMessage = "Incorrect email";
    }
    return {
        ok:ok,
        failMessage:failMessage
    }
}

function validateFile(file) {
    if (debug) {
        console.log("validateFile");
    }
    var ok = true;
    var failMessage = '';
    if (!file || file.size == 0) {
        ok = false;
        failMessage = "Zero file size or empty file"
    }
    var ext = file.name.split(".").last();
    if (allowedExt.indexOf(ext.toLowerCase()) == -1) {
        ok = false;
        failMessage = "Not Allowed type";
    }
    return {
        ok:ok,
        failMessage:failMessage
    }
}

function validateApi(event, v, dzClosure) {
    if (debug) {
        console.log("validateApi", fileForUpload);
    }

    var email = document.getElementById('email').value;

    if (!email || !fileForUpload) {
        document.getElementById("submit_file").disabled = true;
        // document.getElementById("submit_file").setAttribute("hidden", true);
        if (!email) {
            alert("email is not setted");
        }
        if (!fileForUpload) {
            alert("file is not selected");
        }
        // event.preventDefault();
        // event.stopPropagation();
        return false;
    }

    var langVar = 'en';
    if (typeof lang !== 'undefined') {
        langVar = lang;
    }

    var data = {};

    data['captcha'] = "";
    data['captchaToken'] = fileForUpload.upload.uuid;
    data['email'] = email;
    data['files'] = [{
        lastModifiedDate: fileForUpload.lastModifiedDate,
        name: fileForUpload.name,
        size: fileForUpload.size,
        type: fileForUpload.type,
    }]

    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('validateApi reqReadyStateChange', request, resp);
            }
            // return resp.success;
            if (resp.success) {
                event.preventDefault();
                event.stopPropagation();
                if (v.ok) {

                    // addGA4();

                    var container = document.getElementById('first_step_info_container');
                    if (container) {
                        container.setAttribute("hidden", true);
                    }

                    dzClosure.processQueue();
                } else {
                    document.getElementById("submit_file").disabled = true;
                    // document.getElementById("submit_file").setAttribute("hidden", true);

                    console.log('fail', v.failMessage);
                }
            } else {

                // if (resp.message) {
                //     alert(resp.message);
                // }
            }
        }
    }

    function errorState() {
        if (request.readyState == 4 && request.status != 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('validateApi errorState', request, resp);
            }
            if (!resp.success && resp.message) {
                alert(resp.message);
            }
        }
    }

    request.open("POST", API + "/api/repair/validate", true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = reqReadyStateChange;
    request.onload = errorState;
    request.send(JSON.stringify(data));
}

const submit_file_click = function (event) {
    if (debug) {
        console.log('submit_file');
    }

    if (typeof gtag !== 'undefined') {
        gtag("event", "upload_file_button_clicked");
    }

    const sfb = document.getElementById("submit_file");
    var v = validateEmail();
    if (v.ok && fileForUpload) {
        sfb.disabled = false;
        sfb.removeAttribute("hidden");

    } else {
        sfb.disabled = true;
    }
    validateApi(event, v, dzClosure);
    event.preventDefault();
    event.stopPropagation();
};

const inputEmail = function (e) {
    {
        if (debug) {
            console.log('onchange');
        }

        if (typeof gtag !== 'undefined') {
            gtag("event", "change_email");
        }

        var v = validateEmail();
        const sfb = document.getElementById("submit_file");
        if (v.ok && fileForUpload) {
            sfb.disabled = false;
            sfb.removeAttribute("hidden");

        } else {
            sfb.disabled = true;
        }
    }
}

if (typeof Dropzone !== 'undefined' && Dropzone != null) {

    var myDropzone = new Dropzone("#uploader", {
        url: `${API}/api/files/upload-chunk`,
        paramName: "file",
        chunking: true,
        timeout: 180000,
        chunkSize: chunkSize,
        forceChunking: true,
        parallelChunkUploads: false,
        retryChunks: true,
        // createImageThumbnails: false,
        maxFiles: 1,
        clickable: ".fileinput-button",
        autoProcessQueue: false,
        maxFilesize: 0,
        // maxFilesize: 1024 * 1024 * 1024 * 1024 * 1024, // 1Tb

        init: function () {
            dzClosure = this; // Makes sure that 'this' is understood inside the functions below.
            // for Dropzone to process the queue (instead of default form behavior):
            document.getElementById("submit_file").addEventListener("click", submit_file_click);
            const user_email = document.getElementById("email");
            user_email.addEventListener("change", inputEmail);
            user_email.addEventListener('input', inputEmail);
            user_email.addEventListener('propertychange', inputEmail);

        },
        // previewTemplate: "",
        // addedfile: (...args) => {
        //     if (debug) {
        //         console.log("addedfile", args);
        //     }
        // },
        accept: (file, done) => {
            if (debug) {
                console.log('accept', file);
            }

            if (typeof gtag !== 'undefined') {
                gtag("event", "select_file");
            }

            var v = validateFile(file);
            var email = document.getElementById('email').value;
            if (v.ok) {
                if (email) {
                    document.getElementById("submit_file").disabled = false;
                    document.getElementById("submit_file").removeAttribute("hidden");
                }
                document.getElementById("check").removeAttribute("hidden");
                fileForUpload = file;
                done();
            } else {
                document.getElementById("submit_file").disabled = true;
                // document.getElementById("submit_file").setAttribute("hidden", true);
                document.getElementById("check").setAttribute("hidden", true);
                alert(v.failMessage);
                done(v.failMessage);
            }
            removeHash();
        },
        params: (file, request, chunk) => {
            if (chunk) {
                return {
                    '_chunkNumber': chunk.index,
                    '_uuid': chunk.file.upload.uuid,
                    'sessionId': chunk.file.upload.uuid,
                    'email': document.getElementById('email').value,
                    '_chunkSize': chunkSize,
                    // '_currentChunkSize':,                
                    '_totalSize': file[0].upload.total,
                };
            } else {
                return {
                    '_chunkNumber': 0,
                    '_uuid': file[0].upload.uuid
                };
            }
        },

        processing: (file) => {
            if (debug) {
                console.log('sending', file);
            }

            if (typeof gtag !== 'undefined') {
                gtag("event", "uploading_file_start");
            }
        },
        sending: (file, xhr, formData) => {
            if (debug) {
                console.log('sending', file, xhr, formData);
            }

            //TODO: return
            // document.getElementById("offline").setAttribute("hidden", true);
            document.getElementById("step_1").setAttribute("hidden", true);
            document.getElementById("step_2").removeAttribute("hidden");
            // document.getElementById('progress-text').innerText = "Uploading file";

            // document.getElementById("s1").classList.add("d-none", "d-lg-block");
            // document.getElementById("s2").classList.remove("d-none", "d-lg-block");
            // // document.getElementById("s3").classList.remove("d-none","d-lg-block");
            // document.getElementById("sl2").classList.add("active");
            // document.getElementById("c2").classList.add("active");

        },
        uploadprogress: (file, loaded, total) => {
            if (debug) {
                console.log("uploadprogress", loaded, total);
            }
            if (loaded > 100) {
                return;
            }
            setRepairProgress(loaded);
        },
        success: (file) => {
            if (debug) {
                console.log("success", file);
            }
            sendComplete(file);
        },
        complete: (...args) => {
            if (debug) {
                console.log("complete", args);
            }
            myDropzone.removeAllFiles(true);
        },
        maxfilesexceeded: (files) => {
            myDropzone.removeAllFiles(true);
            myDropzone.addFile(files);
        },

        dictDefaultMessage: ''
    });

}

function setRepairProgress(percent) {
    const pvalue = Math.floor(percent);
    // const progress = pvalue < 100 ? pvalue : 100; 

    //TODO: return
    document.getElementById("progress-bar").style.width = pvalue + "%";
    // document.getElementsByClassName('result-progress')[0].innerText = pvalue + "%";
}

function sendComplete(file) {
    if (debug) {
        console.log("sendComplete", file);
    }

    if (typeof gtag !== 'undefined') {
        gtag("event", "uploading_file_finish");
    }

    var email = document.getElementById('email').value;

    var langVar = 'en';
    if (typeof lang !== 'undefined') {
        langVar = lang;
    }

    var formData = new FormData();
    formData.append('_uuid', file.upload.uuid);
    formData.append('_filename', file.name);
    formData.append('_totalChunkCount', file.upload.totalChunkCount);
    formData.append('_email', email);
    formData.append('_lang', langVar);

    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200 && request.response) {
            resp = JSON.parse(request.response);
            if (debug) {
                console.log('reqReadyStateChange', request, resp);
            }
            if (resp && resp.success) {
                // alert(resp.message);
                confirm(resp.id);

            }
        }
    }

    request.open("POST", `${API}/api/files/finished`);
    request.onreadystatechange = reqReadyStateChange;
    request.send(formData);
}

function removeHash() {
    var scrollV, scrollH, loc = window.location;
    if (debug) {
        console.log('removeHash', [window.location, scrollV, scrollH, loc, loc.hash]);
    }
    if ("pushState" in history)
        history.pushState("", document.title, loc.pathname + loc.search);
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

function addGA4() {
    if (debug) {
        console.log("load GA");
    }
    if (typeof gtag == 'undefined') {
        (function (i, s, o, g, r, a, m) {
            a = s.createElement(o)
            m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.googletagmanager.com/gtag/js?id=' + gaCode, 'gtag');
        if (typeof gaCode !== 'undefined' && typeof ga !== 'undefined') {
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', gaCode);
        }
    }
}



var but = document.getElementsByClassName('dz-button');

if (but && but.length > 0) {
    but[0].hidden = true;
}


// var $_GET = getParams();

// if ($_GET) {
// getReviewInfo();
// getMicroJsonInfo();
// }

function page_load_complete() {

    var loc = window.location;
    if (loc.hash.startsWith('#/repair/result/')) {
        var guidMatch = loc.hash.match('([0-9a-fA-F]{8}\-([0-9a-fA-F]{4}\-){3}[0-9a-fA-F]{12})');
        if (guidMatch && guidMatch.length > 0) {
            var guid = guidMatch[1];
            window.location = `${nextBasePage}/result.html?id=${guid}`;
        }
    }
}

if (window.attachEvent) {
    window.attachEvent('onload', page_load_complete);
} else if (window.addEventListener) {
    window.addEventListener('load', page_load_complete, false);
} else {
    document.addEventListener('load', page_load_complete, false);
}