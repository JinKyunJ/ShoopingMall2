const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const productService = require('../services/productService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await productService.createProduct(bodyData);
    return res.status(201).json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await productService.findAllProduct();
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await productService.findById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// update
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    const result = await productService.updateById({nanoid}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await productService.deleteById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));


module.exports = router;