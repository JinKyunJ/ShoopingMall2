const {Order} = require('../models');
const {User} = require('../models');
const {Product} = require('../models');

class OrderService {
    // create (bodyData : required -> address, total_price, products / not required -> delivery_request)
    async createOrder(reqUser, bodyData){
        const user = await User.findOne({
            nanoid: reqUser.nanoid
        });
        const order = await Order.create({
            user: user,
            address: bodyData.address,
            delivery_request: bodyData.delivery_request,
            total_price: bodyData.total_price,
            detail_content: bodyData.detail_content,
            delivery: bodyData.delivery
        });
        // 주문 상품 load ( bodyData 에서 상품 고유 번호들을 전달 받아야 함 )
        // bodyData.prod_nanoid 배열
        const prod_nanoid = bodyData.prod_nanoid;
        prod_nanoid.forEach(async (v) => {
            const product = await Product.findOne({nanoid: v});
            if(!product){
                throw new Error("load 되는 nanoid로 조회된 상품이 없습니다.");
            } else {
                // $push 오퍼레이터 : 주문서에 추가되는 상품 요청 처리
                await Order.updateOne(
                    {nanoid: order.nanoid}
                ,{
                    $push: {products: product},
                }); // 적용된 내용 확인
            }
        });
        return order;
    }
    
    // find all
    async findAllOrder(){
        const orders = await Order.find().populate('user');
        if(orders.length === 0){
            throw new Error("주문내역이 없습니다.");
        }
        return orders;
    }
        
    // findOne
    async findById({nanoid}){
        const order = await Order.findOne({nanoid}).populate('user');
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