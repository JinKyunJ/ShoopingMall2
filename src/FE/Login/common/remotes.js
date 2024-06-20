/** 로그인 통신 API 함수 */
export async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:3002/login/auth', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            /** 서버 응답 처리 */
            const data = await response.json();
            /** 로컬 스토리지에 JWT 토큰 저장 + 쿠키 */
            const cookies = Object.fromEntries(document.cookie.split(';').map((cookie) => cookie.trim().split('=')));
            const token = cookies.token;
            localStorage.setItem('jwtToken', token); // ('key값-수정&삭제', value값-저장): 새로 고침, 브라우저 닫고 열어도 토근 유지

            window.location.href = data.href;
            return;
        } else {
            /** 오류 처리 */
            const errorData = await response.json();
            /** 사용자 알림 + 오류 추적 및 실행 중단 throw new Error 추가 */
            alert('아이디 또는 비밀번호가 올바르지 않습니다.');
            throw new Error(errorData.message || '로그인 실패');
        }
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요');
    }
}
