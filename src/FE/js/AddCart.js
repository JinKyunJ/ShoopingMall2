function loadCartItems() {
    const cartList = document.getElementById('cart-list'); //생성할 위치 리스트 가져옴
    let cartItems = JSON.parse(localStorage.getItem('cart')); //로컬에 넣어둔 목록을 가져옴

    console.log(cartItems);
    cartItems.forEach(item => {
        const li = document.createElement('li'); //엘리멘트 생성

        // li 테그 안에 넣어야 하니까 li를 제외한 테그를 넣음
        li.innerHTML = `
            <label>
                <input type="checkbox" />
            </label>
            <a href="#">
                <img src="${item.imageSrc}" class="product-image" alt="제품 이미지">
            </a>
            <div class="product-details">
                <a href="#">
                    <p class="product-title">${item.nameString}</p>
                </a>
                <div class="price-info">
                    <span class="discount-price">${calculateDiscountedPrice(item.originalPrice, item.discount)} </span>
                    <span class="sale-price">${item.originalPrice}원</span>
                </div>
                <div class="quantity-control">
                    <button aria-label="수량 내리기">-</button>
                    <div>${item.quantity}</div>
                    <button aria-label="수량 올리기">+</button>
                </div>
            </div>
            <button aria-label="삭제">✖</button>`;

        // 수량 감소 버튼
        li.querySelector('button[aria-label="수량 내리기"]').addEventListener('click', function () {
            updateQuantity(item, -1, li);
        });

        // 수량 증가 버튼
        li.querySelector('button[aria-label="수량 올리기"]').addEventListener('click', function () {
            updateQuantity(item, 1, li);
        });

        // 삭제 버튼
        li.querySelector('button[aria-label="삭제"]').addEventListener('click', function () {
            li.remove();
            let updatedCartItems = cartItems.filter(cartItem => cartItem.nameString !== item.nameString);
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        });

        cartList.appendChild(li);
    });
}

// 수량 업데이트 함수
function updateQuantity(item, delta, li) {
    let quantityElement = li.querySelector('.quantity-control div');
    let currentQuantity = parseInt(quantityElement.textContent, 10);
    let newQuantity = currentQuantity + delta;

    if (newQuantity < 1) return; // 수량이 1 이하로 내려가지 않도록

    // 수량 업데이트
    quantityElement.textContent = newQuantity;

    // 가격 업데이트
    updatePrice(item, newQuantity, li);

    // 로컬 스토리지 업데이트
    updateLocalStorage(item.nameString, newQuantity);
}

// 가격 업데이트 함수
function updatePrice(item, quantity, li) {
    let discountPriceElement = li.querySelector('.discount-price');
    let salePriceElement = li.querySelector('.sale-price');

    // '13,000원' 형식의 문자열에서 숫자만 추출하기
    let originalPrice = parseInt(item.originalPrice.replace(/[^\d]/g, ''), 10);
    let discountedPrice = calculateDiscountedPrice(originalPrice, item.discount);

    salePriceElement.textContent = `${(originalPrice * quantity).toLocaleString()}원`;
    discountPriceElement.textContent = `${(discountedPrice * quantity).toLocaleString()}원`;
}

// 로컬 스토리지 업데이트 함수
function updateLocalStorage(productName, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems = cartItems.map(cartItem => {
        if (cartItem.nameString === productName) {
            cartItem.quantity = newQuantity;
        }
        return cartItem;
    });

    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// 할인 가격 계산 함수
function calculateDiscountedPrice(originalPrice, discount) {
    return originalPrice * ((100 - discount) / 100);
}

// 페이지 로드 시 장바구니 항목을 로드
document.addEventListener('DOMContentLoaded', loadCartItems);

document.addEventListener('DOMContentLoaded', () => {
    // 닫기 버튼 클릭 이벤트 핸들러
    document.querySelector('.title button').addEventListener('click', () => {
        const previousPage = sessionStorage.getItem('previousPage');
        
        if (previousPage) {
            // 저장된 이전 페이지로 리디렉션
            window.location.href = previousPage;
        } else {
            // 이전 페이지 정보가 없으면 기본적으로 history.back() 사용
            history.back();
        }
    });
});