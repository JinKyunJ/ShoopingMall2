function loadCartItems() {
    const cartList = document.getElementById('cart-list'); // 생성할 위치 리스트 가져옴
    let cartItems = JSON.parse(localStorage.getItem('cart')) || []; // 로컬에 넣어둔 목록을 가져옴

    if (cartItems.length === 0) {
        document.querySelector('.empty-cart').style.display = 'block'; // 장바구니에 항목이 없을 경우 메시지 표시
        console.log('장바구니에 항목이 없습니다.');
        // 금액을 0으로 설정
        updateTotals(0, 0);
        return;
    } else {
        document.querySelector('.empty-cart').style.display = 'none'; // 장바구니에 항목이 있을 경우 메시지 숨김
    }

    cartItems.forEach(item => {
        const li = document.createElement('li'); // 엘리멘트 생성

        // '13,000원' 형식의 문자열에서 숫자만 추출하기
        let originalPrice = parseInt(item.originalPrice.replace(/[^\d]/g, ''), 10);
        let discountedPrice = calculateDiscountedPrice(originalPrice, item.discountPercent);

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
                    <span class="discount-price">${formatPrice(discountedPrice)}원</span>
                    <span class="sale-price">${formatPrice(originalPrice)}원</span>
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
            updateTotals(); // 삭제 후 합계 업데이트
        });

        cartList.appendChild(li);
    });

    // 화면에 총 합계 업데이트
    updateTotals();
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

    // 합계 업데이트
    updateTotals();
}

// 가격 업데이트 함수
function updatePrice(item, quantity, li) {
    let discountPriceElement = li.querySelector('.discount-price');
    let salePriceElement = li.querySelector('.sale-price');

    // '13,000원' 형식의 문자열에서 숫자만 추출하기
    let originalPrice = parseInt(item.originalPrice.replace(/[^\d]/g, ''), 10);
    let discountedPrice = calculateDiscountedPrice(originalPrice, item.discountPercent);

    salePriceElement.textContent = `${formatPrice(originalPrice * quantity)}원`;
    discountPriceElement.textContent = `${formatPrice(discountedPrice * quantity)}원`;
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

// 총 합계 업데이트 함수
function updateTotals(totalSalePrice = null, totalDiscountPrice = null) {
    if (totalSalePrice === null || totalDiscountPrice === null) {
        // 초기화되지 않은 경우, 합계 계산을 수행
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        totalSalePrice = 0;
        totalDiscountPrice = 0;

        cartItems.forEach(item => {
            let originalPrice = parseInt(item.originalPrice.replace(/[^\d]/g, ''), 10);
            let discountedPrice = calculateDiscountedPrice(originalPrice, item.discountPercent);

            totalSalePrice += originalPrice * item.quantity;
            totalDiscountPrice += discountedPrice * item.quantity;
        });
    }

    document.getElementById('total-sale-price').textContent = `${formatPrice(totalSalePrice)}원`;
    document.getElementById('total-discount-price').textContent = `${formatPrice(totalDiscountPrice)}원`;

    // 결제 예정금액은 할인 적용 후 가격으로 설정
    document.getElementById('final-payment-price').textContent = `${formatPrice(totalDiscountPrice)}원`;
}

// 할인 가격 계산 함수
function calculateDiscountedPrice(originalPrice, discountPercent) {
    return originalPrice * ((100 - parseFloat(discountPercent)) / 100);
}

// 가격을 포맷팅하는 함수
function formatPrice(price) {
    return price.toLocaleString("ko-KR"); // 한국어 로케일에 맞게 천 단위 구분 기호를 추가
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

    // 로그인 상태에 따라 BuyButton의 텍스트 설정
    const token = localStorage.getItem('jwtToken'); // 로컬 스토리지에서 JWT 토큰 가져오기
    const buyButton = document.getElementById('BuyButton');

    if (token) {
        // 토큰이 있으면 "주문하기"로 설정
        buyButton.textContent = '주문하기';
    } else {
        // 토큰이 없으면 "로그인"으로 설정
        buyButton.textContent = '로그인';
    }

    // 로그인 버튼 클릭 이벤트 핸들러
    buyButton.addEventListener('click', () => {
        if (token) {
            // 토큰이 존재하면 주문 페이지로 이동
            window.location.href = '/order';
        } else {
            // 토큰이 없으면 로그인 페이지로 이동
            window.location.href = '/login';
        }
    });
});
