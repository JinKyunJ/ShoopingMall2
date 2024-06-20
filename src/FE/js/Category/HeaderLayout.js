// 페이지별 메뉴 항목 정의
const pageMenu = {
    "home": ["추천", "신상품", "베스트", "알뜰쇼핑"],
    "products": ["전자제품", "가구", "의류", "액세서리"],
    "sales": ["오늘의 할인", "주간 특가", "시즌 오퍼", "기획전"],
    "Category": ["밀키트", "샐러드", "..."],
    "ProductDetails":["상품설명","상세정보","상품후기","..."]
};

// 현재 페이지 ID를 찾아 반환
function getPageIdFinder() {
    return document.body.getAttribute('data-page-id');
}

// 메뉴 항목을 생성하여 추가하는 함수
function CreateMenu(menuItems) {
    const menuList = document.getElementById("Menu");
    
    // 기존 메뉴 항목 제거
    while (menuList.firstChild) {
        menuList.removeChild(menuList.firstChild);
    }

    // 새로운 메뉴 항목 생성 및 추가
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#"; // 여기서 필요한 링크로 변경 가능
        a.textContent = item;
        li.appendChild(a);
        menuList.appendChild(li); // 누락된 부분 추가
    });
}

// 외부 HTML 파일 로드 함수
function loadHTML(selector, url) {
    fetch(url)
        .then((response) => response.text())
        .then((data) => {
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = data;
                // 헤더가 로드된 후 카트 카운터 초기화 및 메뉴 생성
                if (selector === 'header') {
                    // 헤더 로드 후 페이지 메뉴 생성
                    const currentPage = getPageIdFinder();
                    CreateMenu(pageMenu[currentPage]);
                }
            } else {
                console.error("Element not found: ", selector);
            }
        })
        .catch(error => console.error("Error loading the HTML:", error));
}

// 페이지 로드 시 header와 footer를 불러옴
document.addEventListener("DOMContentLoaded", () => {
    loadHTML("header", "./layout/testHeader.html");
    loadHTML("footer", "./layout/footer.html");
});
