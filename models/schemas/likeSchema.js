const {Schema} = require('mongoose');
// 추가 또는 수정될 때마다 날짜 데이터를 만들어주는 newDate()
const newDate = require('../../utils/newDate');

const likeSchema = new Schema({
    // user nanoid(유저 고유 번호)
    user_nanoid: {
        type: String,
        required: true
    },
    // product nanoid(상품 고유 번호)
    prod_nanoid: {
        type: String,
        required: true
    },
    // 찜 생성 시간
    create_at: {
        type: String,
        default: () => {return newDate()},
    },
    // 찜 업데이트 시간
    update_at: {
        type: String,
        default: () => {return newDate()},
    }
},{
    timestamps: true
});

module.exports = likeSchema;