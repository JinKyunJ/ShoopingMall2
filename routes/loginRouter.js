const {Router} = require('express');
const path = require('path');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const asyncHandler = require('../utils/async-handler');
const loginCheck = require('../middlewares/loginCheck');
const jwt = require('jsonwebtoken');
const secret = process.env.COOKIE_SECRET;

// 처음 로그인 했을 때 클라이언트에 줄 토큰에다가 signature(secret) 으로 서명 후 전달함.
const setUserToken = (res, user) => {
    const token = jwt.sign(user, secret);
    res.cookie('token', token);
};

const router = Router();

router.get('/', (req, res) => {
    return res.json("login");
});

// login
router.post('/auth', loginCheck, passport.authenticate('local', {session: false}), (req, res, next) => {
    // 로그인 성공 했을 때 클라이언트에 줄 토큰에다가 signature(secret) 으로 서명 후 전달함.
    setUserToken(res, req.user);
    console.log("login 후 서버에서 req.user 체크");
    console.log(req.user);
    // 비밀번호 찾기를 통한 첫 로그인에 성공한 유저의 passwordReset 값이 true 이면 패스워드 초기화 진행
    if(req.user && req.user.passwordReset){
        const result = {
            value: "ok_reset",
            data: "임시 비밀번호로 로그인한 사용자입니다. 패스워드 초기화가 필요합니다."
        };
        return res.json(result);  
    }

    // 일반 로그인 성공 알림
    const result = {
        value: "ok",
        data: "로그인에 성공하였습니다."
    };
    return res.json(result);
});



module.exports = router;