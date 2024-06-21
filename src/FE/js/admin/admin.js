// 어드민페이지 공통 js

const menuBtn = document.getElementById("openMenuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  if (menu.className.includes("active")) {
    menu.classList.remove("active");
  } else {
    menu.classList.add("active");
  }
});

/** 로그아웃 API 함수 */
async function logoutUser() {
  try {
    // JWT 토큰을 로컬 스토리지에서 가져옴
    const token = localStorage.getItem("jwtToken");

    const response = await fetch("/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization 헤더에 토큰 추가
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // 쿠키를 포함한 요청을 보냄
    });

    if (response.ok) {
      // 로컬 스토리지에서 JWT 토큰 제거
      localStorage.removeItem("jwtToken");

      // 모든 쿠키 제거
      document.cookie.split(";").forEach((c) => {
        document.cookie =
          c.trim().split("=")[0] +
          "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
      });

      // 홈 페이지로 이동
      window.location.href = "/";
    } else {
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error(error);
  }
}

/** 로그아웃 버튼 클릭 시 로그아웃 처리 후 홈 페이지로 이동 */
const onLogoutButton = document.querySelector(".logout-button");
onLogoutButton.addEventListener("click", async (event) => {
  try {
    await logoutUser();
  } catch (error) {
    alert(error.message);
  }
});
