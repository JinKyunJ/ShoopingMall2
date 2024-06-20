const CLOSETIME = 5000; // 5초로 설정

// 페이지가 로드되면 실행되는 초기화 함수
document.addEventListener("DOMContentLoaded", async () => {
  await fetchProducts(); // 제품 데이터를 가져와서 렌더링

  // 모달의 수량을 저장하는 변수
  let quantity = 1;

  // 제품 데이터를 가져오는 함수
  function fetchProducts() {
    return fetch("/products", {
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
          console.log(products);
          renderProducts(products);
        })
        .catch(function (error) {
          console.error("Error fetching products:", error);
        });
  }

  // 제품 데이터를 사용하여 페이지에 동적으로 제품 요소를 추가하는 함수
  function renderProducts(products)
  {

    const container = document.querySelector(".swiper-wrapper");

    if (!container)
    {
      console.error("Container element not found");
      return;
    }

    // 각 제품 데이터를 사용하여 HTML 요소 생성
    products.forEach(function (product) {
      const imgPath = `../img/TextImage/${product.image}`;
      const productElement = document.createElement("a");
      productElement.href = "/productdetails";
      productElement.className = "swiper-slide";
      productElement.innerHTML = `
        <div class="Goods-Image">
          <img src="${imgPath}" alt="${product.title}" />
          <span class="Goods-Icon"></span>
        </div>
        <button class="Cart-Btn" type="button">
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
          showModal(product);
        });
      }
    });
  }

  // "장바구니에 담기" 버튼 클릭 시 모달을 열고 제품 정보를 설정
  function showModal(product) {
    const modal = document.getElementById("CartModal");
    if (modal) {
      modal.classList.add("show");
      modal.classList.remove("hidden");

      // 제품 정보를 모달에 설정
      document.getElementById("ModalProductName").textContent = product.title;
      document.getElementById("ModalProductPrice").textContent = `${formatPrice(product.price)}원`;
      document.getElementById("ModalProductDiscountedPrice").textContent = `${formatPrice(getDiscountedPrice(product.price, product.sale))}원`;
      document.getElementById("ModalProductImage").src = `../img/TextImage/${product.image}`;
      document.getElementById("ModalproductSale").textContent = `${product.sale}%`;
      document.getElementById("ModalProductNanoID").textContent = product.nanoid; // 나노아이디 설정

      // dataset에 기본 가격을 저장
      document.getElementById("ModalProductPrice").dataset.basePrice = product.price;
      document.getElementById("ModalProductDiscountedPrice").dataset.baseDiscountedPrice = getDiscountedPrice(product.price, product.sale);

      // 초기 수량 설정
      quantity = 1; // 수량 초기화
      const productQuantityElement = document.getElementById("productQuantity");
      const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");
      productQuantityElement.textContent = quantity;
      decreaseQtyBtn.disabled = true; // 초기 수량이 1이므로 감소 버튼 비활성화

      // 수량 조절 버튼 클릭 이벤트
      document.getElementById("increaseQtyBtn").addEventListener("click", increaseQuantity);
      decreaseQtyBtn.addEventListener("click", decreaseQuantity);

      // "장바구니에 담기" 버튼 클릭 이벤트
      document.getElementById("ButtonModel-btnClose").addEventListener("click", () => {
        addToCartAndCloseModal(product);
      });

      // 일정 시간 후에 모달을 자동으로 닫기
      setTimeout(() => {
        closeModal();
      }, CLOSETIME);
    }
  }

  // 제품을 장바구니에 추가하고 모달을 닫는 함수
  function addToCartAndCloseModal(product) {
    const productDetails = {
      nanoID: product.nanoid,
      imageSrc: `../img/TextImage/${product.image}`,
      nameString: product.title,
      discountedPrice: `${formatPrice(getDiscountedPrice(product.price, product.sale))}원`,
      originalPrice: `${formatPrice(product.price)}원`,
      discountPercent: `${product.sale}%`,
      quantity: parseInt(document.getElementById("productQuantity").textContent) // 수량을 가져옴
    };

    // 로컬스토리지에 저장
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(productDetails);
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCounter();
    closeModal(); // 모달 닫기
  }

  // 모달 닫기 함수
  function closeModal() {
    const modal = document.getElementById("CartModal");
    if (modal) {
      modal.classList.remove("show");
      modal.classList.add("hidden");
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

    // dataset에 저장된 기본 가격을 가져옴
    const basePrice = parseFloat(originalPriceElement.dataset.basePrice);
    const baseDiscountedPrice = parseFloat(discountedPriceElement.dataset.baseDiscountedPrice);

    // 수량에 따른 가격 업데이트
    originalPriceElement.textContent = `${formatPrice(basePrice * quantity)}원`;
    discountedPriceElement.textContent = `${formatPrice(baseDiscountedPrice * quantity)}원`;
  }

  // 초기 카트 카운터 설정 함수
  function initializeCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const counterElement = document.querySelector(".cart-counter");
    if (counterElement) {
      counterElement.textContent = cart.length;
    }
  }

  // 카트 카운터 업데이트 함수
  function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const counterElement = document.querySelector(".cart-counter");
    if (counterElement) {
      counterElement.textContent = cart.length;
    }
  }

  // 초기 카트 카운터 설정
  initializeCartCounter();
});

// 가격을 포맷팅하는 함수
function formatPrice(price) {
  return price.toLocaleString("ko-KR"); // 한국어 로케일에 맞게 천 단위 구분 기호를 추가
}

// 할인가를 계산하는 함수
function getDiscountedPrice(price, sale) {
  return price - price * (sale / 100);
}
