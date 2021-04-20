// ob.classList.remove('active');
const urlParams = new URLSearchParams(window.location.search);
const currentPage = urlParams.get('page') || 1;
var querystring = urlParams.get('q') || '';
var categorystring = urlParams.get('category') || '';
if (querystring != '') {
    querystring = '&q=' + querystring.replace(/ /g, '+');
}
if (categorystring != '') {
    categorystring = '&category=' + categorystring.replace(/ /g, '+');
}

var ob = document.querySelectorAll('ul li.page-item');
var prelink = '';
ob.forEach((val, index) => {
    var link = window.location.pathname + '?page=' + index + querystring + categorystring;
    val.lastChild.setAttribute("href", link);
    if (index == 0) {
        if (currentPage <= 1) {
            prelink = window.location.pathname + '?page=' + currentPage + querystring + categorystring;
        } else {
            prelink = window.location.pathname + '?page=' + (currentPage - 1) + querystring + categorystring;
        }
        ob[0].lastChild.setAttribute("href", prelink);
    }
    if (index == (ob.length - 1)) {
        numOfPage = ob.length - 2;
        if (currentPage >= numOfPage) {
            nextlink = window.location.pathname + '?page=' + currentPage + querystring + categorystring;
        } else {
            nextlink = window.location.pathname + '?page=' + (Number(currentPage) + 1) + querystring + categorystring;
        }
        ob[ob.length - 1].lastChild.setAttribute("href", nextlink);
    }
});


//console.log(ob[currentPage + 1].lastChild)

ob[currentPage].classList.add('active');
