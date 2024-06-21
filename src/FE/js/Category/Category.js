const CLOSETIME = 1000; // 5초로 설정

let quantity = 0; // 모달의 수량을 저장하는 변수
document.addEventListener("DOMContentLoaded", () => {
    initializeCartCounter(); // 장바구니 카운터 초기화
    console.log("페이지 오픈");

    document.querySelectorAll(".Cart-Btns").forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const findElement = button.closest('.swiper-slide');
            if (!findElement) return;

            const product = {
                title: findElement.querySelector('.title').textContent,
                price: findElement.querySelector('.price').textContent,
                discountedPrice: findElement.querySelector('.dc-price .price').textContent,
                discount: findElement.querySelector('.percent')?.textContent || '0%',
                image: findElement.querySelector('.Goods-Image img').src.split('/').pop()
            };

            showModal(product); // 모달 오픈
        });
    });
});

function showModal(product) {
    const modal = document.getElementById('CartModal');
    modal.classList.remove('hidden'); // 히든으로 모달을 숨겨놨는데 class리스트를 제거해서 시각화함
    modal.classList.add('show');

    // 모달에 제품 정보 설정
    document.getElementById('ModalProductName').textContent = product.title;
    document.getElementById('ModalProductPrice').textContent = product.price;
    document.getElementById('ModalProductDiscountedPrice').textContent = product.discountedPrice;
    document.getElementById('ModalproductSale').textContent = product.discount;
    document.getElementById('ModalProductImage').src = `../img/TextImage/${product.image}`;

    // 초기 수량 설정
    quantity = 1;
    const productQuantityElement = document.getElementById('productQuantity');
    const decreaseQtyBtn = document.getElementById('decreaseQtyBtn');
    productQuantityElement.textContent = quantity;
    decreaseQtyBtn.disabled = true;

    // 수량 증가 로직
    document.getElementById('increaseQtyBtn').addEventListener('click', () => {
        quantity++;
        productQuantityElement.textContent = quantity;
        decreaseQtyBtn.disabled = false;
    });

    // 수량 감소 로직
    decreaseQtyBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            productQuantityElement.textContent = quantity;
            if (quantity === 1) {
                decreaseQtyBtn.disabled = true;
            }
        }
    });

    // 일정 시간 후에 모달을 자동으로 닫기
    setTimeout(() => {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }, CLOSETIME);
}

/*
 * 페이지가 새로고침되거나 처음 오픈될 때
 */
function initializeCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const counterElement = document.querySelector('.cart-counter');
    if (counterElement) {
        counterElement.textContent = cart.length;
    }
}
