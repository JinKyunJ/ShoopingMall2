const {Router} = require('express');
const asyncHandler = require('../middlewares/async-handler');
const productService = require('../services/productService');
// 현재 사용자가 로그인했는지 체크하는 미들웨어 적용
const reqUserCheck = require('../middlewares/reqUserCheck');
const isAdmin = require('../middlewares/isAdmin');

const router = Router();

/* create (bodyData : required: true -> price, image, delivery, title, ad, seller 
                    / required: false -> sale, detail_image, detail_content)
*/
router.post('/', reqUserCheck, isAdmin, asyncHandler(async (req, res) => {
    const bodyData = req.body;

    const result = await productService.createProduct(bodyData);
    return res.status(201).json(result);
}));

// find all
router.get('/', asyncHandler(async (req, res) => {
    const result = await productService.findAllProduct();
    return res.status(200).json(result);
}));

// findOne
router.get('/:nanoid', asyncHandler(async (req, res) => {
    const {nanoid} = req.params;
    const result = await productService.findById({nanoid});
    return res.status(200).json(result);
}));

/* update (bodyData : price or image or delivery or title or ad or seller 
            or sale or detail_image or detail_content)
*/
router.put('/:nanoid', reqUserCheck, isAdmin, asyncHandler(async (req, res) => {
    const {nanoid} = req.params;

    const bodyData = req.body;
    const result = await productService.updateById({nanoid}, bodyData);
    return res.status(200).json(result);
}));

// delete
router.delete('/:nanoid', reqUserCheck, isAdmin, asyncHandler(async (req,res) => {
    const {nanoid} = req.params;

    const result = await productService.deleteById({nanoid});
    return res.status(200).json(result);
}));


module.exports = router;