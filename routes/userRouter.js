const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const userService = require('../services/userService');

const router = Router();

/* create (bodyData : required: true -> email, name, password, address
                    / required: false -> birthday, gender)
*/
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    // 지정 할 수 없는 nanoid property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "nanoid");
    const result = await userService.createUser(bodyData);
    if(result.value === "fail"){
        return res.status(400).json(result);
    } else {
        return res.status(201).json(result);
    }
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await userService.findAllUser();
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne by nanoid
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await userService.findById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne by email
router.post('/email', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const result = await userService.findByEmail({email});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// update by nanoid (bodyData : name or password or address or birthday or gender)
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    // 수정할 수 없는 email, nanoid property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "email");
    Reflect.deleteProperty(bodyData, "nanoid");
    const result = await userService.updateById({nanoid}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// update by email (bodyData : name or password or address or birthday or gender)
router.put('/', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const bodyData = req.body;
    // 수정할 수 없는 email, nanoid property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "email");
    Reflect.deleteProperty(bodyData, "nanoid");
    const result = await userService.updateByEmail({email}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// delete by nanoid
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await userService.deleteById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// delete by email
router.post('/deleteByEmail', asyncHandler(async (req,res) => {
    const {email} = req.body;
    const result = await userService.deleteByEmail({email});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));


module.exports = router;