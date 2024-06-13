const {Schema} = require('mongoose');
// 중복 없는 문자열을 생성해주는 nanoid
const {nanoid} = require('nanoid');
// 상품 또는 상품평이 추가 또는 수정될 때마다 날짜 데이터를 만들어주는 newDate()
const newDate = require('../../utils/newDate');

const commentSchema = new Schema({
    // 상품평 내용
    content: String,
    // 상품 한줄평 작성자
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 작성 시간
    create_at: {
        type: String,
        default: () => { return newDate() }
    },
    // 수정 시간
    update_at: {
        type: String,
        default: () => { return newDate() }
    }
}, {
    timestamps: true
});

const productSchema = new Schema({
    // 상품 고유 번호
    nanoid: {
        type: String,
        default: () => { return nanoid() },
        required: true,
        index: true
    },
    // 가격
    price: {
        type: Number,
        required: true
    },
    // 할인율
    sale: {
        type: Number,
        required: false
    },
    // 리스트에서 보여지는 상품 이미지
    image: {
        type: String,
        required: true
    },
    // 상품 세부정보 이미지들
    detail_image: {
        type: [String],
        required: false
    },
    // 상품 세부정보 설명
    detail_content: {
        type: String,
        required: false
    },
    // 배송 방법
    delivery: {
        type: String,
        required: true
    },
    // 상품 이름
    title: {
        type: String,
        required: true
    },
    // 상품 광고 문구
    ad: {
        type: String,
        required: true
    },
    // 판매자
    seller: {
        type: String,
        required: true
    },
    // 상품 등록 시간
    create_at: {
        type: String,
        default: () => { return newDate() }
    },
    // 상품 업데이트 시간
    update_at: {
        type: String,
        default: () => { return newDate() }
    },
    // 찜 횟수
    like: {
        type: Number,
        default: 0
    },
    // 상품 한줄평
    comments: [commentSchema],
    // 상품 카테고리
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
},{
    timestamps: true
});

module.exports = productSchema;
