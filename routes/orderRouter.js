const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const orderService = require('../services/orderService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    const result = await orderService.createOrder(bodyData);
    res.json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await orderService.findAllOrder();
    res.json(result);
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await orderService.findById({nanoid});
    res.json(result);
}));

// update
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    const result = await orderService.updateById({nanoid}, bodyData);
    
    res.json(result);
}));


// delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await orderService.deleteOrderById({nanoid});
    res.json(result);
}));




module.exports = router;