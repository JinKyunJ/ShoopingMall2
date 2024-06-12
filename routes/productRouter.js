const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const productService = require('../services/productService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const query = req.body;
    const result = await productService.createProduct(query);
    res.json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await productService.findAllProduct();
    res.json(result);
}));

// findOne
router.get('/:__id', asyncHandler(async (req, res) => {
    const {__id} = req.params;
    const result = await productService.findProduct({__id});
    res.json(result);
}));

// update
router.post('/update/:__id', asyncHandler(async (req, res) => {
    const {__id} = req.params;
    const query = req.body;
    const result = await productService.findUpdate({__id}, query);
    res.json(result);
}));

// delete
router.delete('/delete/:__id', asyncHandler(async (req,res) => {
    const {__id} = req.params;
    const result = await productService.findDelete({__id});
    res.json(result);
}));


module.exports = router;