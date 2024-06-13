const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const orderService = require('../services/orderService');

const router = Router();

// create (bodyData : required -> address, total_price / not required -> delivery_request)
router.post('/', asyncHandler(async (req, res) => {
    const bodyData = req.body;
    // 지정 할 수 없는 nanoid property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "nanoid");
    const result = await orderService.createOrder(bodyData);
    return res.status(201).json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await orderService.findAllOrder();
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await orderService.findById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// update (bodyData : address or total_price or delivery_request)
router.put('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const bodyData = req.body;
    // 수정할 수 없는 nanoid, user property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "nanoid");
    Reflect.deleteProperty(bodyData, "user");
    const result = await orderService.updateById({nanoid}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));


// delete
router.delete('/:nanoid', asyncHandler(async (req,res) => {
    const {nanoid} = req.params;
    const result = await orderService.deleteById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));




module.exports = router;