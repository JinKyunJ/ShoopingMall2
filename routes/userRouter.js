const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const userService = require('../services/userService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
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

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await userService.findById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne email
router.post('/email', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const result = await userService.findByEmail({email});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// find and update
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    const result = await userService.updateById({nanoid}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// find email and update
router.put('/', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const bodyData = req.body;
    console.log(Reflect.deleteProperty(bodyData, "email"));
    const result = await userService.updateByEmail({email}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// find and delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await userService.deleteById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// find email and delete
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