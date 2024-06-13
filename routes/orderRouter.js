const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const orderService = require('../services/orderService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await orderService.createOrder(bodyData);
    if(result.value === "fail"){
        res.status(400).json(result);
    } else {
        res.status(201).json(result);
    }
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await orderService.findAllOrder();
    if(result.value === "fail"){
        res.status(404).json(result);
    } else {
        res.status(200).json(result);
    }
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await orderService.findById({nanoid});
    if(result.value === "fail"){
        res.status(404).json(result);
    } else {
        res.status(200).json(result);
    }
}));

// update
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    const result = await orderService.updateById({nanoid}, bodyData);
    if(result.value === "fail"){
        res.status(404).json(result);
    } else {
        res.status(200).json(result);
    }
}));


// delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await orderService.deleteById({nanoid});
    if(result.value === "fail"){
        res.status(404).json(result);
    } else {
        res.status(200).json(result);
    }
}));




module.exports = router;