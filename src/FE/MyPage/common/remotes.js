/** 중복되는 API 호출 및 페이지 이동 함수 */
export async function fetchAndNavigate(url, event) {
    event.preventDefault(); /** 기본 동작 막기 */
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            window.location.href = url;
        } else {
            /** 오류 처리 */
            const errorData = await response.json();
            alert('페이지 이동에 실패했습니다. 나중에 다시 시도해주세요.');
            throw new Error(errorData.message || '페이지 이동 실패');
        }
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}

/** 사용자 이름 가져오기 API 함수 */
export async function fetchUserName() {
    try {
        const response = await fetch('http://localhost:3002/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            const userNameElement = document.getElementById('user-name'); /** 'user-name' ID를 가진 HTML요소 */
            userNameElement.textContent = `${data.name}님`; /** 요소의 텍스트 내용을 `${data.name}님`으로 변경 */
        } else {
            /** 오류 처리 */
            const errorData = await response.json();
            alert('사용자 정보를 가져오는 데 실패했습니다.');
            throw new Error(errorData.message || '사용자 정보 가져오기 실패');
        }
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}

/** 로그아웃 API 함수 
export async function logoutUser() {
    try {
        const response = await fetch('/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            // 로컬 스토리지에서 JWT 토근 제거
            localStorage.removeItem('jwtToken');

            // 쿠키에서 토큰 제거 - 로그아웃 클릭 시 쿠키 즉시 만료로 삭제
            document.cookie = 'token=; Max-Age=0; path=/;';

            window.location.href = '/';
        } else {
            /** 오류 처리
            const errorData = await response.json();
            alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
            throw new Error(errorData.message || '로그아웃 실패');
        }
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}
*/
export async function logoutUser() {
    try {
        // JWT 토큰을 로컬 스토리지에서 가져옴
        const token = localStorage.getItem('jwtToken');

        const response = await fetch('http://localhost:3002/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization 헤더에 토큰 추가
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include' // 쿠키를 포함한 요청을 보냄
        });

        if (response.ok) {
            // 로컬 스토리지에서 JWT 토큰 제거
            localStorage.removeItem('jwtToken');

            // 모든 쿠키 제거
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
            });

            // 홈 페이지로 이동
            window.location.href = '/src/FE/index.html';
        } else {
            /** 오류 처리 */
            const errorData = await response.json();
            alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
            throw new Error(errorData.message || '로그아웃 실패');
        }
    } catch (error) {
        console.error(error);
    }
}
