// modal.js
document.addEventListener("DOMContentLoaded", function () {
    // 모달 팝업을 동적으로 로드
    fetch("../layout/modal.html")
        .then(response => response.text())
        .then(html => {
            // 동적으로 로드한 HTML을 현재 페이지에 추가
            document.body.insertAdjacentHTML("beforeend", html);
            setupModal(); // 모달 관련 이벤트 설정
        });

    // 모달 관련 이벤트 설정
    function setupModal() {
        const CLOSETIME = 5000; // 모달 자동 닫기 시간 (5초)
        let quantity = 1; // 수량 초기화

        // 담기 버튼 클릭 이벤트
        document.querySelectorAll(".Cart-Btn").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();

                // 모달 표시
                const modal = document.getElementById("CartModal");
                modal.classList.remove("hidden");
                modal.classList.add("show");

                // 클릭된 버튼에 해당하는 제품 요소를 찾음
                const findElement = button.closest(".swiper-slide");
                if (!findElement) return;

                // 제품 정보를 가져옴
                const productName = findElement.querySelector(".title").textContent;
                const productPrice = findElement.querySelector(".price").textContent;
                const discountedPrice = findElement.querySelector(".dc-price .price").textContent;
                const productImageSrc = findElement.querySelector(".Goods-Image img").src;
                const discountPercent = findElement.querySelector(".percent")?.textContent || "0%";

                // 모달에 제품 정보를 설정
                document.getElementById("ModalProductName").textContent = productName;
                document.getElementById("ModalProductPrice").textContent = productPrice;
                document.getElementById("ModalProductDiscountedPrice").textContent = discountedPrice;
                document.getElementById("ModalProductImage").src = productImageSrc;
                document.getElementById("ModalproductSale").textContent = discountPercent;

                // 초기 수량 설정
                quantity = 1; // 수량 초기화
                const productQuantityElement = document.getElementById("productQuantity");
                const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");
                productQuantityElement.textContent = quantity;
                decreaseQtyBtn.disabled = true; // 초기 수량이 1이므로 감소 버튼 비활성화

                // 수량 조절 버튼 클릭 이벤트
                document.getElementById("increaseQtyBtn").addEventListener("click", increaseQuantity);
                decreaseQtyBtn.addEventListener("click", decreaseQuantity);

                // 일정 시간 후에 모달을 자동으로 닫기
                setTimeout(() => {
                    modal.classList.remove("show");
                    modal.classList.add("hidden");
                }, CLOSETIME);
            });
        });

        // 모달 닫기 버튼 클릭 이벤트
        document.getElementById("ButtonModel-btnClose").addEventListener("click", () => {
            const modal = document.getElementById("CartModal");
            modal.classList.remove("show");
            modal.classList.add("hidden");
        });

        // 수량 증가 함수
        function increaseQuantity() {
            const productQuantityElement = document.getElementById("productQuantity");
            const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");

            let quantity = parseInt(productQuantityElement.textContent);
            quantity++;
            productQuantityElement.textContent = quantity;
            decreaseQtyBtn.disabled = false; // 수량이 증가하면 감소 버튼 활성화

            // 가격 업데이트
            updateModalPrices(quantity);
        }

        // 수량 감소 함수
        function decreaseQuantity() {
            const productQuantityElement = document.getElementById("productQuantity");
            const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");

            let quantity = parseInt(productQuantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                productQuantityElement.textContent = quantity;
                if (quantity === 1) {
                    decreaseQtyBtn.disabled = true; // 수량이 1일 때 감소 버튼 비활성화
                }

                // 가격 업데이트
                updateModalPrices(quantity);
            }
        }

        // 수량 변경에 따라 모달의 가격을 업데이트하는 함수
        function updateModalPrices(quantity) {
            const originalPriceElement = document.getElementById("ModalProductPrice");
            const discountedPriceElement = document.getElementById("ModalProductDiscountedPrice");

            // 원가와 할인가의 텍스트에서 숫자만 추출
            const originalPrice = parseInt(originalPriceElement.textContent.replace(/[^\d]/g, ""));
            const discountedPrice = parseInt(discountedPriceElement.textContent.replace(/[^\d]/g, ""));

            // 수량에 따른 가격 업데이트
            originalPriceElement.textContent = `${formatPrice(originalPrice * quantity)}원`;
            discountedPriceElement.textContent = `${formatPrice(discountedPrice * quantity)}원`;
        }

        // 가격을 포맷팅하는 함수
        function formatPrice(price) {
            return price.toLocaleString("ko-KR"); // 한국어 로케일에 맞게 천 단위 구분 기호를 추가
        }
    }
});
