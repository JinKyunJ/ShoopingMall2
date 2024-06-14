const {Router} = require('express');
const asyncHandler = require('../middlewares/async-handler');
const categoryService = require('../services/categoryService');
// 현재 사용자가 로그인했는지 체크하는 미들웨어 적용
const reqUserCheck = require('../middlewares/reqUserCheck');

const router = Router();

// create (bodyData : name)
router.post('/', reqUserCheck, asyncHandler(async (req, res) => {
    // 접근한 사용자가 is_admin === true 일 경우 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }
    const bodyData = req.body;
    const result = await categoryService.createCategory(bodyData);
    return res.status(201).json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await categoryService.findAllCategory();
    return res.status(200).json(result);
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await categoryService.findById({nanoid});
    return res.status(200).json(result);
}));

// update (bodyData : name)
router.put('/:nanoid', reqUserCheck, asyncHandler(async (req, res) => {
    const {nanoid} = req.params;

    // 접근한 사용자가 is_admin === true 일 경우 수정이 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }

    const bodyData = req.body;
    // 수정할 수 없는 nanoid property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "nanoid");
    const result = await categoryService.updateById({nanoid}, bodyData);
    return res.status(200).json(result);
}));

// delete
router.delete('/:nanoid', reqUserCheck, asyncHandler(async (req,res) => {
    const {nanoid} = req.params;

    // 접근한 사용자가 is_admin === true 일 경우 제거가 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }
    const result = await categoryService.deleteById({nanoid});
    return res.status(200).json(result);
}));

module.exports = router;