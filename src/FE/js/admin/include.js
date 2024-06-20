function loadHTML(selector, url) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch((error) => console.error("Error loading the HTML:", error));
}

// 페이지 로드 시 header와 nav 불러옴
document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header", "/Admin/layout/header.html");
  loadHTML("nav", "/Admin/layout/menu.html");

  // nav 로드가 완료된 후 admin.js의 로직을 실행
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/js/admin/admin.js";
  document.body.appendChild(script);
});
