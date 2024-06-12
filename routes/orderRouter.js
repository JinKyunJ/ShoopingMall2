const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const orderService = require('../services/orderService');

const router = Router();

// create
router.post('/', asyncHandler(async (req, res) => {
    const query = req.body;
    const result = await orderService.createOrder(query);
    res.json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await orderService.selectAllOrder();
    res.json(result);
}));

// findOne
router.get('/:__id', asyncHandler(async (req, res) => {
    const {__id} = req.params;
    const result = await orderService.findOrder({__id});
    res.json(result);
}));

// update
router.post('/update/:__id', asyncHandler(async (req, res) => {
    const {__id} = req.params;
    const query = req.body;
    const result = await orderService.findUpdate({__id}, query);
    
    res.json(result);
}));


// delete
router.delete('/delete/:__id', asyncHandler(async (req,res) => {
    const {__id} = req.params;
    const result = await orderService.deleteOrderById({__id});
    res.json(result);
}));




module.exports = router;