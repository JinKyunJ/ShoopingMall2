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

/** 특정 회원 상세 정보 가져오기 */
document.addEventListener('DOMContentLoaded', async () => {
    // DOMContentLoaded: HTML 문서 분석후 발생
    const urlParams = new URLSearchParams(window.location.search);
    const memberNanoid = urlParams.get('nanoid');
    // new URLSearchParams: 객체를 생성하여 현재 url 쿼리(id) 문자열을 파싱
    // window.location.search: url 쿼리 문자열을 반환 '?id=123'
    // get 메서드 사용해서 파라미터 값 추출 '123'

    /** 각 회원 id API 함수 호출 */
    if (memberNanoid) {
        try {
            const member = await fetchData(`http://localhost:3002/users/${memberNanoid}`);
            if (member) {
                renderMemberDetail(member); // 회원 정보 화면에 표시
            } else {
                alert('회원 정보를 가져오는데 실패했습니다.');
            }
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert('회원 정보가 없습니다.');
    }
});

/** 가져온 회원상세 정보 html에 넣어서 화면에 보여주기 */
function renderMemberDetail(member) {
    const user = member.user; // user 객체로 접근
    document.querySelector('.member-name').textContent = user.name;
    document.getElementById('date').textContent = user.create_at;
    document.getElementById('grade').textContent = user.grade;
    document.getElementById('email').textContent = user.email;
    document.getElementById('phone').textContent = user.phone;
    document.getElementById('birthday').textContent = user.birthday;
    document.getElementById('address').textContent = user.address;
}
