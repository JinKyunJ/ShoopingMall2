const {Router} = require('express');
const path = require('path');
const asyncHandler = require('../middlewares/async-handler');
const {User} = require('../models');
const reqUserCheck = require('../middlewares/reqUserCheck');
const router = Router();

router.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/index.html"));
});

// (테스트용) 로그인한 정보 확인 시 전달 라우터
router.get('/getuser', asyncHandler(async (req, res) => {
    // (테스트용) req.user 전달
    return res.json(req.user);
}));

// JWT LOGOUT : 쿠키에 있는 토큰을 비우고, 만료 기간 0 으로 설정
router.get('/logout', reqUserCheck, async (req, res, next) => {
    res.cookie('token', null, {
        maxAge: 0
    });
    return res.status(200).json("정상적으로 로그아웃 되었습니다.");
});

// page sendfile (여기에 없는 주소 ->  메인 : '/' , 로그인 : '/login')
router.get('/admin', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/Admin/admin.html"));
});
router.get('/admin/member', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/Admin/Admin-member/admin-member_Management.html"));
});
router.get('/admin/memberdetail', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/Admin/Admin-member/member-detail.html"));
});
router.get('/admin/products', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/Admin/product/product-list.html"));
});
router.get('/admin/product/view', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/Admin/product/product-view.html"));
});
router.get('/category', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/Category/Category.html"));
});
router.get('/productdetails', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/ProductDetails/Productdetails.html"));
});
router.get('/profileedit', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/ProfileEdit/ProfileEdit.html"));
});
router.get('/productlist', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/product/product_list.html"));
});
router.get('/cart', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/Cart/AddCartPage.html"));
});
router.get('/mypage', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/MyPageRedirect/MyPage_Redirect.html"));
});
router.get('/mypage/in', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/MyPage/MyPage.html"));
})
router.get('/ProductList', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/ProductList/Search-Product.html"));
});
router.get('/signup', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/Signup/Signup.html"));
});
router.get('/order', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/order/order.html"));
});
router.get('/orderEnd', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/order/orderEnd.html"));
});
router.get('/search', (req, res) => {
    return res.sendFile(path.join(__dirname + "/../src/FE/search/search.html"));
});





module.exports = router;

