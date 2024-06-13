const {Order} = require('../models');

class OrderService {
    // create
    async createOrder(bodyData){
            const newOrder = await Order.create(bodyData);
            return newOrder;
    
            }
    

    // find
    async findAllOrder(){
        const orders = await Order.find();
        if(orders.length === 0){
            const result = {
                result : "fail",
                reason : "주문내역이 없습니다."
            };
            return result;
        }
        return orders;
    }
        
    
    // findOne 스키마 
    async findById({nanoid}){
        const order = await Order.findOne({nanoid});
        if(!order){
            const result = {
                result : "fail",
                reason : "주문내역이 없습니다."
            };
            return result;
        }
        return order;
    }
  
// find and update
    async updateById({nanoid}, bodyData) {
        const order = await Order.findOne({nanoid});
        if (!order) {
            return {
            result: "fail",
            reason: "주문 내역이 없습니다."
        };
    }   else {
            await Order.updateOne(order, bodyData); 
            const result = { result : "ok" }; 
            return result; 
        }

    }
    // find and delete
    async deleteById({nanoid}) {
        const order = await Order.findOne({nanoid});
        if (!order) {
            return {
                result: "fail",
                reason: "주문 내역이 없습니다."
            };
        } else {
            await Order.deleteOne(order);
            const result = { result : "ok" }; 
            return result;
        }
    }
};
 

const orderService = new OrderService();
module.exports = orderService;