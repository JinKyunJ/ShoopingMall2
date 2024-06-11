const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const userService = require('../services/userService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const {email, name, password, address, birthday, gender} = req.body;
    const result = await userService.createUser({email, name, password, address, birthday, gender});
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

// find and update
router.post('/update/:__id', asyncHandler(async (req, res) => {
    const {__id} = req.params;
    const query = req.body;
    const result = await userService.findUpdate({__id}, query);
    res.json(result);
}));

// find and delete
router.delete('/delete/:__id', asyncHandler(async (req,res) => {
    const {__id} = req.params;
    const result = await userService.findDelete({__id});
    res.json(result);
}));


module.exports = router;