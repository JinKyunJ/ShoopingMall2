document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();

    // X 버튼 클릭 시 이전 페이지로 이동
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

function loadCartItems() {
    const cartList = document.getElementById('cart-list');
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    console.log("Initial cart items:", cartItems);
    if (cartItems.length === 0) {
        document.querySelector('.empty-cart').style.display = 'block';
        console.log('장바구니에 항목이 없습니다.');
        updateTotals(0, 0);
        return;
    } else {
        document.querySelector('.empty-cart').style.display = 'none';
    }

    document.getElementById('TotalNum').textContent = cartItems.length;

    cartItems.forEach(item => {
        const li = document.createElement('li');

        let originalPrice = parseInt(item.originalPrice.replace(/[^\d]/g, ''), 10);
        let discountedPrice = calculateDiscountedPrice(originalPrice, item.discountPercent);

        li.innerHTML = `
            <label>
                <input type="checkbox" class="item-checkbox" />
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

        li.querySelector('button[aria-label="수량 내리기"]').addEventListener('click', function () {
            updateQuantity(item, -1, li);
        });

        li.querySelector('button[aria-label="수량 올리기"]').addEventListener('click', function () {
            updateQuantity(item, 1, li);
        });

        li.querySelector('button[aria-label="삭제"]').addEventListener('click', function () {
            li.remove();
            cartItems = cartItems.filter(cartItem => cartItem.nanoID !== item.nanoID);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            console.log("Updated cart items after deletion:", cartItems);
            updateTotals();
        });

        li.querySelector('input[type="checkbox"]').addEventListener('change', updateSelectedCount);

        cartList.appendChild(li);
    });

    document.getElementById('allCheck').addEventListener('change', toggleSelectAll);
    document.getElementById('deleteSelected').addEventListener('click', deleteSelectedItems);

    updateTotals();
}

function updateQuantity(item, delta, li) {
    let quantityElement = li.querySelector('.quantity-control div');
    let currentQuantity = parseInt(quantityElement.textContent, 10);
    let newQuantity = currentQuantity + delta;

    if (newQuantity < 1) return;

    quantityElement.textContent = newQuantity;
    updatePrice(item, newQuantity, li);
    updateLocalStorage(item.nanoID, newQuantity);
    updateTotals();
}

function updatePrice(item, quantity, li) {
    let discountPriceElement = li.querySelector('.discount-price');
    let salePriceElement = li.querySelector('.sale-price');

    let originalPrice = parseInt(item.originalPrice.replace(/[^\d]/g, ''), 10);
    let discountedPrice = calculateDiscountedPrice(originalPrice, item.discountPercent);

    salePriceElement.textContent = `${formatPrice(originalPrice * quantity)}원`;
    discountPriceElement.textContent = `${formatPrice(discountedPrice * quantity)}원`;
}

function updateLocalStorage(productID, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems = cartItems.map(cartItem => {
        if (cartItem.nanoID === productID) {
            cartItem.quantity = newQuantity;
        }
        return cartItem;
    });

    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function updateTotals(totalSalePrice = null, totalDiscountPrice = null) {
    if (totalSalePrice === null || totalDiscountPrice === null) {
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
    document.getElementById('final-payment-price').textContent = `${formatPrice(totalDiscountPrice)}원`;
}

function calculateDiscountedPrice(originalPrice, discountPercent) {
    return originalPrice * ((100 - parseFloat(discountPercent)) / 100);
}

function formatPrice(price) {
    return price.toLocaleString("ko-KR");
}

// 체크박스 상태 업데이트 함수
function toggleSelectAll(event) {
    const allChecked = event.target.checked;
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = allChecked;
    });
    updateSelectedCount();
}

// 선택된 항목 수 업데이트 함수
function updateSelectedCount() {
    const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked').length;
    document.getElementById('selectNum').textContent = selectedCheckboxes;

    // 전체 체크박스 상태 업데이트
    const allCheckboxes = document.querySelectorAll('.item-checkbox').length;
    const allChecked = selectedCheckboxes === allCheckboxes;
    document.getElementById('allCheck').checked = allChecked;
}

// 선택된 항목 삭제 함수
function deleteSelectedItems() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked');

    selectedCheckboxes.forEach(checkbox => {
        const li = checkbox.closest('li');
        const productName = li.querySelector('.product-title').textContent;

        // 삭제
        cartItems = cartItems.filter(cartItem => cartItem.nameString !== productName);
        li.remove();
    });

    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log("Updated cart items after deletion:", cartItems);

    updateSelectedCount();
    updateTotals();
}
