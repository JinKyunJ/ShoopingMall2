const {Order} = require('../models');

class OrderService {
    // create
    async createOrder(query){
            const newOrder = await Order.create(query);
            return newOrder;
    
            }
    

    // find
    async selectAllOrder(){
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
    async findOrder({__id}){
        const order = await Order.findOne({__id});
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
    async findUpdate({__id}, query) {
        const order = await Order.findOne({__id});
        if (!order) {
            return {
            result: "fail",
            reason: "주문 내역이 없습니다."
        };
    }   else {
            await Order.updateOne(order, query); 
            const result = { result : "ok" }; 
            return result; 
        }

}





// find and delete
async deleteOrderById({__id}) {
    const order = await Order.findOne({__id});
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