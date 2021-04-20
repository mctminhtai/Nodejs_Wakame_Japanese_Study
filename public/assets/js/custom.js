// ob.classList.remove('active');
const urlParams = new URLSearchParams(window.location.search);
const currentPage = urlParams.get('page') || 1;
var ob = document.querySelectorAll('ul li.page-item');
var prelink = '';
if (currentPage <= 1) {
    prelink = '/blog?page=' + currentPage;
} else {
    prelink = '/blog?page=' + (currentPage - 1);
}

ob[0].lastChild.setAttribute("href", prelink);
numOfPage = ob.length - 2;
if (currentPage >= numOfPage) {
    nextlink = '/blog?page=' + currentPage;
} else {
    nextlink = '/blog?page=' + (currentPage + 1);
}
//console.log(ob[currentPage + 1].lastChild)
ob[ob.length - 1].lastChild.setAttribute("href", nextlink);
ob[currentPage].classList.add('active');
console.log(ob[currentPage].classList);
