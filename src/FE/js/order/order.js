document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("order-form");
  const userNameEl = document.getElementById("user-name");
  const userEmailEl = document.getElementById("user-email");
  const useAllMileageBtn = document.getElementById("use-all-mileage");
  const mileageInput = document.getElementById("use-mileage-input");
  const userMileageEl = document.getElementById("user-mileage");
  const useMileageEl = document.getElementById("use-mileage");
  const orderPriceEl = document.getElementById("order-price");
  const totalOrderPriceEl = document.getElementById("total-order-price");
  const totalPriceEl = document.getElementById("total-price");

  let mileage = document.getElementById("mileage").value;
  let totalProductPrice = 0;

  // 로컬 스토리지(장바구니)에서 주문 상품 불러오기
  const loadOrderProducts = () => {
    const products = JSON.parse(localStorage.getItem("cart")) || [];
    const orderList = document.querySelector(".order-list");

    if (products.length <= 0) {
      // alert("장바구니에 담긴 상품이 없습니다.");
      // window.location.href = "/";
    }

    orderList.innerHTML = products.map(createProductHTML).join("");
    orderPriceEl.innerText = totalProductPrice; // 주문 금액
    totalOrderPriceEl.innerText = totalProductPrice;
  };

  // 주문 상품 HTML 생성
  const createProductHTML = ({
    imageSrc,
    sale,
    nameString,
    originalPrice,
    quantity,
    nanoid,
  }) => {
    const salePrice = originalPrice * ((100 - sale) / 100);
    totalProductPrice += salePrice;
    return `
      <li>
        <div class="img-box">
          <img src="${imageSrc}" alt="${nameString}" />
        </div>
        <div class="info-box">
          <p class="product-title">${nameString}</p>
          <div>
            <b class="price">${salePrice}원</b>
            <span class="fixed-price">${originalPrice}원</span> | ${quantity}개
          </div>
        </div>
        <input type="hidden" name="prod_nanoid[]" value="${nanoid}" />
      </li>
    `;
  };

  // 사용자 적립금 가져오기
  const fetchUserCash = async () => {
    const response = await fetch("/users/cashes/find");
    const data = await response.json();
    userMileageEl.innerText = data.cash.toLocaleString("ko-KR");
  };

  // 서버에서 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    const response = await fetch("");
    const data = await response.json();
    const { email, name } = data.user;

    userNameEl.innerText = name;
    userEmailEl.innerText = email;
  };

  // 주문 완료 시 서버에 주문 정보 전달
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

    await fetch("/users/orders/", {
      method: "POST",
      body: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    }
    userMileageEl.innerText = result.toLocaleString("ko-KR");
    useMileageEl.innerText = result.toLocaleString("ko-KR");
    calculateTotalPrice();
  });

  // 최종 결제 금액 계산
  const calculateTotalPrice = () => {
    const totalPrice = (totalProductPrice - mileageInput.value).toLocaleString(
      "ko-KR"
    );
    totalPriceEl.innerText = totalPrice;
    totalOrderPriceEl.innerText = totalPrice;
  };

  // 화살표 있는 제목 박스 클릭 시 내용 접기
  const titleEl = document.querySelectorAll(".toggle-title");
  titleEl.forEach((el) => {
    el.addEventListener("click", () => {
      if (el.className.includes("active")) {
        el.classList.remove("active");
      } else {
        el.classList.add("active");
      }
    });
  });

  // loadOrderProducts(); // 주문 상품 불러오기 실행
  // fetchUserInfo(); // 사용자 정보 불러오기 실행
  // fetchUserCash(); // 사용자 적립금 불러오기 실행
});
