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
    createAt: {
        type: String,
        default: () => { return newDate() },
        require: true
    },
    // 수정 시간
    updateAt: {
        type: String,
        default: () => { return newDate() },
        require: true
    },
    // 좋아요 (true: 좋아요, false: 아쉬워요)
    like: {
        type: Boolean,
        require: true
    }
}, {
    timestamps: true
});

const productSchema = new Schema({
    // 상품 고유 번호
    __id: {
        type: String,
        default: () => { return nanoid() },
        require: true,
        index: true
    },
    // 가격
    price: {
        type: String,
        require: true
    },
    // 상품 이미지
    image: {
        type: String,
        require: true
    },
    // 배송 방법
    delivery: {
        type: String,
        require: true
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // 상품 등록 시간
    createAt: {
        type: String,
        default: () => { return newDate() },
        require: true
    },
    // 상품 업데이트 시간
    updateAt: {
        type: String,
        default: () => { return newDate() },
        require: true
    },
    // 상품 상세 정보
    detailContent: {
        type: String,
        require: true
    },
    // 상품 한줄평
    comments: [commentSchema]
},{
    timestamps: true
});

module.exports = productSchema;
