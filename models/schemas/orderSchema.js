const {Schema} = require('mongoose');
// 중복 없는 문자열을 생성해주는 nanoid
const {nanoid} = require('nanoid');
// 추가 또는 수정될 때마다 날짜 데이터를 만들어주는 newDate()
const newDate = require('../../utils/newDate');
// 주문 상품 정보들 load
const productSchema = require('./productSchema');


const orderSchema = new Schema({
    // 주문 고유 번호
    nanoid: {
        type: String,
        default: () => {return nanoid()},
        required: true,
        index: true
    },
    // 주문 상품 정보
    order_products: [productSchema],
    // 주문자 정보
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 배송지 정보
    address: {
        type: String,
        required: true
    },
    // 배송 요청 사항
    delivery_request: {
        type: String,
        required: false
    },
    // 주문 총액(할인 가격 계산 포함)
    total_price: {
        type: Number,
        required: true
    },
    // 주문 등록 시간
    create_at: {
        type: String,
        default: () => { return newDate() }
    },
    // 주문 업데이트 시간
    update_at: {
        type: String,
        default: () => { return newDate() }
    },
},{
    timestamps: true
});

module.exports = orderSchema;