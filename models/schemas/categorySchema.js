const {Schema} = require('mongoose');
// 중복 없는 문자열을 생성해주는 nanoid
const {nanoid} = require('nanoid');
// 추가 또는 수정될 때마다 날짜 데이터를 만들어주는 newDate()
const newDate = require('../../utils/newDate');

const categorySchema = new Schema({
    __id: {
        type: String,
        default: () => {return nanoid()},        
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: () => {return newDate()}
    },
    updateAt: {
        type: Date,
        default: () => {return newDate()}
    }
}, {
    timestamps: true
})

module.exports = categorySchema;