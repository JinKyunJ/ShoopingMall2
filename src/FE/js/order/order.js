document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("order-form");
  const userName = document.getElementById("user-name");
  const userEmail = document.getElementById("user-email");
  const receiverAddress = document.getElementById("user-address");
  const receiverName = document.getElementById("receiver-name");
  const receiverPhone = document.getElementById("receiver-phone");

  const useAllMileageBtn = document.getElementById("use-all-mileage");
  const mileageInput = document.getElementById("use-mileage-input");
  let mileage = document.getElementById("mileage").value;
  const userMileage = document.getElementById("user-mileage");

  // 적립금 모두사용 버튼 눌렀을 때
  useAllMileageBtn.addEventListener("click", () => {
    mileageInput.value = mileage;
    userMileage.innerText = 0;
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

    let result = parseInt(mileage - mileageInput.value);

    if (result < 0) {
      result = mileage;
      mileageInput.value = result;
    }
    userMileage.innerText = result;
  });

  // 주문상품 로컬 스토리지(장바구니)에서 불러오기
  const loadOrderProducts = () => {
    const Products = JSON.parse(localStorage.getItem("cart")) || [];
    const orderList = document.querySelector(".order-list");

    if (Products.length <= 0) {
      //alert("장바구니에 담긴 상품이 없습니다.");
      //window.location.href = "/";
    }

    orderList.innerHtml = Products.map(createProductHTML).join("");
  };

  // 주문상품 HTML 만들기
  const createProductHTML = function ({
    imageSrc,
    sale,
    nameString,
    originalPrice,
    quantity,
    nanoid,
  }) {
    const salePrice = originalPrice * ((100 - sale) / 100);
    return `
            <li>
              <div class="img-box">
                <img src="${imageSrc}" alt="${nameString}" />
              </div>
              <div class="info-box">
                <p class="product-title">${nameString}</p>
                <div>
                  <b class="price">${salePrice}원</b
                  ><span class="fixed-price">${originalPrice}원</span> | ${quantity}개
                </div>
              </div>
              <input type="hidden" name="prod_nanoid[]" value="${nanoid}" />
            </li>
          `;
  };

  // 주문자 정보 서버에서 불러오기
  const fetchUserInfo = async () => {
    const response = fetch("", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const { email, name, address } = data.user;

    // 적립금은 어떻게 가져오는지 물어보기...
    const userMileage = document.getElementById("user-mileage");

    userName.innerText = name;
    userEmail.innerText = email;
    receiverAddress.innerText = address;
    userMileage.innerText = "";
  };

  // 주문완료 시 주문정보 서버에 전달
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

    const response = await fetch("http://localhost:3002/users/orders/", {
      method: "POST",
      body: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  // 화살표 있는 title-box 클릭 시 내용이 접히도록 작업
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

  loadOrderProducts(); // 주문상품 불러오기 실행
  fetchUserInfo(); // 주문자 정보 불러오기 실행
});
