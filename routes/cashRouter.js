const {Router} = require('express');
const asyncHandler = require('../middlewares/async-handler');
const cashService = require('../services/cashService');
// 현재 사용자가 로그인했는지 체크하는 미들웨어 적용
const reqUserCheck = require('../middlewares/reqUserCheck');

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
router.get('/:user_nanoid', asyncHandler(async (req, res) => {
    const {user_nanoid} = req.params;
    const result = await cashService.findById({user_nanoid});
    return res.status(200).json(result);
}));

// update (bodyData : cash)
router.put('/:user_nanoid', reqUserCheck, asyncHandler(async (req, res) => {
    const {user_nanoid} = req.params;

    // 접근한 사용자가 is_admin === true 일 경우 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }
    
    const bodyData = req.body;
    const result = await cashService.updateById({user_nanoid}, bodyData);
    return res.status(200).json(result);
}));

// delete
router.delete('/:user_nanoid', reqUserCheck, asyncHandler(async (req,res) => {
    const {user_nanoid} = req.params;

    // 접근한 사용자가 is_admin === true 일 경우 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }

    const result = await cashService.deleteById({user_nanoid});
    return res.status(200).json(result);
}));

module.exports = router;



