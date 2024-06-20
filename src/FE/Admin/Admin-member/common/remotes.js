export async function fetchData(url) {
    try {
        const response = await fetch(url, {
            // 서버의 API 엔드포인트
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            /** 응답 성공 시 */
            return await response.json();
        } else {
            alert('회원 정보를 가져오는데 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error(error);
    }
}
