let langVar="en";"undefined"!=typeof lang&&(langVar=lang),getFileInfo=e=>{debug;var t=new XMLHttpRequest;t.open("GET",`${API}/api/repair/files/${langVar}/${e}/amount`,!0),t.onreadystatechange=function(){if(4==t.readyState&&200==t.status&&t.response&&(resp=JSON.parse(t.response),debug,resp)){var e=document.getElementById("amount_pp");if(e&&(e.innerText=resp.amount_pp??""),e&&""!=e.innerText){var a=e.innerText.split(" "),n=Number(a);gtag("event","generate_lead",{currency:"USD",value:n})}var r=document.getElementById("amount_ya");if(r&&(r.innerText=resp.amount_ya??""),resp.amount_ya){var d=document.getElementById("amount_ya").parentElement.parentElement.parentElement;if(d.hasChildNodes())for(var o=d.childNodes,s=0;s<o.length;++s)o[s].removeAttribute&&o[s].removeAttribute("hidden");var i,l,p=document.getElementById("card-ya").parentNode.previousElementSibling;if(p&&p.classList.add("order-2"),(p=document.getElementById("card-pp").parentNode.previousElementSibling)&&p.classList.add("order-2"),resp.is_ru_by)(i=document.getElementById("card-ya").parentElement)&&i.classList.add("order-1"),(l=document.getElementById("card-pp").parentElement)&&l.classList.add("order-3");else(i=document.getElementById("card-ya").parentElement)&&i.classList.add("order-3"),(l=document.getElementById("card-pp").parentElement)&&l.classList.add("order-1")}}},t.send()},getPayLink=e=>{debug;var t=new XMLHttpRequest;t.open("GET",`${API}/api/repair/files/${langVar}/${e}/pay_link`,!0),t.onreadystatechange=function(){if(4==t.readyState&&200==t.status&&t.response&&(debug,t.response)){var e=JSON.parse(t.response),a=document.getElementById("card-pp");a?a.href=e.pay_pro??"":(document.getElementsByClassName("credit-card")[0].href=e.pay_pro??"",document.getElementById("link-text").href=e.pay_pro??"")}},t.send()},getPayLinkForYa=e=>{debug;var t=new XMLHttpRequest;t.open("GET",`${API}/api/repair/files/${langVar}/${e}/pay_link_ya`,!0),t.onreadystatechange=function(){if(4==t.readyState&&200==t.status&&t.response){debug;var e=document.getElementById("amount_ya");if(e&&""!=e.innerText){var a=e.innerText.split(" "),n=Number(a);gtag("event","generate_lead",{currency:"RUB",value:n})}if(t.response){var r=JSON.parse(t.response);debug,r&&window.open(r.ya_link,"_self")}}},t.send()};var $_GET=getParams();if($_GET&&$_GET.id)sessionStorage.setItem("recoverytoolbox.lastid",$_GET.id),getFileInfo($_GET.id),getPayLink($_GET.id);else{const e=sessionStorage.getItem("recoverytoolbox.lastid");e&&($_GET.id=e,getFileInfo(e))}page_load_complete=()=>{var e=document.getElementById("card-ya");e&&e.addEventListener("click",(()=>{"undefined"!=typeof gtag&&gtag("event","click_yandex_payment"),event.preventDefault(),event.stopPropagation(),getPayLinkForYa($_GET.id)}),!1)},window.attachEvent?window.attachEvent("onload",page_load_complete):window.addEventListener?window.addEventListener("load",page_load_complete,!1):document.addEventListener("load",page_load_complete,!1);