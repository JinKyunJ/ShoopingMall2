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
            /** 응답 실패 시 */
            const errorData = await response.json(); // 구체적이 오류 메시지
            alert('회원 정보를 가져오는데 실패했습니다. 다시 시도해주세요.');
            throw new Error(errorData.message || '회원 정보 불러오기 실패');
        }
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}
