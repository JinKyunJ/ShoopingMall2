const {Router} = require('express');
const asyncHandler = require('../utils/async-handler');
const productService = require('../services/productService');
// 현재 사용자가 로그인했는지 체크하는 미들웨어 적용
const reqUserCheck = require('../middlewares/reqUserCheck');

const router = Router();

/* create (bodyData : required: true -> price, image, delivery, title, ad, seller 
                    / required: false -> sale, detail_image, detail_content)
*/
router.post('/', reqUserCheck, asyncHandler(async (req, res) => {
    const bodyData = req.body;

    // 접근한 사용자가 is_admin === true 일 경우 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }

    // 지정 할 수 없는 nanoid property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "nanoid");
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

/* update (bodyData : price or image or delivery or title or ad or seller 
            or sale or detail_image or detail_content)
*/
router.put('/:nanoid', reqUserCheck, asyncHandler(async (req, res) => {
    const {nanoid} = req.params;

    // 접근한 사용자가 is_admin === true 일 경우 수정이 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }

    const bodyData = req.body;
    // 수정할 수 없는 nanoid property 는 bodyData 에서 제거
    Reflect.deleteProperty(bodyData, "nanoid");
    const result = await productService.updateById({nanoid}, bodyData);
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));

// delete
router.delete('/:nanoid', reqUserCheck, asyncHandler(async (req,res) => {
    const {nanoid} = req.params;

    // 접근한 사용자가 is_admin === true 일 경우 제거가 가능함.
    if(req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }

    const result = await productService.deleteById({nanoid});
    if(result.value === "fail"){
        return res.status(404).json(result);
    } else {
        return res.status(200).json(result);
    }
}));


module.exports = router;