langVal = 'en';
if (typeof lang !== 'undefined') {
    langVal = lang;
}

supportEntity = {
    nickname: "",
    email: "",
    message: "",
    language: langVal
}

$_GET = [];

function postFormData(url, callBack, onloadCallBack) {
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = callBack;
    request.onload = onloadCallBack;
    request.send(JSON.stringify(supportEntity));
}

function post() {
    var frm = document.querySelectorAll('.form-control');

    for (const key in frm) {
        if (Object.hasOwnProperty.call(frm, key)) {
            const element = frm[key];
            supportEntity[element.name] = element.value;
        }
    }

    function requestSupportStateChange() {
        if (debug) {
            console.log("request", this.readyState, this.status, this.response);
        }
        if (this.readyState == 4) {
            var messageEl = document.getElementById('messageModal');
            var messageModal = new bootstrap.Modal(messageEl);
            if (this.status == 200 && this.response) {
                resp = JSON.parse(this.response);

                messageEl.addEventListener('hidden.bs.modal', function (event) {
                    document.getElementById("frmSupport").reset();
                    document.forms[0].classList.remove('was-validated');
                })
                messageModal.show();

            } else if (this.status == 500) {
                if (this.response) {
                    resp = JSON.parse(this.response);
                    var errorMessage = resp.message;
                    alert('Request failed.  Returned status of ' + errorMessage);
                }
            }
        }
    }

    function errorState() {
        if (debug) {
            console.log("errorState", this.readyState, this.status, this.response);
        }
        if (this.readyState == 4) {
            // var messageEl = document.getElementById('messageModal');
            // var messageModal = new bootstrap.Modal(messageEl);
            if (this.status == 200 && this.response) {
                //     resp = JSON.parse(this.response);

                //     messageEl.addEventListener('hidden.bs.modal', function (event) {
                //         document.getElementById("frmSupport").reset();
                //         document.forms[0].classList.remove('was-validated');
                //     })
                //     messageModal.show();

            } else if (this.status == 500) {
                if (this.response) {
                    resp = JSON.parse(this.response);
                    var errorMessage = resp.message;
                    alert('Request failed.  Returned status of ' + errorMessage);
                }
            }
        }
    }

    postFormData(`${API}/cases/online`, requestSupportStateChange, errorState);
}

page_load_complete = () => {
    $_GET = getParams();
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                if (!form.checkValidity()) {
                    event.stopPropagation();
                } else {
                    post();
                }
                form.classList.add('was-validated');
            }, false)
        })
}

if (window.attachEvent) {
    window.attachEvent('onload', page_load_complete);
} else if (window.addEventListener) {
    window.addEventListener('load', page_load_complete, false);
} else {
    document.addEventListener('load', page_load_complete, false);
}