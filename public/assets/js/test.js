var url = window.location.href;
var id = url.split(`${location.origin}/`)[1].split("/")[0];
var loc = document.querySelectorAll("a[href='" + '/' + id + "']");
if (id.length != 0) {
    loc[0].classList.add("onpage");
}

