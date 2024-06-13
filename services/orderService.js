const {Order} = require('../models');

class OrderService {
    // create (bodyData : required -> address, total_price / not required -> delivery_request)
    async createOrder(bodyData){
            const newOrder = await Order.create(bodyData);
            const result = {
                value: "ok",
                data: newOrder
            };
            return result;
        }
    
    // find all
    async findAllOrder(){
        const orders = await Order.find();
        if(orders.length === 0){
            const result = {
                value : "fail",
                data : "주문내역이 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : orders
        };
        return result;
    }
        
    
    // findOne
    async findById({nanoid}){
        const order = await Order.findOne({nanoid});
        if(!order){
            const result = {
                value : "fail",
                data : "주문내역이 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : order
        };
        return result;
    }
  
    // update (bodyData : address or total_price or delivery_request)
    async updateById({nanoid}, bodyData) {
        const order = await Order.findOne({nanoid});
        if (!order) {
            return {
            value: "fail",
            data: "주문 내역이 없습니다."
        };
    }   else {
            await Order.updateOne(order, bodyData); 
            const result = { 
                value : "ok",
                data : `${nanoid} 주문 수정 동작 완료`
            }; 
            return result; 
        }

    }
    // delete
    async deleteById({nanoid}) {
        const order = await Order.findOne({nanoid});
        if (!order) {
            return {
                value: "fail",
                data: "주문 내역이 없습니다."
            };
        } else {
            await Order.deleteOne(order);
            const result = { 
                value : "ok",
                data : `${nanoid} 주문 삭제 동작 완료` 
            }; 
            return result;
        }
    }
};
 

const orderService = new OrderService();
module.exports = orderService;