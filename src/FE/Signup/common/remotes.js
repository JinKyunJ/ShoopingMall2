/** 이메일 인증번호 전송 API 함수 */
export async function sendEmailCerification(email) {
    try {
        const response = await fetch('/users/verify', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
            return data;
        } else {
            alert('이메일 인증에 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error(error);
    }
}

/** 이메일 인증번호 확인 API 함수 */
export async function certificationCode(email, code) {
    try {
        const response = await fetch('/users/verify/confirm', {
            method: 'POST',
            body: JSON.stringify({ email, secret: code }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json(); // 변수에 할당 하지 않고 데이터 반환
        } else {
            alert('이메일 인증번호 확인에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error(error);
    }
}

/** 주소 검색 API 함수 */
export async function searchAddress(address) {
    try {
        const response = await fetch(`/users/search-address?q=${address}`);
        if (response.ok) {
            return await response.json(); // 변수에 할당 하지 않고 데이터 반환
        } else {
            alert('주소 검색에 실패했습니다. 나중에 다시 시도해주세요.');
        }
    } catch (error) {
        console.error(error);
    }
}

/** 회원가입 API 함수 */
export async function signupUser(email, password, name, address) {
    try {
        const response = await fetch('/users', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, address }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json(); // 변수에 할당 하지 않고 데이터 반환
        } else {
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error(error);
    }
}
