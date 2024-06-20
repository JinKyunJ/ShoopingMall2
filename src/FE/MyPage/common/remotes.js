/** 중복되는 API 호출 및 페이지 이동 함수 */
export async function fetchAndNavigate(url) {
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
            // alert('페이지 이동에 실패했습니다. 나중에 다시 시도해주세요.');
        }
    } catch (error) {
        // console.error(error);
    }
}

/** 사용자 이름 가져오기 API 함수 */
export async function fetchUserName() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/getuser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // JWT 토큰을 헤더에 포함
            }
        });
        if (response.ok) {
            const data = await response.json();
            await fetch('/users/email',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email
                })
            })
            .then(res => res.json())
            .then(res => {
                const userNameElement = document.getElementById('user-name');
                userNameElement.textContent = `${res.user.name}님`; /** 요소의 텍스트 내용을 `${data.name}님`으로 변경 */
            })
            } else {
            alert('사용자 정보를 가져오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error(error);
    }
}

/** 로그아웃 API 함수 */
export async function logoutUser() {
    try {
        // JWT 토큰을 로컬 스토리지에서 가져옴
        const token = localStorage.getItem('jwtToken');

        const response = await fetch('/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization 헤더에 토큰 추가
                Authorization: `Bearer ${token}`
            },
            credentials: 'include' // 쿠키를 포함한 요청을 보냄
        });

        if (response.ok) {
            // 로컬 스토리지에서 JWT 토큰 제거
            localStorage.removeItem('jwtToken');

            // 모든 쿠키 제거
            document.cookie.split(';').forEach((c) => {
                document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
            });

            // 홈 페이지로 이동
            window.location.href = '/';
        } else {
            alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error(error);
    }
}
