document.addEventListener('DOMContentLoaded', function () {
    const orderList = document.querySelector('.order-list');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const totalPriceEl = document.getElementById('total-price');

    // 로컬 스토리지에서 주문 상품 불러오기
    function loadOrderDetails() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (cartItems.length === 0) {
            alert('장바구니에 담긴 상품이 없습니다.');
            window.location.href = '/';
            return;
        }

        orderList.innerHTML = cartItems.map(createOrderItemHTML).join('');
        updateTotalPrice(cartItems);
    }

    // 주문 상품 HTML 생성 함수
    function createOrderItemHTML({ imageSrc, nameString, originalPrice, discountedPrice, quantity }) {
        return `
        <li>
          <div class="img-box">
            <img src="${imageSrc}" alt="${nameString}" />
          </div>
          <div class="info-box">
            <p class="product-title">${nameString}</p>
            <div>
              <b class="price">${discountedPrice}원</b>
              <span class="fixed-price">${originalPrice}원</span> | ${quantity}개
            </div>
          </div>
        </li>
      `;
    }

    // 총 가격 업데이트 함수
    function updateTotalPrice(cartItems) {
        const totalPrice = cartItems.reduce(
            (sum, item) => sum + parseInt(item.discountedPrice.replace(/[^0-9]/g, '')) * item.quantity,
            0
        );
        totalPriceEl.textContent = `${formatPrice(totalPrice)}원`;
    }

    // 가격 포맷팅 함수
    function formatPrice(price) {
        return price.toLocaleString('ko-KR'); // 한국어 로케일에 맞게 천 단위 구분 기호를 추가
    }

    // 사용자 정보를 로드하는 함수
    async function fetchUserInfo() {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) throw new Error('로그인된 사용자가 없습니다.');

            const response = await fetch('/getuser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userInfo = await response.json();
                userName.textContent = userInfo.name;
                userEmail.textContent = userInfo.email;
            } else {
                alert('사용자 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 화살표 있는 제목 박스 클릭 시 내용 접기
    const titleEl = document.querySelectorAll('.toggle-title');
    titleEl.forEach((el) => {
        el.addEventListener('click', () => {
            el.classList.toggle('active');
        });
    });

    loadOrderDetails(); // 주문 내역 로드
    fetchUserInfo(); // 사용자 정보 로드
});
