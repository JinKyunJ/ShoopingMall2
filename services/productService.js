const {Product} = require('../models');

class ProductService {
    // create
    async createProduct(bodyData){
        const data = await Product.create(bodyData);
        const result = {
            value: "ok",
            data: data
        };
        return result;
    }

    // find all
    async findAllProduct(){
        const products = await Product.find();
        if(products.length === 0){
            const result = {
                value : "fail",
                data : "조회된 상품이 없습니다."
            };
            return result;
        } else {
            const result = {
                value : "ok",
                data : products
            };
            return result;
        }
    }

    // findOne
    async findById({nanoid}){
        const product = await Product.findOne({nanoid});
        if(!product) {
            const result = {
                value : "fail",
                data : "조회된 상품이 없습니다."
            };
            return result;
        } else {
            const result = {
                value : "ok",
                data : product
            };
            return result;
        }
    }


    // find and update
    async updateById({nanoid}, bodyData){
        const product = await Product.findOne({nanoid});
        if(!product){
            const result = {
                value : "fail",
                data : "조회된 상품이 없습니다."
            };
            return result;
        } else {
            await Product.updateOne(product, bodyData);
            const result = {
                value : "ok",
                data : `${nanoid} 상품 수정 완료`
            };
            return result;
        }
    }


    // find and delete
    async deleteById({nanoid}) {
        const product = await Product.findOne({nanoid});
        if(!product){
            const result = {
                value : "fail",
                data : "조회된 상품이 없습니다."
            };
            return result;
        } else {
            await Product.deleteOne(product);
            const result = {
                value : "ok",
                data : `${nanoid} 상품 삭제 완료`
            };
            return result;
        }
    }
}

const productService = new ProductService();
module.exports = productService;