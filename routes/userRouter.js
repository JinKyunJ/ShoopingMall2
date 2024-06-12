const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const userService = require('../services/userService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const query = req.body;
    const result = await userService.createUser(query);
    res.json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await userService.selectAllUser();
    res.json(result);
}));

// findOne
router.get('/:__id', asyncHandler(async (req, res) => {
    const {__id} = req.params;
    const result = await userService.findUser({__id});
    res.json(result);
}));

// findOne email
router.post('/find', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const result = await userService.findUserEmail({email});
    res.json(result);
}));

// find and update
router.post('/update/:__id', asyncHandler(async (req, res) => {
    const {__id} = req.params;
    const query = req.body;
    const result = await userService.findUpdate({__id}, query);
    res.json(result);
}));

// find email and update
router.post('/update', asyncHandler(async (req, res) => {
    const {email} = req.body;
    const query = req.body;
    console.log(Reflect.deleteProperty(query, "email"));
    const result = await userService.findUpdateEmail({email}, query);
    res.json(result);
}));

// find and delete
router.delete('/delete/:__id', asyncHandler(async (req,res) => {
    const {__id} = req.params;
    const result = await userService.findDelete({__id});
    res.json(result);
}));

// find email and delete
router.post('/delete', asyncHandler(async (req,res) => {
    const {email} = req.body;
    const result = await userService.findDeleteEmail({email});
    res.json(result);
}));


module.exports = router;