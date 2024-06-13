const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const userService = require('../services/userService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await userService.createUser(bodyData);
    res.json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await userService.findAllUser();
    res.json(result);
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await userService.findById({nanoid});
    res.json(result);
}));

// findOne email
router.post('/find', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const result = await userService.findByEmail({email});
    res.json(result);
}));

// find and update
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    const result = await userService.updateById({nanoid}, bodyData);
    res.json(result);
}));

// find email and update
router.put('/', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const bodyData = req.body;
    console.log(Reflect.deleteProperty(bodyData, "email"));
    const result = await userService.updateByEmail({email}, bodyData);
    res.json(result);
}));

// find and delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await userService.deleteById({nanoid});
    res.json(result);
}));

// find email and delete
router.post('/delete', asyncHandler(async (req,res) => {
    const {email} = req.body;
    const result = await userService.deleteByEmail({email});
    res.json(result);
}));


module.exports = router;