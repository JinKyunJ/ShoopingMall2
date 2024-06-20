import { fetchAndNavigate, fetchUserName, logoutUser } from '../MyPage/common/remotes.js';

/** 사용자 이름 가져오기 함수 호출 */
fetchUserName();

/** 전체 등급 확인 버튼 클릭 시 */
const onGradeButton = document.querySelector('.grade-button');
onGradeButton.addEventListener('click', () => {
    window.location.href = '#';
});

/** 대시보드 버튼 클릭 시 */
document.querySelectorAll('.dashboard-button').forEach((button) => {
    button.addEventListener('click', async (event) => {
        const url = event.currentTarget.getAttribute('data-url');

        try {
            await fetchAndNavigate(url, event);
        } catch (error) {
            alert(error.message);
        }
    });
});

/** 메뉴 정보 섹션 버튼 클릭 시 */
document.querySelectorAll('.menu-info-section button').forEach((button) => {
    button.addEventListener('click', async (event) => {
        const url = event.currentTarget.getAttribute('data-url');

        try {
            await fetchAndNavigate(url, event);
        } catch (error) {
            alert(error.message);
        }
    });
});

/** 로그아웃 버튼 클릭 시 로그아웃 처리 후 홈 페이지로 이동 */
const onLogoutButton = document.querySelector('.logout-button');
onLogoutButton.addEventListener('click', async (event) => {
    try {
        await logoutUser(event);
    } catch (error) {
        alert(error.message);
    }
});
