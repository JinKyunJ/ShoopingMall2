const CLOSETIME = 1000; // 5초로 설정

// 페이지 이동 버튼
const ViewProductPage = document.querySelectorAll(".swiper-slide");
ViewProductPage.forEach(product => {
    product.addEventListener('click', () => {
        window.location.href = "../../ProductList/ProductList.html"; // 상대경로 사용
    });
});

let quantity = 0; // 모달의 수량을 저장하는 변수
document.addEventListener("DOMContentLoaded", () => {
    // 모달 열기 버튼 이벤트 리스너 설정
    initializeCartCounter(); //
    console.log("페이지 오픈");
    document.querySelectorAll(".Cart-Btns").forEach( button => {
        button.addEventListener('click', (event) => 
        {
            //이벤트 전달 안되게 뒤에 a링크하고 버튼이 겹쳐서 이벤트가 발생하는걸 막음
            event.preventDefault();
            event.stopPropagation(); 

            const findElement = button.closest('.swiper-slide');
                if (!findElement) return;
            
            //가지고있는 아이템 연결
            const product = {
                title: findElement.querySelector('.title').textContent,
                price: findElement.querySelector('.price').textContent,
                discountedPrice: findElement.querySelector('.dc-price .price').textContent,
                discount: findElement.querySelector('.percent')?.textContent || '0%',
                image: findElement.querySelector('.Goods-Image img').src.split('/').pop()
            };

            showModal(product); //모달 오픈
        });
    });
});

function showModal(product)
{
    const modal = document.getElementById('CartModal');
    modal.classList.remove('hidden'); //히든으로 모달을 숨겨놨는데 class리스트를 제거해서 시각화함
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
    const decreaseQtyBtn = document.getElementById('decreaseQtyBtn'); //수량감소
    productQuantityElement.textContent = quantity;
    decreaseQtyBtn.disabled = true; //수량이 1이라서 비활성화

    //수량증가 로직
    document.getElementById('increaseQtyBtn').addEventListener('click', () => {
        quantity++;
        productQuantityElement.textContent = quantity;
        decreaseQtyBtn.disabled = false;
    });
    //수량 감소 로직
    decreaseQtyBtn.addEventListener('click', () => {
        if (quantity > 1)
        {
            quantity--;
            productQuantityElement.textContent = quantity;//텍스트 표시
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
