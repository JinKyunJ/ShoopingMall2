const {Order} = require('../models');

class OrderService {
    // create (bodyData : required -> address, total_price / not required -> delivery_request)
    async createOrder(bodyData){
        return await Order.create(bodyData);
    }
    
    // find all
    async findAllOrder(){
        const orders = await Order.find();
        if(orders.length === 0){
            throw new Error("주문내역이 없습니다.");
        }
        return orders;
    }
        
    // findOne
    async findById({nanoid}){
        const order = await Order.findOne({nanoid});
        if(!order){
            throw new Error("주문내역이 없습니다.");
        }
        return order;
    }
  
    // update (bodyData : address or total_price or delivery_request)
    async updateById({nanoid}, bodyData) {
        const order = await Order.findOne({nanoid});
        if (!order) {
            throw new Error("주문내역이 없습니다.");
    }   else {
            await Order.updateOne(order, bodyData); 
            return `${nanoid} 주문 수정 동작 완료`; 
        }

    }
    // delete
    async deleteById({nanoid}) {
        const order = await Order.findOne({nanoid});
        if (!order) {
            throw new Error("주문내역이 없습니다.");
        } else {
            await Order.deleteOne(order);
            return `${nanoid} 주문 삭제 동작 완료` ;
        }
    }
};
 

const orderService = new OrderService();
module.exports = orderService;