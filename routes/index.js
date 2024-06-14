const {Router} = require('express');
const path = require('path');
const asyncHandler = require('../utils/async-handler');
const {User} = require('../models');

const router = Router();

router.get('/', (req, res) => {
    return res.json("main");
});

// 프론트에서 현재 로그인한 user 확인 시 전달 라우터
router.get('/getuser', asyncHandler(async (req, res) => {
    // 프론트로 req.user 전달
    return res.json(req.user);
}));

// JWT LOGOUT : 쿠키에 있는 토큰을 비우고, 만료 기간 0 으로 설정
router.get('/logout', async (req, res, next) => {
    res.cookie('token', null, {
        maxAge: 0
    });
    const result = {
        value: "ok",
        data: "정상적으로 로그아웃 되었습니다."
    };
    return res.json(result);
});

module.exports = router;

