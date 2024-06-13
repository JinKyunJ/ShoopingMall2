const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const productService = require('../services/productService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await productService.createProduct(bodyData);
    res.json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await productService.findAllProduct();
    res.json(result);
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await productService.findById({nanoid});
    res.json(result);
}));

// update
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    const result = await productService.updateById({nanoid}, bodyData);
    res.json(result);
}));

// delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await productService.deleteById({nanoid});
    res.json(result);
}));


module.exports = router;