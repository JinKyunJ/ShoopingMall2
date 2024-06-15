const {Router} = require('express');
const asyncHandler = require('../middlewares/async-handler');
const userService = require('../services/userService');
// 현재 사용자가 로그인했는지 체크하는 미들웨어 적용
const reqUserCheck = require('../middlewares/reqUserCheck');
const isAdminNanoid = require('../middlewares/isAdminNanoid');
const isAdminEmail = require('../middlewares/isAdminEmail');

const router = Router();

/* create (bodyData : required: true -> email, name, password, address
                    / required: false -> birthday, gender)
*/
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await userService.createUser(bodyData);
    return res.status(201).json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await userService.findAllUser();
    return res.status(200).json(result);
}));

// findOne by nanoid
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await userService.findById({nanoid});
    return res.status(200).json(result);
}));

// findOne by email
router.post('/email', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const result = await userService.findByEmail({email});
    return res.status(200).json(result);
}));

// update by nanoid (bodyData : name or password or address or birthday or gender)
router.put('/:nanoid', reqUserCheck, isAdminNanoid, asyncHandler(async (req, res) => {
    const {nanoid} = req.params;

    const bodyData = req.body;
    // 수정할 수 없는 email, nanoid property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "email");
    Reflect.deleteProperty(bodyData, "nanoid");
    const result = await userService.updateById({nanoid}, bodyData);
    return res.status(200).json(result);
}));

// update by email (bodyData : name or password or address or birthday or gender)
router.put('/', reqUserCheck, isAdminEmail, asyncHandler(async (req, res) => {
    const {email} = req.body;
    const bodyData = req.body;

    const result = await userService.updateByEmail({email}, bodyData);
    return res.status(200).json(result);
}));

// delete by nanoid
router.delete('/:nanoid', reqUserCheck, isAdminNanoid, asyncHandler(async (req,res) => {
    const {nanoid} = req.params;

    const result = await userService.deleteById({nanoid});
    return res.status(200).json(result);
}));

// delete by email
router.post('/deleteByEmail', reqUserCheck, isAdminEmail, asyncHandler(async (req,res) => {
    const {email} = req.body;

    const result = await userService.deleteByEmail({email});
    return res.status(200).json(result);
}));


module.exports = router;