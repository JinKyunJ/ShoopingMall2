/** 사용자 정보 가져오기 API 함수 */
export async function getUserInfo() {
    try {
        const response = await fetch('/get-user-info');
        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            alert('사용자 정보를 불러오는데 실패했습니다.');
            throw new Error(errorData.message || '사용자 정보 불러오기 실패');
        }
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}

/** 현재 비밀번호 확인 API 함수 */
export async function checkPassword(password) {
    try {
        const response = await fetch('/check-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        return await response.json();
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}

/** 사용자 탈퇴 API 함수 */
export async function deleteUser() {
    try {
        const response = await fetch('/delete-user', {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('회원 탈퇴가 완료되었습니다.');
            window.location.href = '/home';
        } else {
            const errorData = await response.json();
            alert('탈퇴 처리에 실패했습니다. 다시 시도해주세요.');
            throw new Error(errorData.message || '탈퇴 처리 실패');
        }
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}

/** 사용자 정보 수정 API 함수 */
export async function editUserInfo(email, currentPassword, newPassword, name) {
    try {
        const response = await fetch('/edit-user-info', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                currentPassword,
                newPassword,
                name
            })
        });

        if (response.ok) {
            alert('사용자 정보가 수정되었습니다.');
            window.location.href = '/home';
        } else {
            const errorData = await response.json();
            alert('사용자 정보 수정에 실패했습니다. 다시 시도해주세요.');
            throw new Error(errorData.message || '사용자 정보 수정 실패');
        }
    } catch (error) {
        alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}
