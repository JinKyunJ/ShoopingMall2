const {Router} = require('express');
const asyncHandler = require('../middlewares/async-handler');
const cashService = require('../services/cashService');
// 현재 사용자가 로그인했는지 체크하는 미들웨어 적용
const reqUserCheck = require('../middlewares/reqUserCheck');
const isAdmin = require('../middlewares/isAdmin');

const router = Router();

// create (bodyData : user_nanoid)
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await cashService.createCash(bodyData);
    return res.status(201).json(result);    
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await cashService.findAllCash();
    return res.status(200).json(result);
}));

// findOne
router.get('/find', reqUserCheck, asyncHandler(async (req, res) => {
    const user_nanoid = req.user.nanoid;
    const result = await cashService.findById({user_nanoid});
    return res.status(200).json(result);
}));

// update (bodyData : cash)
router.put('/update', reqUserCheck, asyncHandler(async (req, res) => {
    const user_nanoid = req.user.nanoid;
    const bodyData = req.body;
    const result = await cashService.updateById({user_nanoid}, bodyData);
    return res.status(200).json(result);
}));

// delete
router.delete('/delete', reqUserCheck, isAdmin, asyncHandler(async (req,res) => {
    const user_nanoid = req.user.nanoid;
    const result = await cashService.deleteById({user_nanoid});
    return res.status(200).json(result);
}));

module.exports = router;



