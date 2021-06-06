var url = window.location.href;
var id = url.split(`${location.origin}/`)[1].split("/")[0];
var loc = document.querySelectorAll("#navigation .nav-item");
if (id.length == 0) {
    loc[0].classList.add("onpage");
} else {
    loc = document.querySelector("#navigation a[href='/" + id + "']");
    loc.classList.add("onpage");
}

