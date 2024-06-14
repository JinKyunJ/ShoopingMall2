const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const cashService = require('../services/cashService');

const router = Router();

// create (bodyData : user_nanoid)
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await cashService.createCash(bodyData);
    if(result.value === "fail"){
        return res.status(400).json(result);
    } else {
        return res.status(201).json(result);
    }
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await cashService.findAllCash();
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne
router.get('/:user_nanoid', asyncHandler(async (req, res) => {
    const {user_nanoid} = req.params;
    const result = await cashService.findById({user_nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// update (bodyData : cash)
router.put('/:user_nanoid', asyncHandler(async (req, res) => {
    const {user_nanoid} = req.params;

    // 접근한 사용자가 is_admin === true 일 경우 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }
    
    const bodyData = req.body;
    // 수정할 수 없는 user_nanoid 는 bodyData 프로퍼티에서 제거
    Reflect.deleteProperty(bodyData, "user_nanoid")
    const result = await cashService.updateById({user_nanoid}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else if(result.value === "fail_update"){
        return res.status(403).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// delete
router.delete('/:user_nanoid', asyncHandler(async (req,res) => {
    const {user_nanoid} = req.params;

    // 접근한 사용자가 is_admin === true 일 경우 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }

    const result = await cashService.deleteById({user_nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

module.exports = router;



