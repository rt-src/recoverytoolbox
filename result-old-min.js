var secondTry=!1;function convertPreviewTreeNodeToHtml(e,t){void 0===t&&(t=!1);var n=['<li class="expanded '+(t?"my-3":"")+">"];return n.push("<span>"+e.folderName+"</span>"),n.push("<ol>"),"0"!=e.folderItems&&n.push('<li class="normal text-truncate" style="max-width: 171px;">'+reviewTreeNode.folderItems+" items elements</li>"),e.children instanceof Array&&e.children.length>0&&e.children.forEach((function(e){var t=convertPreviewTreeNodeToHtml(e);n.push(t)})),n.push("</ol>"),n.push("</li>"),n.join("")}function getResultInfo(e){debug;var t=new XMLHttpRequest;t.open("GET",API+"/api/repair/files/"+e+"/result",!0),t.onreadystatechange=function(){if(4==t.readyState&&200==t.status&&t.response&&(resp=JSON.parse(t.response),debug,resp)){if(void 0!==document.getElementById("src-filename").innerText?(document.getElementById("src-filename").innerText=resp.SourceName,document.getElementById("res-size").innerText=resp.Size,document.getElementById("src-size").innerText=resp.SourceSize,document.getElementById("report").innerText=resp.ReportContent):void 0!==document.getElementById("src-filename").textContent&&(document.getElementById("src-filename").textContent=resp.SourceName,document.getElementById("res-size").textContent=resp.Size,document.getElementById("src-size").textContent=resp.SourceSize,document.getElementById("report").textContent=resp.ReportContent),document.getElementById("rt-next-button").addEventListener("click",(function(){"undefined"!=typeof gtag&&gtag("event","click_next_button_to_payment_page"),window.location=nextBasePage+"/payment.html?id="+e}),!1),resp.DemoCount>0&&(document.getElementById("btn-demo").removeAttribute("hidden"),document.getElementById("btn-demo").addEventListener("click",(function(){"undefined"!=typeof gtag&&gtag("event","click_demo_download_button");var t=API+"/repair/demo/"+e+"/1";window.open(t,"_blank")}),!1)),resp.PrerviewCount>0)if(".mdb"!=resp.Type&&".accdb"!=resp.Type||""==resp.PreviewJson)if(".ost"==resp.Type&&""!=resp.PreviewJson){previewJson=JSON.parse(resp.PreviewJson),debug,(i=document.getElementById("btn-json-preview")).setAttribute("data-src","#dialog-content-tree"),i.removeAttribute("hidden");var n=[];n=previewJson instanceof Array&&previewJson.length>0?previewJson:[previewJson];var r="";n.forEach((function(e){r+=convertPreviewTreeNodeToHtml(e,!0)})),document.getElementById("root-tree").innerHTML=r,document.getElementById("btn-preview").addEventListener("click",(function(){"undefined"!=typeof gtag&&gtag("event","click_preview_button"),document.getElementsByClassName("fancybox")[0].click()}),!1)}else{(i=document.getElementById("btn-preview")).removeAttribute("hidden"),i.href=API+"/repair/preview/"+e+"/1.jpg";const t=document.getElementById("fancybox-popup-form");for(var o=1;o<=resp.PrerviewCount;o++){var s=document.createElement("a");s.classList.add("fancybox"),s.setAttribute("rel","group"),s.setAttribute("data-fancybox","images"),s.href=API+"/repair/preview/"+e+"/"+(o-1)+".jpg";var a=document.createElement("img");a.src=API+"/repair/preview/thmb/"+e+"/"+(o-1)+".jpg",s.appendChild(a),t.appendChild(s)}document.getElementById("btn-preview").addEventListener("click",(function(){"undefined"!=typeof gtag&&gtag("event","click_preview_button"),document.getElementsByClassName("fancybox")[0].click()}),!1)}else{var i;if(previewJson=JSON.parse(resp.PreviewJson),debug,(i=document.getElementById("btn-json-preview")).removeAttribute("hidden"),void 0!==previewJson.Tables){var d=document.getElementById("v-pills-tab");for(var l in leftPanelInnerHTML="",previewJson.Tables)if(Object.hasOwnProperty.call(previewJson.Tables,l)){previewJson.Tables[l];var c=Object.keys(previewJson.Tables).indexOf(l);leftPanelInnerHTML+='<a class="nav-link '+(0==c?"active":"")+'" id="v-pills-table-'+c+'-tab" data-toggle="pill" data-bs-toggle="pill" href="#table-'+c+'" role="tab" aria-controls="v-pills-table-'+c+'" aria-selected="true">'+l+"</a>"}d.innerHTML=leftPanelInnerHTML;var p=document.getElementById("v-pills-tabContent"),u=[],m=0;for(var l in previewJson.Tables)if(Object.hasOwnProperty.call(previewJson.Tables,l)){const e=previewJson.Tables[l];const t='<div class="tab-pane fade '+(0==(c=Object.keys(previewJson.Tables).indexOf(l))?"show active":"")+'" id="table-'+c+'" role="tabpanel" aria-labelledby="v-pills-table-'+c+'-tab"><div class="table-responsive py-2"><table class="table-preview">';var g="<thead><tr>";const n="</table></div></div>";e instanceof Array&&e.forEach((function(e,t){var n="";if(e instanceof Array)0==t?(n='<th scope="col">&nbsp;</th>',e.forEach((function(e){n+='<th scope="col">'+e+"</th>"})),n+='<th scope="col">&nbsp;</th></tr></thead><tbody>',m=e.length):(n='<th scope="row">&nbsp;</th>',e.forEach((function(e){n+="<td>"+e+"</td>"})),n+='<th scope="row">&nbsp;</th></tr>'),g+=n;else if("string"==typeof e){var r=e.trim().split(" ");r.length>0&&parseInt(r[0])&&(n='<tr><th scope="row">&nbsp;</th><td class="text-center" colspan="'+m+'"><strong><span class="color-light-green-dark fs-1">'+r[0]+'</span> rows more...</strong></td><th scope="row">&nbsp;</th></tr>'),g+=n}})),u.push(t+g+n)}p.innerHTML=u.join("")}document.getElementById("btn-preview").addEventListener("click",(function(){"undefined"!=typeof gtag&&gtag("event","click_preview_button"),document.getElementsByClassName("fancybox")[0].click()}),!1)}resp.Paid&&document.getElementById("rt-next-button").addEventListener("click",(function(){"undefined"!=typeof gtag&&gtag("event","click_next_button_to_download_page"),window.location=nextBasePage+"/download.html?id="+e}),!1)}},t.onload=function(){4!=t.readyState||200==t.status||secondTry||(secondTry=!0,setTimeout((function(){getResultInfo(e)}),1e3))},t.send()}function getPreviewInfo(e){debug;var t=new XMLHttpRequest;t.open("GET",API+"/api/repair/files/"+e+"/preview",!0),t.onreadystatechange=function(){4==t.readyState&&200==t.status&&t.response&&(resp=JSON.parse(t.response),debug,resp)},t.send()}function getResultInfoByOrderId(e){debug;var t=new XMLHttpRequest;t.open("GET",API+"/api/payments/getcid/"+e,!0),t.onreadystatechange=function(){4==t.readyState&&200==t.status&&t.response&&(resp=JSON.parse(t.response),debug,resp&&resp.success&&getResultInfo(resp.downloadId))},t.send()}var $_GET=getParams();if($_GET&&$_GET.order_id)debug,getResultInfoByOrderId($_GET.order_id);else if($_GET&&$_GET.id)sessionStorage.setItem("recoverytoolbox.lastid",$_GET.id),getResultInfo($_GET.id),getPreviewInfo($_GET.id);else{const e=sessionStorage.getItem("recoverytoolbox.lastid");e&&($_GET.id=e,getResultInfo(e),getPreviewInfo(e))}