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
            status: "주문 완료"
        });
        // 주문 상품 load ( bodyData 에서 상품 고유 번호들을 전달 받아야 함 )
        // bodyData.prod_nanoid 배열
        const prod_nanoid = bodyData.prod_nanoid;
        if(!prod_nanoid){
            const error = new Error();
            Object.assign(error, {code: 404, message: "load 되는 주문 상품이 없습니다. 다시 주문하신 상품을 확인해주세요."})
            throw error;
        }
        await prod_nanoid.forEach(async (v) => {
            const product = await Product.findOne({nanoid: v});
            if(!product){
                const error = new Error();
                Object.assign(error, {code: 404, message: "load 되는 nanoid로 조회된 상품이 없습니다."})
                throw error;
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
        return orders;
    }
        
    // findOne
    async findById({nanoid}){
        const order = await Order.findOne({nanoid}).populate('user');
        if(!order){
            const error = new Error();
            Object.assign(error, {code: 404, message: "주문내역이 없습니다."})
            throw error;
        }
        return order;
    }
  
    // update (bodyData : address or total_price or delivery_request)
    async updateById({nanoid}, bodyData) {
        const order = await Order.findOne({nanoid});
        if (!order) {
            const error = new Error();
            Object.assign(error, {code: 404, message: "주문내역이 없습니다."})
            throw error;
    }   else {
            Reflect.deleteProperty(bodyData, "user");
            Reflect.deleteProperty(bodyData, "nanoid");
            await Order.updateOne(order, bodyData); 
            return {message: `${nanoid} 주문 수정 동작 완료`}; 
        }

    }
    // delete
    async deleteById({nanoid}) {
        const order = await Order.findOne({nanoid});
        if (!order) {
            const error = new Error();
            Object.assign(error, {code: 404, message: "주문내역이 없습니다."})
            throw error;
        } else {
            await Order.deleteOne(order);
            return {message: `${nanoid} 주문 삭제 동작 완료`};
        }
    }
};
 

const orderService = new OrderService();
module.exports = orderService;