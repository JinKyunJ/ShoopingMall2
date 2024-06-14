const {Cash} = require('../models');

class CashService {
    // create (bodyData : user_nanoid)
    async createCash(bodyData){
        const cash = await Cash.findOne(bodyData);
        if(cash){
            throw new Error("이미 생성된 적립금 데이터입니다.");
        } else {
            return await Cash.create(bodyData);
        }
    }

    // find
    async findAllCash(){
        const cashes = await Cash.find();
        if(cashes.length === 0){
            throw new Error("조회된 적립금 데이터가 없습니다.");
        }
        return cashes;
    }

    // findOne
    async findById({user_nanoid}) {
        const cash = await Cash.findOne({user_nanoid});
        if(!cash){
            throw new Error("조회된 적립금 데이터가 없습니다.");
        }
        return cash;
    }

    // update (bodyData : cash)
    async updateById({user_nanoid}, bodyData){
        const cash = await Cash.findOne({user_nanoid});
        if(!cash){
            throw new Error("조회된 적립금 데이터가 없습니다.");
        } else {
            await Cash.updateOne(cash, {
                $inc: {cash: bodyData.cash}
            });
            return `${user_nanoid} 적립금 변경 동작 완료`;
        }
    }

    // delete
    async deleteById({user_nanoid}) {
        const cash = await Cash.findOne({user_nanoid});
        if(!cash){
            throw new Error("조회된 적립금 데이터가 없습니다.");
        } else {
            await Cash.deleteOne(cash);
            return `${user_nanoid} 적립금 삭제 동작 완료`;
        }
    }
}

const cashService = new CashService();
module.exports = cashService;