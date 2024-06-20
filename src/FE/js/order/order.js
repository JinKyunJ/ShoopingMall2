document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("order-form");
  const userName = document.getElementById("user-name");
  const userEmail = document.getElementById("user-email");
  const orderPriceEl = document.getElementById("order-price");
  const totalPriceEl = document.getElementById("total-price");
  const useMileageEl = document.getElementById("use-mileage");
  const totalOrderPriceEl = document.getElementById("total-order-price");

  const useAllMileageBtn = document.getElementById("use-all-mileage");
  const mileageInput = document.getElementById("use-mileage-input");
  let mileage = parseInt(document.getElementById("mileage").value, 10) || 0;
  const userMileage = document.getElementById("user-mileage");
  const deliveryPrice = 3000; // 배송비 고정

  // 적립금 모두사용 버튼 눌렀을 때
  useAllMileageBtn.addEventListener("click", () => {
    mileageInput.value = mileage;
    userMileage.innerText = 0;
    updateFinalPrice();
  });

  // 사용 적립금 입력 시 사용가능 적립금 반영
  mileageInput.addEventListener("input", () => {
    if (!mileageInput.value) {
      mileageInput.value = 0;
    }

    if (mileageInput.value < 0) {
      alert("정수를 입력해주세요.");
      mileageInput.value = 0;
      return false;
    }

    mileageInput.value = mileageInput.value.replace(/^0+/, "");

    let result = mileage - parseInt(mileageInput.value, 10);

    if (result < 0) {
      result = mileage;
      mileageInput.value = result;
    }
    userMileage.innerText = result;
    updateFinalPrice();
  });

  // 주문상품 로컬 스토리지(장바구니)에서 불러오기
  const loadOrderProducts = () => {
    const Products = JSON.parse(localStorage.getItem("cart")) || [];
    const orderList = document.querySelector(".order-list");

    if (Products.length <= 0) {
      alert("장바구니에 담긴 상품이 없습니다.");
      window.location.href = "/";
      return;
    }

    console.log("Products:", Products);
    orderList.innerHTML = Products.map(createProductHTML).join("");
    updateOrderSummary(Products);
  };

  // 주문상품 HTML 만들기
  const createProductHTML = function ({
                                        nanoID, // 로컬 스토리지에 저장된 제품 정보 키 이름
                                        imageSrc,
                                        discountPercent, // sale이 아닌 discountPercent로 수정
                                        nameString,
                                        originalPrice,
                                        quantity
                                      }) {
    // originalPrice가 문자열로 저장되어 있을 가능성 고려하여 정수로 변환
    const price = parseInt(originalPrice.replace(/[^\d]/g, ''), 10);
    const discount = parseFloat(discountPercent.replace('%', '')) || 0;  // '%'를 제거하고 숫자로 변환

    const salePrice = price * ((100 - discount) / 100);

    return `
      <li>
        <div class="img-box">
          <img src="${imageSrc}" alt="${nameString}" />
        </div>
        <div class="info-box">
          <p class="product-title">${nameString}</p>
          <div>
            <b class="price">${formatPrice(salePrice)}원</b>
            <span class="fixed-price">${formatPrice(price)}원</span> | ${quantity}개
          </div>
        </div>
        <input type="hidden" name="prod_nanoid[]" value="${nanoID}" />
      </li>
    `;
  };

  // 주문 요약 정보 업데이트 함수
  const updateOrderSummary = (Products) => {
    let totalOrderPrice = 0;
    let totalSalePrice = 0;

    Products.forEach(item => {
      const price = parseInt(item.originalPrice.replace(/[^\d]/g, ''), 10);
      const discount = parseFloat(item.discountPercent.replace('%', '')) || 0;
      const salePrice = price * ((100 - discount) / 100);

      totalOrderPrice += salePrice * item.quantity;
      totalSalePrice += price * item.quantity;
    });

    const mileageUsed = parseInt(mileageInput.value, 10) || 0;

    // 주문 금액 (할인된 가격 기준)
    orderPriceEl.innerText = `${formatPrice(totalOrderPrice)}원`;

    // 적립금 (주문 금액의 1%)
    const mileageEarned = Math.floor(totalSalePrice * 0.01);
    useMileageEl.innerText = `${formatPrice(mileageEarned)}원`;

    // 최종 결제 금액
    const finalPrice = totalOrderPrice + deliveryPrice - mileageUsed;
    totalPriceEl.innerText = `${formatPrice(finalPrice)}원`;
    totalOrderPriceEl.innerText = `${formatPrice(finalPrice)}원`;
  };

  // 주문자 정보 서버에서 불러오기 (필요 없는 경우 사용하지 않을 수 있습니다)
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error("로그인된 사용자가 없습니다.");

      const decodedToken = parseJwt(token);
      const email = decodedToken.email;

      // 주문자 정보 설정
      userName.innerText = "user"; // 고정된 주문자 이름
      userEmail.innerText = email; // 토큰에서 가져온 이메일
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  // JWT 토큰을 디코딩하는 함수
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // 주문완료 시 주문정보 서버에 전달
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      const response = await fetch("/users/orders/", {
        method: "POST",
        body: jsonData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to place the order.");
      }

      const data = await response.json();
      // 주문 완료 후 처리
      alert("주문이 완료되었습니다!");
      window.location.href = "/order/complete"; // 주문 완료 페이지로 리디렉션
    } catch (error) {
      console.error("Error placing order:", error);
      alert("주문을 완료할 수 없습니다. 다시 시도해주세요.");
    }
  });

  // 화살표 있는 title-box 클릭 시 내용이 접히도록 작업
  const titleEl = document.querySelectorAll(".toggle-title");
  titleEl.forEach((el) => {
    el.addEventListener("click", () => {
      el.classList.toggle("active");
    });
  });

  loadOrderProducts(); // 주문상품 불러오기 실행
  fetchUserInfo(); // 주문자 정보 불러오기 실행
});

// 가격을 포맷팅하는 함수
function formatPrice(price) {
  return price.toLocaleString("ko-KR"); // 한국어 로케일에 맞게 천 단위 구분 기호를 추가
}
