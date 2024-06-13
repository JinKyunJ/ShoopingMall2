const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const categoryService = require('../services/categoryService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await categoryService.createCategory(bodyData);
    if(result.value === "fail"){
        return res.status(400).json(result);
    } else {
        return res.status(201).json(result);
    }
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await categoryService.findAllCategory();
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await categoryService.findById({nanoid});
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
    const result = await categoryService.updateById({nanoid}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await categoryService.deleteById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

module.exports = router;