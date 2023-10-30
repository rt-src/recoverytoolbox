const allowedExt=["ai","pdf","rtf","doc","docx","dot","dotx","xsl","xls","xlt","xlsx","xlsm","xltm","xltx","xlam","dbf","ppt","pptx","mpp","dbx","psd","ost","pst","mdb","accdb","cdr","dwg"];"undefined"!=typeof Dropzone&&null!=Dropzone&&(Dropzone.autoDiscover=!1);const chunkSize=5242880;var fileForUpload=null,site="access",reviewInfo={},gaCode="G-C9KGLPG7VW";"undefined"!=typeof gacode&&(gaCode=gacode),validateEmail=()=>{debug;var e=!0,t="",a=document.getElementById("email").value;a&&0!=a.length||(e=!1,t="Empty email");return/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(String(a).toLowerCase())||(e=!1,t="Incorrect email"),{ok:e,failMessage:t}},validateFile=e=>{debug;var t=!0,a="";e&&0!=e.size||(t=!1,a="Zero file size or empty file");var d=e.name.split(".").last();return-1==allowedExt.indexOf(d.toLowerCase())&&(t=!1,a="Not Allowed type"),{ok:t,failMessage:a}},validateApi=(e,t,a)=>{debug;var d=document.getElementById("email").value;if(!d||!fileForUpload)return document.getElementById("submit_file").disabled=!0,d||alert("email is not setted"),fileForUpload||alert("file is not selected"),!1;if("undefined"!=typeof lang&&lang,e.preventDefault(),e.stopPropagation(),t.ok){var n=document.getElementById("first_step_info_container");n&&n.setAttribute("hidden",!0),a.processQueue()}else document.getElementById("submit_file").disabled=!0};const submit_file_click=function(e){debug,"undefined"!=typeof gtag&&gtag("event","upload_file_button_clicked");const t=document.getElementById("submit_file");var a=validateEmail();a.ok&&fileForUpload?(t.disabled=!1,t.removeAttribute("hidden")):t.disabled=!0,validateApi(e,a,dzClosure),e.preventDefault(),e.stopPropagation()},inputEmail=function(e){{debug,"undefined"!=typeof gtag&&gtag("event","change_email");var t=validateEmail();const e=document.getElementById("submit_file");t.ok&&fileForUpload?(e.disabled=!1,e.removeAttribute("hidden")):e.disabled=!0}};if("undefined"!=typeof Dropzone&&null!=Dropzone)var myDropzone=new Dropzone("#uploader",{url:`${API}/api/files/upload-chunk`,paramName:"file",chunking:!0,timeout:18e4,chunkSize:5242880,forceChunking:!0,parallelChunkUploads:!1,retryChunks:!0,maxFiles:1,clickable:".fileinput-button",autoProcessQueue:!1,maxFilesize:0,init:function(){dzClosure=this,document.getElementById("submit_file").addEventListener("click",submit_file_click);const e=document.getElementById("email");e.addEventListener("change",inputEmail),e.addEventListener("input",inputEmail),e.addEventListener("propertychange",inputEmail)},accept:(e,t)=>{debug,"undefined"!=typeof gtag&&gtag("event","select_file");var a=validateFile(e),d=document.getElementById("email").value;a.ok?(d&&(document.getElementById("submit_file").disabled=!1,document.getElementById("submit_file").removeAttribute("hidden")),document.getElementById("check").removeAttribute("hidden"),fileForUpload=e,t()):(document.getElementById("submit_file").disabled=!0,document.getElementById("check").setAttribute("hidden",!0),alert(a.failMessage),t(a.failMessage)),removeHash()},params:(e,t,a)=>a?{_chunkNumber:a.index,_uuid:a.file.upload.uuid,sessionId:a.file.upload.uuid,email:document.getElementById("email").value,_chunkSize:5242880,_totalSize:e[0].upload.total}:{_chunkNumber:0,_uuid:e[0].upload.uuid},processing:e=>{debug,"undefined"!=typeof gtag&&gtag("event","uploading_file_start")},sending:(e,t,a)=>{debug,document.getElementById("step_1").setAttribute("hidden",!0),document.getElementById("step_2").removeAttribute("hidden")},uploadprogress:(e,t,a)=>{debug,t>100||setRepairProgress(t)},success:e=>{debug,sendComplete(e)},complete:(...e)=>{debug,myDropzone.removeAllFiles(!0)},maxfilesexceeded:e=>{myDropzone.removeAllFiles(!0),myDropzone.addFile(e)},dictDefaultMessage:""});function setRepairProgress(e){const t=Math.floor(e);document.getElementById("progress-bar").style.width=t+"%"}function sendComplete(e){debug,"undefined"!=typeof gtag&&gtag("event","uploading_file_finish");var t=document.getElementById("email").value,a="en";"undefined"!=typeof lang&&(a=lang);var d=new FormData;d.append("_uuid",e.upload.uuid),d.append("_filename",e.name),d.append("_totalChunkCount",e.upload.totalChunkCount),d.append("_email",t),d.append("_lang",a);var n=new XMLHttpRequest;n.open("POST",`${API}/api/files/finished`),n.onreadystatechange=function(){4==n.readyState&&200==n.status&&n.response&&(resp=JSON.parse(n.response),debug,resp&&resp.success&&confirm(resp.id))},n.send(d)}function removeHash(){var e,t,a=window.location;debug,"pushState"in history?history.pushState("",document.title,a.pathname+a.search):(e=document.body.scrollTop,t=document.body.scrollLeft,a.hash="",document.body.scrollTop=e,document.body.scrollLeft=t)}addGA4=()=>{if(debug,0){function e(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],e("js",new Date),e("config",gaCode)}};var but=document.getElementsByClassName("dz-button");but&&but.length>0&&(but[0].hidden=!0),page_load_complete=()=>{var e=window.location;if(e.hash.startsWith("#/repair/result/")){var t=e.hash.match("([0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})");if(t&&t.length>0){var a=t[1];window.location=`${nextBasePage}/result.html?id=${a}`}}},window.attachEvent?window.attachEvent("onload",page_load_complete):window.addEventListener?window.addEventListener("load",page_load_complete,!1):document.addEventListener("load",page_load_complete,!1);