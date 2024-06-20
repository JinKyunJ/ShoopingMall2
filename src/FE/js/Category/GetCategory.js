const CLOSETIME = 5000; // 5초로 설정

// 페이지가 로드되면 실행되는 초기화 함수
document.addEventListener("DOMContentLoaded", async () => {
  await fetchProducts(); // 제품 데이터를 가져와서 렌더링

  // 모달의 수량을 저장하는 변수
  let quantity = 1;


// 제품 데이터를 가져오는 함수
function fetchProducts() {
  return fetch("http://localhost:3002/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // JSON 형태로 데이터 수신을 명시
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      console.log("Fetched data:", data);

      const products = Object.values(data).map(function (prodData) {
        return prodData.product;
      });

      console.log("Parsed products:", products);

      renderProducts(products);
    })
    .catch(function (error) {
      console.error("Error fetching products:", error);
    });
}

// 제품 데이터를 사용하여 페이지에 동적으로 제품 요소를 추가하는 함수
function renderProducts(products) {
  const container = document.querySelector(".swiper-wrapper");

  if (!container) {
    console.error("Container element not found");
    return;
  }

  // 각 제품 데이터를 사용하여 HTML 요소 생성
  products.forEach(function (product) {
    const imgPath = `../img/TextImage/${product.image}`;
    const productElement = document.createElement("a");
    productElement.href = "/src/FE/ProductDetails/Productdetails.html";
    productElement.className = "swiper-slide";
    productElement.innerHTML = `
      <div class="Goods-Image">
        <img src="${imgPath}" alt="${product.title}" />
        <span class="Goods-Icon"></span>
      </div>
      <button class="Cart-Btn" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="42px"
                  viewBox="0 -960 960 960"
                  width="42px"
                  fill="#333"
                >
                  <path
                    d="M286.15-97.69q-29.15 0-49.57-20.43-20.42-20.42-20.42-49.57 0-29.16 20.42-49.58 20.42-20.42 49.57-20.42 29.16 0 49.58 20.42 20.42 20.42 20.42 49.58 0 29.15-20.42 49.57-20.42 20.43-49.58 20.43Zm387.7 0q-29.16 0-49.58-20.43-20.42-20.42-20.42-49.57 0-29.16 20.42-49.58 20.42-20.42 49.58-20.42 29.15 0 49.57 20.42t20.42 49.58q0 29.15-20.42 49.57Q703-97.69 673.85-97.69ZM240.61-730 342-517.69h272.69q3.46 0 6.16-1.73 2.69-1.73 4.61-4.81l107.31-195q2.31-4.23.38-7.5-1.92-3.27-6.54-3.27h-486Zm-28.76-60h555.38q24.54 0 37.11 20.89 12.58 20.88 1.2 42.65L677.38-494.31q-9.84 17.31-26.03 26.96-16.2 9.66-35.5 9.66H324l-46.31 84.61q-3.08 4.62-.19 10 2.88 5.39 8.65 5.39h427.7q12.76 0 21.38 8.61 8.61 8.62 8.61 21.39 0 12.77-8.61 21.38-8.62 8.62-21.38 8.62h-427.7q-40 0-60.11-34.5-20.12-34.5-1.42-68.89l57.07-102.61L136.16-810H90q-12.77 0-21.38-8.62Q60-827.23 60-840t8.62-21.38Q77.23-870 90-870h61.15q10.24 0 19.08 5.42 8.85 5.43 13.46 15.27L211.85-790ZM342-517.69h280-280Z"
                  />
                </svg>
        담기
      </button>
      <div class="goods-info">
        <p class="ProductID" style="display: none;">${product.nanoid}</p> <!-- 화면에 안보이게 -->
        <p class="title">${product.title}</p>
        <p class="price">${formatPrice(product.price)}원</p>
        <div class="dc-price">
          <span class="percent">${product.sale}%</span>
          <div class="price">${formatPrice(getDiscountedPrice(product.price, product.sale))}원</div>
        </div>
        <p class="review">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 -960 960 960"
              width="16px"
              fill="#5f6368"
          >
          </svg>
          ${product.comments.length}+
        </p>
      </div>
    `;

    // 제품 요소를 컨테이너에 추가
    container.appendChild(productElement);

    // a 태그 클릭 이벤트 추가 - 제품 클릭 시 `localStorage`에 데이터 저장
    productElement.addEventListener("click", function (event) {
      event.preventDefault(); // 기본 링크 동작을 막음

      // 제품 정보를 로컬스토리지에 저장
      const productDetails = {
        id: product.nanoid,
        title: product.title,
        image: product.image,
        price: product.price,
        sale: product.sale,
        comments: product.comments
      };
      localStorage.setItem("selectedProduct", JSON.stringify(productDetails));

      // 페이지 이동
      window.location.href = productElement.href;
    });

    // "담기" 버튼 클릭 이벤트 추가 (조건부로 이벤트 리스너 추가)
    const cartButton = productElement.querySelector(".Cart-Btn");
    if (cartButton) { // .Cart-Btn 요소가 존재하는 경우에만 이벤트 리스너 추가
      cartButton.addEventListener("click", function (event) {
        event.preventDefault(); // 기본 링크 동작을 막음
        event.stopPropagation(); // 부모 링크 동작을 막음

        // 모달을 표시하는 함수 호출
        showModal(productElement);
      });
    }
  });
}

  // "장바구니에 담기" 버튼 클릭 시 모달을 열고 제품 정보를 설정
  document.querySelectorAll(".Cart-Btn").forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 링크 동작을 막음
      event.stopPropagation(); // 부모 클릭 이벤트를 막음

      // 모달 객체를 가져와서 보여줌
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
      decreaseQtyBtn.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          productQuantityElement.textContent = quantity;
          if (quantity === 1) {
            decreaseQtyBtn.disabled = true; // 수량이 1일 때 감소 버튼 비활성화
          }
        }
      });

      document.getElementById("increaseQtyBtn").addEventListener("click", () => {
        quantity++;
        productQuantityElement.textContent = quantity;
        decreaseQtyBtn.disabled = false; // 수량 증가 시 감소 버튼 활성화
      });

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

    // 모달의 제품 정보를 로컬스토리지에 저장
    const productImg = document.getElementById("ModalProductImage").src;
    const productName = document.getElementById("ModalProductName").textContent;
    const discountedPrice = document.getElementById("ModalProductDiscountedPrice").textContent;
    const productPrice = document.getElementById("ModalProductPrice").textContent;
    const discountPercent = document.getElementById("ModalproductSale")?.textContent || "0%";

    const productDetails = {
      imageSrc: productImg,
      nameString: productName,
      discountedPrice: discountedPrice,
      originalPrice: productPrice,
      discountPercent: discountPercent,
      quantity: parseInt(document.getElementById("productQuantity").textContent) // 수량을 가져옴
    };

    // 로컬스토리지에 저장
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(productDetails);
    localStorage.setItem("cart", JSON.stringify(cart));

    // 카운터 업데이트
    const counterElement = document.querySelector(".cart-counter");
    if (counterElement) {
      counterElement.textContent = cart.length;
    }
  });

  // 초기 카트 카운터 설정
  initializeCartCounter();
});

