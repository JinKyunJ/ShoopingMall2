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
  //let mileage = parseInt(document.getElementById("mileage").value, 10) || 0;
  let mileage = 0;
  const userMileageEl = document.getElementById("user-mileage");
  const totalPriceInput = document.getElementById("total_price");
  const deliveryPrice = 3000; // 배송비 고정
  let totalOrderPrice = 0;

  // 로컬 스토리지(장바구니)에서 주문 상품 불러오기
  function loadOrderProducts() {
    const Products = JSON.parse(localStorage.getItem("cart")) || [];
    const orderList = document.querySelector(".order-list");

    if (Products.length <= 0) {
      alert("장바구니에 담긴 상품이 없습니다.");
      window.location.href = "/";
      return;
    }

    orderList.innerHTML = Products.map(createProductHTML).join("");
    //console.log("Products:", Products);
    updateOrderSummary(Products);
  }

  // 주문상품 HTML 만들기
  const createProductHTML = function ({
    nanoID, // 로컬 스토리지에 저장된 제품 정보 키 이름
    imageSrc,
    discountPercent, // sale이 아닌 discountPercent로 수정
    nameString,
    originalPrice,
    quantity,
  }) {
    // originalPrice가 문자열로 저장되어 있을 가능성 고려하여 정수로 변환
    const price = parseInt(originalPrice.replace(/[^\d]/g, ""), 10);
    const discount = parseFloat(discountPercent.replace("%", "")) || 0; // '%'를 제거하고 숫자로 변환

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
            <span class="fixed-price">${formatPrice(
              price
            )}원</span> | ${quantity}개
          </div>
        </div>
        <input type="hidden" name="prod_nanoid" value="${nanoID}" />
      </li>
    `;
  };

  // 주문 요약 정보 업데이트 함수
  function updateOrderSummary(Products) {
    let totalSalePrice = 0;
    Products.forEach((item) => {
      const price = parseInt(item.originalPrice.replace(/[^\d]/g, ""), 10);
      const discount = parseFloat(item.discountPercent.replace("%", "")) || 0;
      const salePrice = price * ((100 - discount) / 100);

      totalOrderPrice += salePrice * item.quantity;
      totalSalePrice += price * item.quantity;
    });

    const mileageUsed = parseInt(mileageInput.value, 10) || 0;

    // 주문 금액 (할인된 가격 기준)
    orderPriceEl.innerText = `${formatPrice(totalOrderPrice)}원`;

    // 적립금 (주문 금액의 1%)
    const mileageEarned = Math.floor(totalSalePrice * 0.01);
    useMileageEl.innerText = `${formatPrice(mileageUsed)}원`;

    // 최종 결제 금액
    const finalPrice = totalOrderPrice + deliveryPrice - mileageUsed;
    totalPriceEl.innerText = `${formatPrice(finalPrice)}원`;
    totalOrderPriceEl.innerText = `${formatPrice(finalPrice)}원`;
  }

  // 주문자 정보 서버에서 불러오기 (필요 없는 경우 사용하지 않을 수 있습니다)
  async function fetchUserInfo() {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("로그인된 사용자가 없습니다.");

      const decodedToken = parseJwt(token);
      const email = decodedToken.email;

      // 주문자 정보 설정
      userName.innerText = "user"; // 고정된 주문자 이름
      userEmail.innerText = email; // 토큰에서 가져온 이메일
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  }

  // JWT 토큰을 디코딩하는 함수
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // 주문 완료 시 서버에 주문 정보 전달
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    totalPriceInput.value = calculateTotalPrice();

    const formData = new FormData(this);
    const nanoids = formData.getAll("prod_nanoid");
    formData.delete("prod_nanoid"); // 기존의 개별 prod_nanoid 값을 삭제
    formData.append("prod_nanoid", nanoids); // 배열을 JSON 문자열로 추가
    const jsonData = Object.fromEntries(formData.entries());
    jsonData.prod_nanoid = jsonData.prod_nanoid.split(",");
    jsonData.total_price = Math.floor(Number(totalPriceInput.value));

    console.log(JSON.stringify(jsonData));

    try {
      const response = await fetch("/users/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("Failed to place the order.");
      }
      // 주문 완료 후 처리
      alert("주문이 완료되었습니다!");
      // localStorage.removeItem("jwtToken");
      window.location.href = "/orderEnd"; // 주문 완료 페이지로 리디렉션
    } catch (error) {
      console.error("Error placing order:", error);
      alert("주문을 완료할 수 없습니다. 다시 시도해주세요.");
    }
  });

  // 적립금 모두 사용 버튼 클릭 시
  useAllMileageBtn.addEventListener("click", () => {
    mileageInput.value = mileage;
    userMileageEl.innerText = 0;
    useMileageEl.innerText = mileage;

    calculateTotalPrice();
  });

  // 사용 적립금 입력 시 사용 가능 적립금 반영
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

    let result = parseInt(mileage) - parseInt(mileageInput.value);

    if (result < 0) {
      result = mileage;
      mileageInput.value = result;
      userMileageEl.innerText = 0;
    } else {
      userMileageEl.innerText = formatPrice(result);
    }
    useMileageEl.innerText = `${formatPrice(mileageInput.value)}원`;
    calculateTotalPrice();
  });

  // 최종 결제 금액 계산
  const calculateTotalPrice = () => {
    const totalPrice = totalOrderPrice - mileageInput.value + deliveryPrice;
    totalPriceEl.innerText = `${totalPrice.toLocaleString("ko-KR")}원`;
    totalOrderPriceEl.innerText = `${totalPrice.toLocaleString("ko-KR")}원`;

    return totalPrice;
  };

  // 화살표 있는 제목 박스 클릭 시 내용 접기
  const titleEl = document.querySelectorAll(".toggle-title");
  titleEl.forEach((el) => {
    el.addEventListener("click", () => {
      el.classList.toggle("active");
    });
  });

  loadOrderProducts(); // 주문 상품 불러오기 실행
  fetchUserInfo(); // 사용자 정보 불러오기 실행
  //fetchUserCash(); // 사용자 적립금 불러오기 실행
});

// 가격을 포맷팅하는 함수
function formatPrice(price) {
  return price.toLocaleString("ko-KR"); // 한국어 로케일에 맞게 천 단위 구분 기호를 추가
}
