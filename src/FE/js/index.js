document.addEventListener("DOMContentLoaded", function () {
  /** 메인 슬라이드 */
  const swiper = new Swiper(".swiper", {
    // Optional parameters
    autoplay: true,
    loop: true,

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
    },
  });

  /** 상품 슬라이드 */
  const goodsSwiper = new Swiper(".product-box", {
    slidesPerView: 2.2,
    spaceBetween: 10,
    breakpoints: {
      480: {
        slidesPerView: 2.5,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });

  async function fetchProducts(type) {
    const response = await fetch("/products");
    const products = Object.values(await response.json());
    let result = [];

    if (type === "sale") {
      result = products.filter(({ product }) => product.sale > 0);
    }
    if (type === "comment") {
      result = products
        .filter(({ product }) => product.comments.length > 0)
        .sort((a, b) => a.product.comments.length - b.product.comments.length);
    }

    if (type === "popular") {
      result = products
        .filter(({ likeUser }) => likeUser.length > 0)
        .sort((a, b) => a.likeUser.length - b.likeUser.length);
    }

    if (type === "salad") {
      result = products.filter(({ product }) => {
        return product.category.name === "샐러드";
      });
    }

    return result;
  }

  /** 세일 상품 불러오기 */
  async function fetchSaleProducts() {
    try {
      const products = await fetchProducts("sale");
      const saleProducts = products.map(createProductHTML).join("");

      const saleProductList = document.getElementById("sale-product-wrapper");
      saleProductList.innerHTML = saleProducts;
    } catch (error) {
      console.error("Error fetching sale products:", error);
    }
  }

  /** 후기 많은 상품 불러오기 */
  async function fetchCommentProducts() {
    try {
      const products = await fetchProducts("comment");
      const commentProducts = products.map(createProductHTML).join("");

      const commentProductList = document.getElementById(
        "comment-product-wrapper"
      );
      commentProductList.innerHTML = commentProducts;
    } catch (error) {
      console.error("Error fetching comment products:", error);
    }
  }

  /** 인기 많은 상품 불러오기 */
  async function fetchPopularProducts() {
    try {
      const products = await fetchProducts("popular");
      const popularProducts = products.map(createProductHTML).join("");

      const popularProductList = document.getElementById(
        "popular-product-wrapper"
      );
      popularProductList.innerHTML = popularProducts;
    } catch (error) {
      console.error("Error fetching popular products:", error);
    }
  }

  /** 샐러드 카테고리 상품 불러오기 */
  async function fetchsaladProducts() {
    try {
      const products = await fetchProducts("salad");
      const saladProducts = products.map(createProductHTML).join("");

      const saladProductList = document.getElementById("salad-product-wrapper");
      saladProductList.innerHTML = saladProducts;
    } catch (error) {
      console.error("Error fetching salad products:", error);
    }
  }

  function createProductHTML({ product }) {
    const { price, sale, image, title, comments } = product;
    const salePrice = Math.floor(price * ((100 - sale) / 100));
    
    const imgPath = `./img/TextImage/${image}`;
    console.log(imgPath);

    return `<div class="swiper-slide">
                <div class="goods-image">
                    <img src="${imgPath}" alt="" />
                </div>
                <button class="cart-btn" type="button">
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#333"
                >
                  <path
                    d="M286.15-97.69q-29.15 0-49.57-20.43-20.42-20.42-20.42-49.57 0-29.16 20.42-49.58 20.42-20.42 49.57-20.42 29.16 0 49.58 20.42 20.42 20.42 20.42 49.58 0 29.15-20.42 49.57-20.42 20.43-49.58 20.43Zm387.7 0q-29.16 0-49.58-20.43-20.42-20.42-20.42-49.57 0-29.16 20.42-49.58 20.42-20.42 49.58-20.42 29.15 0 49.57 20.42t20.42 49.58q0 29.15-20.42 49.57Q703-97.69 673.85-97.69ZM240.61-730 342-517.69h272.69q3.46 0 6.16-1.73 2.69-1.73 4.61-4.81l107.31-195q2.31-4.23.38-7.5-1.92-3.27-6.54-3.27h-486Zm-28.76-60h555.38q24.54 0 37.11 20.89 12.58 20.88 1.2 42.65L677.38-494.31q-9.84 17.31-26.03 26.96-16.2 9.66-35.5 9.66H324l-46.31 84.61q-3.08 4.62-.19 10 2.88 5.39 8.65 5.39h427.7q12.76 0 21.38 8.61 8.61 8.62 8.61 21.39 0 12.77-8.61 21.38-8.62 8.62-21.38 8.62h-427.7q-40 0-60.11-34.5-20.12-34.5-1.42-68.89l57.07-102.61L136.16-810H90q-12.77 0-21.38-8.62Q60-827.23 60-840t8.62-21.38Q77.23-870 90-870h61.15q10.24 0 19.08 5.42 8.85 5.43 13.46 15.27L211.85-790ZM342-517.69h280-280Z"
                  />
                  </svg>
                  담기
                </button>
                <input type="hidden" value="" name="productNumber" />
                <div class="goods-info">
                    <p class="title">${title}</p>
                    <p class="price">${price}원</p>
                    <div class="dc-price">
                    <span class="percent">${sale}%</span>
                    <div class="price">${salePrice}원</div>
                    </div>
                    <p class="review">
                      <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#5f6368"><path d="m241.54-260-80.08 80.07q-17.07 17.08-39.27 7.74Q100-181.54 100-205.85v-581.84Q100-818 121-839q21-21 51.31-21h615.38Q818-860 839-839q21 21 21 51.31v455.38Q860-302 839-281q-21 21-51.31 21H241.54ZM216-320h571.69q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H172.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v523.08L216-320Zm-56 0v-480 480Zm160-204.62q14.69 0 25.04-10.34 10.34-10.35 10.34-25.04t-10.34-25.04q-10.35-10.34-25.04-10.34t-25.04 10.34q-10.34 10.35-10.34 25.04t10.34 25.04q10.35 10.34 25.04 10.34Zm160 0q14.69 0 25.04-10.34 10.34-10.35 10.34-25.04t-10.34-25.04q-10.35-10.34-25.04-10.34t-25.04 10.34q-10.34 10.35-10.34 25.04t10.34 25.04q10.35 10.34 25.04 10.34Zm160 0q14.69 0 25.04-10.34 10.34-10.35 10.34-25.04t-10.34-25.04q-10.35-10.34-25.04-10.34t-25.04 10.34q-10.34 10.35-10.34 25.04t10.34 25.04q10.35 10.34 25.04 10.34Z"/></svg>
                      ${comments.length}
                    </p>
                </div>
            </div>
            `;
  }

  // 페이지 로드 시 상품 리스트를 불러옵니다.
  window.addEventListener("load", () => {
    fetchSaleProducts();
    fetchCommentProducts();
    fetchPopularProducts();
    fetchsaladProducts();
  });
});
