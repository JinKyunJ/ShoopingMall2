const CLOSETIME = 1000; // 5초로 설정

// 페이지 이동 버튼
const ViewProductPage = document.querySelectorAll(".swiper-slide");
ViewProductPage.forEach(product => {
    product.addEventListener('click', () => {
        window.location.href = "../../ProductList/ProductList.html"; // 상대경로 사용
    });
});

// 담기 버튼 클릭
document.addEventListener("DOMContentLoaded", () => {
    let quantity = 1; // 모달의 수량을 저장하는 변수
    
    // 모달 열기 버튼 이벤트 리스너 설정
    document.querySelectorAll(".Cart-Btns").forEach( button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation(); //이벤트 전달 안되게 하기

            const findElement = button.closest('.swiper-slide');
            //if (!findElement) return;
            
            //가지고있는 아이템 연결
            const product = {
                title: findElement.querySelector('.title').textContent,
                price: findElement.querySelector('.price').textContent,
                discountedPrice: findElement.querySelector('.dc-price .price').textContent,
                discount: findElement.querySelector('.percent')?.textContent || '0%',
                image: findElement.querySelector('.Goods-Image img').src.split('/').pop()
            };

            showModal(product);//링크 열기
        });
    });

        // 모달 열기 및 제품 정보 설정 함수
        function showModal(product) 
        {

            const modal = document.getElementById('CartModal');
            modal.classList.remove('hidden');
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

            document.getElementById('increaseQtyBtn').addEventListener('click', () => {
                quantity++;
                productQuantityElement.textContent = quantity;
                decreaseQtyBtn.disabled = false;
            });

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
        
    // 초기 카트 카운터 설정
    initializeCartCounter();
});

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
