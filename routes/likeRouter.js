const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const likeService = require('../services/likeService');
// 현재 사용자가 로그인했는지 체크하는 미들웨어 적용
const reqUserCheck = require('../middlewares/reqUserCheck');

const router = Router();

// createOrDelete (bodyData : user_nanoid & prod_nanoid)
router.post('/', reqUserCheck, asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await likeService.createOrDelete(bodyData);
    if(result.value === "ok_delete"){
        return res.status(200).json(result);
    } else {
        return res.status(201).json(result);
    }
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await likeService.findAllLike();
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne By user_nanoid
router.get('/user/:user_nanoid', asyncHandler(async (req, res) => {
    const {user_nanoid} = req.params;
    const result = await likeService.findByUser({user_nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne By prod_nanoid
router.get('/prod/:prod_nanoid', asyncHandler(async (req, res) => {
    const {prod_nanoid} = req.params;
    const result = await likeService.findByProd({prod_nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

module.exports = router;