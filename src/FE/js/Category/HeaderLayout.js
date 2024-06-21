// 메뉴 항목 정의
const pageMenu = {
    "home": ["안녕하세요. YUMBOX 입니다", "", "", ""],
    "products": ["전자제품", "가구", "의류", "액세서리"],
    "sales": ["오늘의 할인", "주간 특가", "시즌 오퍼", "기획전"],
    "Category": ["전체","밀키트", "샐러드" ],
    "ProductDetails": ["상품설명", "상세정보", "상품후기", "..."]
};

// 현재 페이지 ID를 반환하는 함수
function getPageIdFinder() {
    return document.body.getAttribute('data-page-id');
}

// 메뉴 항목을 생성하는 함수
function CreateMenu(menuItems) {
    const menuList = document.getElementById("Menu");

    while (menuList.firstChild) {
        menuList.removeChild(menuList.firstChild);
    }

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = item;
        a.style.cursor = "pointer";
        li.appendChild(a);
        menuList.appendChild(li);

        // 카테고리 메뉴 클릭 이벤트 추가
        a.addEventListener('click', (event) => {
            event.preventDefault();
            const category = item === "전체" ? 'all' : item;
            fetchProducts(category); // 필터링 적용
        });
    });
}

// HTML 파일 로드 함수
function loadHTML(selector, url) {
    fetch(url)
        .then((response) => response.text())
        .then((data) => {
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = data;
                if (selector === 'header') {
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
    loadHTML("header", "../layout/testHeader.html");
    loadHTML("footer", "../layout/footer.html");
});
