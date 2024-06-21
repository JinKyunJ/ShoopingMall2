// 메뉴 항목 정의
const pageMenu = {
    "home": ["안녕하세요. YUMBOX 입니다", "", "", ""],
    "products": ["전자제품", "가구", "의류", "액세서리"],
    "sales": ["오늘의 할인", "주간 특가", "시즌 오퍼", "기획전"],
    "Category": ["전체", "밀키트", "샐러드"],
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

            if (getPageIdFinder() === "ProductDetails") {
                // ProductDetails 페이지에서 메뉴 클릭 시 섹션으로 스크롤 이동
                scrollToSection(item);
            } else if (getPageIdFinder() === "Category") {
                // Category 페이지에서 메뉴 클릭 시 카테고리 필터링
                fetchProducts(category); // Category 페이지에서만 카테고리 필터링 적용
            } else {
                console.log(`Category '${category}' clicked on page '${getPageIdFinder()}'`);
                // 다른 페이지의 경우 기본 동작 또는 추가적인 로직을 처리할 수 있습니다.
            }
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

                    // header가 로드된 후 카트 카운터 초기화 및 업데이트
                    initializeAndUpdateCartCounter();

                    // storage 이벤트 리스너 추가
                    window.addEventListener('storage', updateCartCounter);
                }
            } else {
                console.error("Element not found: ", selector);
            }
        })
        .catch(error => console.error("Error loading the HTML:", error));
}

// 섹션으로 스크롤 이동 함수
function scrollToSection(sectionName) {
    let sectionId;
    switch (sectionName) {
        case "상품설명":
            sectionId = "product-description-header";
            break;
        case "상세정보":
            sectionId = "product-details-header";
            break;
        case "상품후기":
            sectionId = "product-reviews-header";
            break;
        default:
            return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}

// 페이지 로드 시 header와 footer를 불러옴
document.addEventListener("DOMContentLoaded", () => {
    loadHTML("header", "../layout/testHeader.html");
    loadHTML("footer", "../layout/footer.html");
});

// 카트 카운터 초기화 및 업데이트 함수
function initializeAndUpdateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart items on page load or update:", cart); // 페이지 로드 또는 업데이트 시 로컬 스토리지 확인

    const counterElement = document.querySelector(".cart-counter");
    if (counterElement) {
        counterElement.textContent = cart.length.toString();
        counterElement.style.display = cart.length > 0 ? 'block' : 'none'; // 카트에 항목이 있을 때만 보이게
    } else {
        console.error(".cart-counter element not found.");
    }
}

// 카운터 업데이트 함수
function updateCartCounter() {
    console.log("updateCartCounter called");
    initializeAndUpdateCartCounter(); // 동일한 로직을 호출
}
