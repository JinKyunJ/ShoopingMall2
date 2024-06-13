const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const categoryService = require('../services/categoryService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await categoryService.createCategory(bodyData);
    res.json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await categoryService.findAllCategory();
    res.json(result);
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await categoryService.findById({nanoid});
    res.json(result);
}));

// update
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    const result = await categoryService.updateById({nanoid}, bodyData);
    res.json(result);
}));

// delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await categoryService.deleteById({nanoid});
    res.json(result);
}));

module.exports = router;