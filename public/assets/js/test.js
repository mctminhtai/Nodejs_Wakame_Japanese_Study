var url=window.location.href;
var id = url.split("http://127.0.0.1:3000/")[1].split("/")[0];
var loc =document.querySelectorAll("a[href='"+'/'+id+"']");
if(id.length!=0){
    loc[0].classList.add("onpage");
}

