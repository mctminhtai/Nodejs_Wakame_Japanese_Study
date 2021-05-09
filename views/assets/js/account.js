const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
window.onload=function showForm(){
  document.getElementById("form").style.opacity=1;
}

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
function offNoti() {
  element = document.getElementById("error");
  element.classList.remove("flag");
}



