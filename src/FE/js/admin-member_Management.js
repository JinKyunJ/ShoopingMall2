import { fetchData } from '../Admin/Admin-member/common/remotes.js';

// 어드민페이지 공통 js
const menuBtn = document.getElementById('openMenuBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
    if (menu.className.includes('active')) {
        menu.classList.remove('active');
    } else {
        menu.classList.add('active');
    }
});

/** 전체 회원 정보 가져오기 */
async function fetchMembers() {
    return await fetchData('http://localhost:3002/users');
}

/** 전체 주문 정보 가져오기 */
async function fetchOrders() {
    return await fetchData('http://localhost:3002/users/orders');
}

/** 가져온 회원정보 화면에 보여주기 */
document.addEventListener('DOMContentLoaded', async () => {
    // DOMContentLoaded: HTML 문서가 분석 된 후 발생
    const members = await fetchMembers(); // 회원 정보 가져오기
    const orders = await fetchOrders(); // 주문 정보 가져오기

    /** fetchMembers() 호출 됐을때 */
    if (members && orders) {
        renderMembers(members, orders); // 회원 정보, 주문 정보 함께 전달
    }
});

/** 가져온 전체 회원정보 html에 넣어서 화면에 보여주기 */
function renderMembers(members, orders) {
    const memberList = document.querySelector('.member-list');
    memberList.innerHTML = ''; // 기존 리스트 초기화

    // forEach함수 사용해서 각각 회원정보 추가
    members.forEach((member) => {
        const user = member.user; // user 객체로 접근
        const memberOrders = orders.filter((order) => order.user.email === user.email); // 회원정보와 주문정보에서 이메일 일치하는 주문 필터링
        const orderCount = memberOrders.length; // 총 주문 횟수
        const totalPurchaseAmount = memberOrders.reduce((sum, order) => sum + order.total_price, 0).toLocaleString(); // 총 구매금액

        const li = document.createElement('li');
        li.setAttribute('data-nanoid', user.nanoid); // user 객체의 필드로 접근
        li.innerHTML = `
        <div class="date">가입일: ${user.create_at}</div>
        <div class="info">
            <div class="info-name">${user.name}(${user.email})</div>
            <div class="info-purchase">구매금액: ${totalPurchaseAmount}원 / 주문횟수: ${orderCount}회</div>
        </div>`;

        memberList.appendChild(li); // 새로운 회원정보 리스트 추가
    });

    /** 총 회원수 보여주기 */
    document.getElementById('total-members').textContent = members.length;

    /** 각 회원 클릭 이벤트 추가 */
    document.querySelectorAll('.member-list li').forEach((li) => {
        li.addEventListener('click', () => {
            const memberNanoid = li.getAttribute('data-nanoid');
            window.location.href = `member-detail.html?nanoid=${memberNanoid}`;
        });
    });
}

/** 검색 기능 함수 */
function searchMembers() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase(); // 필드에 입력한 값 소문자로 변경
    const members = document.querySelectorAll('.member-list li'); // 모든 회원 리스트 가져오기

    /** 이름, 이메일 포함 여부 확인  */
    members.forEach((member) => {
        const infoName = member.querySelector('.info-name').textContent.toLowerCase();

        // 이름이나 이메일에 검색 입력 값이 포함되어 있는지 확인
        if (infoName.includes(searchInput)) {
            // 포함되어 있으면 해당 회원 리스트 항목을 표시
            member.style.display = 'block';
        } else {
            // 포함되어 있지 않으면 해당 회원 리스트 항목을 숨김
            member.style.display = 'none';
        }
    });
}

/** 검색 버튼 클릭 시 */
document.querySelector('.search-button').addEventListener('click', searchMembers);
/** 검색 필드 엔터키 입력 시 */
document.querySelector('.search-input').addEventListener('keypress', (enter) => {
    if (enter.key === 'Enter') {
        searchMembers();
    }
});
