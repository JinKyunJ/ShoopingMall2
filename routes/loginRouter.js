const {Router} = require('express');
const path = require('path');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
// 이메일 형식 및 입력되었는지 체크
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

    // 일반 로그인 성공 알림
    return res.status(200).json("로그인에 성공하였습니다.");
});



module.exports = router;