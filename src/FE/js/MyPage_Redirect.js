/** user-icon 클릭 시 로컬스토리지 토큰 유무로 회원 비회원 확인 */
document.addEventListener('DOMContentLoaded', () => {
    // DOMContentLoaded: HTML 문서가 완전히 로드되고 분석 후 발생

    const token = localStorage.getItem('jwtToken');

    // 토큰(jwtToken)이 로컬 스토리지에 존재하는지 확인
    if (token) {
        // 토큰이 존재하면 회원 마이페이지로 이동
        window.location.href = '/mypage/in';
    } else {
        // 토큰이 존재하지 않으면 로그인 페이지로 이동
        window.location.href = '/login';
    }
});
