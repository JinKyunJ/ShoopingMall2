const {Router} = require('express');
const path = require('path');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    res.json("test");
}));


module.exports = router;

