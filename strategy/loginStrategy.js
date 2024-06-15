const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models');

// id 필드와 password 필드 정의
const config = {
    usernameField: 'email',
    passwordField: 'password'
};

// 기본 로그인 동작 strategy 작성
const local = new LocalStrategy(config, async(email, password, done) => {
    try{
        // 기본 로그인 동작 strategy 로 들어오는 email 로 유저 조회
        const user = await User.findOne({email});
        if(!user){
            throw new Error('회원을 찾을 수 없습니다.');
        }
        // password 일치 여부 검사
        if(user.password !== password){
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        // 정상 done 콜백 함수 호출
        done(null, {
            nanoid: user.nanoid,
            email: user.email,
            name: user.name,
            address: user.address,
            is_passwordReset: user.is_passwordReset,
            is_admin: user.is_admin
        });
    } catch(err) {
        done(err, null);
    }
});

module.exports = local;