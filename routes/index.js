const {Router} = require('express');
const path = require('path');
const asyncHandler = require('../middlewares/async-handler');
const {User} = require('../models');
const reqUserCheck = require('../middlewares/reqUserCheck');
const router = Router();

router.get('/', (req, res) => {
    return res.json("main");
});

// (테스트용) 로그인한 정보 확인 시 전달 라우터
router.get('/getuser', asyncHandler(async (req, res) => {
    // (테스트용) req.user 전달
    return res.json(req.user);
}));

// JWT LOGOUT : 쿠키에 있는 토큰을 비우고, 만료 기간 0 으로 설정
router.get('/logout', reqUserCheck, async (req, res, next) => {
    res.cookie('token', null, {
        maxAge: 0
    });
    return res.status(200).json("정상적으로 로그아웃 되었습니다.");
});

module.exports = router;

