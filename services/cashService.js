const {Cash} = require('../models');

class CashService {
    // create (bodyData : user_nanoid)
    async createCash(bodyData){
        const cash = await Cash.findOne(bodyData);
        if(cash){
            const result = {
                value : "fail",
                data : "이미 생성된 적립금 데이터입니다."
            }
            return result;
        } else {
            const newCash = await Cash.create(bodyData);
            const result = {
                value : "ok",
                data : newCash
            };
            return result;
        }
    }

    // find
    async findAllCash(){
        const cashes = await Cash.find();
        if(cashes.length === 0){
            const result = {
                value : "fail",
                data : "조회된 적립금 데이터가 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : cashes
        };
        return result;
    }

    // findOne
    async findById({user_nanoid}) {
        const cash = await Cash.findOne({user_nanoid});
        if(!cash){
            const result = {
                value : "fail",
                data : "조회된 적립금 데이터가 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : cash
        };
        return result;
    }

    // update (bodyData : cash)
    async updateById({user_nanoid}, bodyData){
        const cash = await Cash.findOne({user_nanoid});
        if(!cash){
            const result = {
                value : "fail",
                data : "조회된 적립금 데이터가 없습니다."
            };
            return result;
        } else {
            if(bodyData.user_nanoid){
                const result = {
                    value : "fail_update",
                    data : "적립금 데이터에서 사용자는 수정할 수 없습니다."
                };
                return result;
            }
            else {
                await Cash.updateOne(cash, {
                    $inc: {cash: bodyData.cash}
                });
                const result = {
                    value : "ok",
                    data : `${user_nanoid} 적립금 변경 동작 완료`
                };
                return result;
            }
        }
    }

    // delete
    async deleteById({user_nanoid}) {
        const cash = await Cash.findOne({user_nanoid});
        if(!cash){
            const result = {
                value : "fail",
                data : "조회된 적립금 데이터가 없습니다."
            };
            return result;
        } else {
            await Cash.deleteOne(cash);
            const result = {
                value : "ok",
                data : `${user_nanoid} 적립금 삭제 동작 완료`
            };
            return result;
        }
    }
}

const cashService = new CashService();
module.exports = cashService;