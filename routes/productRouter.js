const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const productService = require('../services/productService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const {price, image, detailImage, delivery, title, ad, maker} = req.body;
    const result = await productService.createProduct({price, image, detailImage, delivery, title, ad, maker});
    res.json(result);
}));
// find all

// findOne

// update

// delete


module.exports = router;