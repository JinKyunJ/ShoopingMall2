const {Schema} = require('mongoose');
// 추가 또는 수정될 때마다 날짜 데이터를 만들어주는 newDate()
const newDate = require('../../utils/newDate');

const cashSchema = new Schema({
    // user nanoid(고유 번호)
    user_nanoid: {
        type: String,
        required: true,
        index: true
    },
    // user 적립금 현황
    cash: {
        type: Number,
        default: 0
    },
    // 적립금 생성 시간
    create_at: {
        type: String,
        default: () => {return newDate()},
    },
    // 적립금 업데이트 시간
    update_at: {
        type: String,
        default: () => {return newDate()},
    }
},{
    timestamps: true
});

module.exports = cashSchema;