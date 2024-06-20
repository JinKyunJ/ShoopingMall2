/** 사용자 정보 가져오기 API 함수 */
export async function getUserInfo() {
    try {
        const response = await fetch('/getuser');
        if (response.ok) {
            return await response.json();
        } else {
            alert('사용자 정보를 불러오는데 실패했습니다.');
        }
    } catch (error) {
        console.error(error);
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
            alert('탈퇴 처리에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error(error);
    }
}

/** 사용자 정보 수정 API 함수 */
export async function editUserInfo(email, newPassword, name, address) {
    try {
        const response = await fetch('/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                newPassword,
                name,
                address
            })
        });

        if (response.ok) {
            alert('사용자 정보가 수정되었습니다.');
            window.location.href = '/';
        } else {
            alert('사용자 정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error(error);
    }
}
