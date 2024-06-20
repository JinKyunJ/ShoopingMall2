function loadHTML(selector, url) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch((error) => console.error("Error loading the HTML:", error));
}

// 페이지 로드 시 header와 footer를 불러옴
document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header", "/src/FE/layout/header.html");
  loadHTML("footer", "/src/FE/layout/footer.html");
});