// 초기 카트 카운터 설정 함수
function initializeCartCounter() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const counterElement = document.querySelector(".cart-counter");
  if (counterElement) {
    counterElement.textContent = cart.length;
  }
}


// 가격을 포맷팅하는 함수
function formatPrice(price) {
  return price.toLocaleString("ko-KR"); // 한국어 로케일에 맞게 천 단위 구분 기호를 추가
}

// 할인가를 계산하는 함수
function getDiscountedPrice(price, sale) {
  return price - price * (sale / 100);
}

// 모달을 보여주는 함수
function showModal(element) {
  const modal = document.getElementById("CartModal");
  if (modal) {
    // 모달을 표시
    modal.classList.add("show");
    
    // 수량 초기화
    const productQuantityElement = document.getElementById("productQuantity");
    const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");
    productQuantityElement.textContent = "1";
    decreaseQtyBtn.disabled = true; // 초기 수량이 1이므로 감소 버튼 비활성화
    
    // 모달을 닫기 전에 이벤트 리스너를 제거하여 중복 방지
    document.getElementById("increaseQtyBtn").removeEventListener("click", increaseQuantity);
    decreaseQtyBtn.removeEventListener("click", decreaseQuantity);

    // 수량 증가/감소 이벤트 추가
    document.getElementById("increaseQtyBtn").addEventListener("click", increaseQuantity);
    decreaseQtyBtn.addEventListener("click", decreaseQuantity);
  }
}

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
