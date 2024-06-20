import { searchAddress, signupUser, sendEmailCerification, certificationCode } from '../Signup/common/remotes.js';

/** X 버튼 클릭 시 로그인 페이지로 이동 */
const onBackButton = document.querySelector('.head-back-button');
onBackButton.addEventListener('click', () => {
    /** 경로 '/로그인 페이지' */
    window.location.href = '../Login/Login.html';
});

/** 이메일 인증 버튼 클릭 시 */
const onCertificationButton = document.getElementById('certification-button');
const emailInput = document.getElementById('email-input');

onCertificationButton.addEventListener('click', async () => {
    const email = emailInput.value;

    try {
        const data = await sendEmailCerification(email);
        if (data.exists) {
            alert('이미 사용중인 이메일입니다.');
        } else {
            alert('인증번호가 전송되었습니다.');
        }
    } catch (error) {
        alert(error.message);
    }
});

/** 이메일 인증 확인 버튼 클릭 시 */
const onConfirmButton = document.getElementById('confirm-button');
const confrimEmailInput = document.getElementById('confrim-email-input');

onConfirmButton.addEventListener('click', async () => {
    // 이메일과 인증번호 검증 하기 위해 email, code 변수로 저장
    const email = emailInput.value;
    const code = confrimEmailInput.value;

    try {
        const data = await certificationCode(email, code);
        if (data.valid) {
            alert('이메일 인증이 완료되었습니다.');
        } else '인증번호가 유효하지 않습니다.';
    } catch (error) {
        alert(error.message);
    }
});

/** 비밀번호 유효성 검사 */
const passwordInput = document.getElementById('password-input');
if (passwordInput) {
    passwordInput.addEventListener('input', () => {
        // input: 요소의 value(값)가 바뀔 때 발생
        const password = passwordInput.value;
        /** 에러 메시지 태그 */
        const errorSpan = document.getElementById('password-error');

        /** 비밀번호 길이 확인 */
        if (password.length > 0 && password.length < 10) {
            errorSpan.textContent = '10자 이상 입력해주세요.';
        } else {
            /** 영문, 숫자, 특수문자(공백 제외) 포함 여부 확인 / 정규표현식 사용 */
            const hasLetter = /[a-zA-Z]/.test(password); // 영문자 포함 여부
            const hasNumber = /[0-9]/.test(password); // 숫자 포함 여부
            const hasSpecialChar = /[^a-zA-Z0-9]/.test(password); // 특수 문자 포함 여부
            const isValidCombination = [hasLetter, hasNumber, hasSpecialChar].filter(Boolean).length >= 2;
            // filter() 이용해서 각각 2개 이상 조합 참, 거짓인지 확인

            if (!isValidCombination) {
                errorSpan.textContent = '영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합';
            } else {
                errorSpan.textContent = '';
            }
        }
    });
}

/** 비밀번호 확인 검증 */
const confirmPasswordInput = document.getElementById('confirm-password-input');
if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', () => {
        /** 에러 메시지 태그 */
        const errorSpan = document.getElementById('confirm-password-error');

        if (confirmPasswordInput.value !== passwordInput.value) {
            errorSpan.textContent = '동일한 비밀번호를 입력해주세요.';
        } else {
            errorSpan.textContent = '';
        }
    });
}

/** 이름 필드 검증 */
const nameInput = document.getElementById('name-input');
/** 에러 메시지 태그 */
const errorSpan = document.getElementById('name-error');

if (nameInput && errorSpan) {
    nameInput.addEventListener('input', () => {
        if (!nameInput.value.trim()) {
            // trim(): 공백을 제거하는 함수
            errorSpan.textContent = '이름을 입력해주세요.';
        } else {
            errorSpan.textContent = '';
        }
    });
}

/** 주소 검색 아이콘 클릭 시 */
const onSearchIcon = document.querySelector('.search-icon');
const addressInput = document.getElementById('address-input');

onSearchIcon.addEventListener('click', async (event) => {
    event.preventDefault();

    const address = addressInput.value; // 사용자가 입력한 검색어 저장

    try {
        const data = await searchAddress(address); // 검색어로 주소 검색
        if (data.length > 0) {
            addressInput.value = data[0].address; // 검색 결과 중 첫 번째 주소 입력필드에 할당
        } else {
            alert('검색 결과가 없습니다.');
        }
    } catch (error) {
        alert(error.message);
    }
});

/** 가입하기 버튼 클릭 시 */
const onSignupForm = document.getElementById('signup-form');

onSignupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = document.getElementById('password-input').value;
    const confirmPassword = document.getElementById('confirm-password-input').value;
    const name = document.getElementById('name-input').value;
    const address = document.getElementById('address-input').value;

    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    try {
        await signupUser(email, password, name, address);
        alert('회원가입이 성공적으로 완료되었습니다.');
        window.location.href = '../Login/Login.html'; // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
        alert(error.message);
    }
});
