const allowedExt=["ai"," pdf"," rtf"," doc"," docx"," dot"," dotx"," xsl"," xls"," xlt"," xlsx"," xlsm"," xltm"," xltx"," xlam"," dbf"," ppt"," pptx"," mpp"," dbx"," psd"," ost"," pst"," mdb"," accdb"," cdr"," dwg"];"undefined"!=typeof Dropzone&&null!=Dropzone&&(Dropzone.autoDiscover=!1);const chunkSize=5242880;var fileForUpload=null,site="access",reviewInfo={},gaCode="G-C9KGLPG7VW";function validateEmail(){debug;var e=!0,t="",n=document.getElementById("email").value;n&&0!=n.length||(e=!1,t="Empty email");return/[a-z0-9!#$%&'*+/=?^_"{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_"{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(String(n).toLowerCase())||(e=!1,t="Incorrect email"),{ok:e,failMessage:t}}function validateFile(e){debug;var t=!0,n="";e&&0!=e.size||(t=!1,n="Zero file size or empty file");var o=e.name.split(".").last();return-1==allowedExt.indexOf(o.toLowerCase())&&(t=!1,n="Not Allowed type"),{ok:t,failMessage:n}}function validateApi(e,t,n){debug;var o=document.getElementById("email").value;if(!o||!fileForUpload)return document.getElementById("submit_file").disabled=!0,o||alert("email is not setted"),fileForUpload||alert("file is not selected"),!1;if("undefined"!=typeof lang&&lang,e.preventDefault(),e.stopPropagation(),t.ok){var i=document.getElementById("first_step_info_container");i&&i.setAttribute("hidden",!0),n.processQueue()}else document.getElementById("submit_file").disabled=!0}"undefined"!=typeof gacode&&(gaCode=gacode);const submit_file_click=function(e){debug,"undefined"!=typeof gtag&&gtag("event","upload_file_button_clicked");const t=document.getElementById("submit_file");var n=validateEmail();n.ok&&fileForUpload?(t.disabled=!1,t.removeAttribute("hidden")):t.disabled=!0,validateApi(e,n,dzClosure),e.preventDefault(),e.stopPropagation()},inputEmail=function(e){{debug,"undefined"!=typeof gtag&&gtag("event","change_email");var t=validateEmail();const e=document.getElementById("submit_file");t.ok&&fileForUpload?(e.disabled=!1,e.removeAttribute("hidden")):e.disabled=!0}},acceptfunction=function(e,t){debug,"undefined"!=typeof gtag&&gtag("event","select_file");var n=validateFile(e),o=document.getElementById("email").value;n.ok?(o&&(document.getElementById("submit_file").disabled=!1,document.getElementById("submit_file").removeAttribute("hidden")),document.getElementById("check").removeAttribute("hidden"),fileForUpload=e,t()):(document.getElementById("submit_file").disabled=!0,document.getElementById("check").setAttribute("hidden",!0),alert(n.failMessage),t(n.failMessage)),removeHash()},paramfunction=function(e,t,n){return n?{_chunkNumber:n.index,_uuid:n.file.upload.uuid,sessionId:n.file.upload.uuid,email:document.getElementById("email").value,_chunkSize:5242880,_totalSize:e[0].upload.total}:{_chunkNumber:0,_uuid:e[0].upload.uuid}},processingfunction=function(e){debug,"undefined"!=typeof gtag&&gtag("event","uploading_file_start")},sendingfunction=function(e,t,n){debug,document.getElementById("step_1").setAttribute("hidden",!0),document.getElementById("step_2").removeAttribute("hidden")},uploadprogressfunction=function(e,t,n){debug,t>100||setRepairProgress(t)},successfunction=function(e){debug,sendComplete(e)},completefunction=function(e){myDropzone.removeAllFiles(!0)},maxfilesexceededfunction=function(e){myDropzone.removeAllFiles(!0),myDropzone.addFile(e)};if("undefined"!=typeof Dropzone&&null!=Dropzone)var myDropzone=new Dropzone("#uploader",{url:API+"/api/files/upload-chunk",paramName:"file",chunking:!0,timeout:18e4,chunkSize:5242880,forceChunking:!0,parallelChunkUploads:!1,retryChunks:!0,maxFiles:1,clickable:".fileinput-button",autoProcessQueue:!1,maxFilesize:0,init:function(){dzClosure=this,document.getElementById("submit_file").addEventListener("click",submit_file_click);const e=document.getElementById("email");e.addEventListener("change",inputEmail),e.addEventListener("input",inputEmail),e.addEventListener("propertychange",inputEmail)},accept:acceptfunction,params:paramfunction,processing:processingfunction,sending:sendingfunction,uploadprogress:uploadprogressfunction,success:successfunction,complete:completefunction,maxfilesexceeded:maxfilesexceededfunction,dictDefaultMessage:""});function setRepairProgress(e){const t=Math.floor(e);document.getElementById("progress-bar").style.width=t+"%"}function sendComplete(e){debug,"undefined"!=typeof gtag&&gtag("event","uploading_file_finish");var t=document.getElementById("email").value,n="en";"undefined"!=typeof lang&&(n=lang);var o=new FormData;o.append("_uuid",e.upload.uuid),o.append("_filename",e.name),o.append("_totalChunkCount",e.upload.totalChunkCount),o.append("_email",t),o.append("_lang",n);var i=new XMLHttpRequest;i.open("POST",API+"/api/files/finished"),i.onreadystatechange=function(){4==i.readyState&&200==i.status&&i.response&&(resp=JSON.parse(i.response),debug,resp&&resp.success&&confirm(resp.id))},i.send(o)}function removeHash(){var e,t,n=window.location;debug,"pushState"in history?history.pushState("",document.title,n.pathname+n.search):(e=document.body.scrollTop,t=document.body.scrollLeft,n.hash="",document.body.scrollTop=e,document.body.scrollLeft=t)}function addGA4(){if(debug,0){function e(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],e("js",new Date),e("config",gaCode)}}var but=document.getElementsByClassName("dz-button");function page_load_complete(){var e=window.location;const t="#/repair/result/";if(e.hash.substring(0,t.length)==t){var n=e.hash.match("([0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})");if(n&&n.length>0){var o=n[1];window.location=nextBasePage+"/result.html?id="+o}}}but&&but.length>0&&(but[0].hidden=!0),window.attachEvent?window.attachEvent("onload",page_load_complete):window.addEventListener?window.addEventListener("load",page_load_complete,!1):document.addEventListener("load",page_load_complete,!1);