const CLOSETIME = 5000; // 5초로 설정

document.addEventListener("DOMContentLoaded", async () => {
  await fetchProducts(); // 초기 로드 시 모든 제품을 가져와서 렌더링
  initializeCartCounter(); // 초기 카트 카운터 설정

  // storage 이벤트를 통해 다른 탭이나 창에서 localStorage 변경을 감지
  window.addEventListener('storage', updateCartCounter);
});

// 카테고리별 제품 로드 함수
function fetchProducts(category = 'all') {
  return fetch("/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        return response.json();
      })
      .then(data => {
        const products = Object.values(data).map(prodData => prodData.product);
        console.log("All products:", products);

        // 카테고리 필터링
        let filteredProducts = products;
        if (category !== 'all') {
          filteredProducts = products.filter(product => product.category.name === category);
        }

        console.log(`Filtered products for category '${category}':`, filteredProducts);
        renderProducts(filteredProducts);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
}

// 제품들을 렌더링하는 함수
function renderProducts(products) {
  const container = document.querySelector(".swiper-wrapper");
  if (!container) {
    console.error("Container element not found");
    return;
  }

  // 기존 제품 요소 제거
  container.innerHTML = '';

  products.forEach(product => {
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
        <p class="ProductID" style="display: none;">${product.nanoid}</p>
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

    container.appendChild(productElement);

    // 제품 클릭 이벤트 추가 - 제품 클릭 시 `localStorage`에 데이터 저장
    productElement.addEventListener("click", function (event) {
      event.preventDefault(); // 기본 링크 동작을 막음

      const productDetails = {
        id: product.nanoid,
        title: product.title,
        image: product.image,
        price: product.price,
        sale: product.sale,
        comments: product.comments
      };
      localStorage.setItem("selectedProduct", JSON.stringify(productDetails));
      window.location.href = productElement.href;
    });

    // "담기" 버튼 클릭 이벤트 추가
    const cartButton = productElement.querySelector(".Cart-Btn");
    if (cartButton) {
      cartButton.addEventListener("click", function (event) {
        event.preventDefault(); // 기본 링크 동작을 막음
        event.stopPropagation(); // 부모 링크 동작을 막음

        showModal(product);
      });
    }
  });
}

function showModal(product) {
  const modal = document.getElementById("CartModal");
  if (modal) {
    modal.classList.add("show");
    modal.classList.remove("hidden");

    document.getElementById("ModalProductName").textContent = product.title;
    document.getElementById("ModalProductPrice").textContent = `${formatPrice(product.price)}원`;
    document.getElementById("ModalProductDiscountedPrice").textContent = `${formatPrice(getDiscountedPrice(product.price, product.sale))}원`;
    document.getElementById("ModalProductImage").src = `../img/TextImage/${product.image}`;
    document.getElementById("ModalproductSale").textContent = `${product.sale}%`;
    document.getElementById("ModalProductNanoID").textContent = product.nanoid;

    document.getElementById("ModalProductPrice").dataset.basePrice = product.price;
    document.getElementById("ModalProductDiscountedPrice").dataset.baseDiscountedPrice = getDiscountedPrice(product.price, product.sale);

    quantity = 1; // 수량 초기화
    const productQuantityElement = document.getElementById("productQuantity");
    const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");
    productQuantityElement.textContent = quantity;
    decreaseQtyBtn.disabled = true; // 초기 수량이 1이므로 감소 버튼 비활성화

    // 기존 이벤트 리스너 제거 후 새로 등록
    document.getElementById("increaseQtyBtn").onclick = increaseQuantity;
    document.getElementById("decreaseQtyBtn").onclick = decreaseQuantity;
    document.getElementById("ButtonModel-btnClose").onclick = () => addToCartAndCloseModal(product);

    setTimeout(closeModal, CLOSETIME);
  }
}

function addToCartAndCloseModal(product) {
  const productDetails = {
    nanoID: product.nanoid,
    imageSrc: `../img/TextImage/${product.image}`,
    nameString: product.title,
    discountedPrice: `${formatPrice(getDiscountedPrice(product.price, product.sale))}원`,
    originalPrice: `${formatPrice(product.price)}원`,
    discountPercent: `${product.sale}%`,
    quantity: parseInt(document.getElementById("productQuantity").textContent)
  };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 동일 제품이 이미 있는지 확인하고, 있으면 수량만 증가
  const existingProduct = cart.find(item => item.nanoID === productDetails.nanoID);
  if (existingProduct) {
    existingProduct.quantity += productDetails.quantity;
  } else {
    cart.push(productDetails);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // 로컬스토리지 변경 후 콘솔에 출력
  console.log("Updated cart items:", cart);

  updateCartCounter();
  closeModal();
}

function closeModal() {
  const modal = document.getElementById("CartModal");
  if (modal) {
    modal.classList.remove("show");
    modal.classList.add("hidden");
  }
}

function increaseQuantity() {
  const productQuantityElement = document.getElementById("productQuantity");
  const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");

  let quantity = parseInt(productQuantityElement.textContent);
  quantity++;
  productQuantityElement.textContent = quantity;
  decreaseQtyBtn.disabled = false;

  updateModalPrices(quantity);
}

function decreaseQuantity() {
  const productQuantityElement = document.getElementById("productQuantity");
  const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");

  let quantity = parseInt(productQuantityElement.textContent);
  if (quantity > 1) {
    quantity--;
    productQuantityElement.textContent = quantity;
    if (quantity === 1) {
      decreaseQtyBtn.disabled = true;
    }

    updateModalPrices(quantity);
  }
}

function updateModalPrices(quantity) {
  const originalPriceElement = document.getElementById("ModalProductPrice");
  const discountedPriceElement = document.getElementById("ModalProductDiscountedPrice");

  const basePrice = parseFloat(originalPriceElement.dataset.basePrice);
  const baseDiscountedPrice = parseFloat(discountedPriceElement.dataset.baseDiscountedPrice);

  originalPriceElement.textContent = `${formatPrice(basePrice * quantity)}원`;
  discountedPriceElement.textContent = `${formatPrice(baseDiscountedPrice * quantity)}원`;
}

function initializeCartCounter() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart items on page load:", cart); // 페이지 로드 시 로컬 스토리지 확인

  const counterElement = document.querySelector(".cart-counter");
  if (counterElement) {
    counterElement.textContent = cart.length.toString();
  }
}

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const counterElement = document.querySelector(".cart-counter");
  if (counterElement) {
    counterElement.textContent = cart.length;
  }
}

function formatPrice(price) {
  return price.toLocaleString("ko-KR");
}

function getDiscountedPrice(price, sale) {
  return price - price * (sale / 100);
}
