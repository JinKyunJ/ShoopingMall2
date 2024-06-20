// 어드민페이지 공통 js

const menuBtn = document.getElementById("openMenuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  if (menu.className.includes("active")) {
    menu.classList.remove("active");
  } else {
    menu.classList.add("active");
  }
});
