const {Product} = require('../models');

class ProductService {
    // create
    async createProduct(bodyData){
        const result = await Product.create(bodyData);
        console.log(result);
        return result;
    }

    // find all
    async findAllProduct(){
        const products = await Product.find();
        if(products.length === 0){
            const result = {
                result : "fail",
                reason : "조회된 상품이 없습니다."
            };
            return result;
        }
        return products;
    }

    // findOne
    async findById({nanoid}){
        const product = await Product.findOne({nanoid});
        if(!product) {
            const result = {
                result : "fail",
                reason : "조회된 상품이 없습니다."
            };
            return result;
        }
        return product;
    }


    // find and update
    async updateById({nanoid}, bodyData){
        const product = await Product.findOne({nanoid});
        if(!product){
            const result = {
                result : "fail",
                reason : "조회된 상품이 없습니다."
            };
            return result;
        } else {
            await Product.updateOne(product, bodyData);
            const result = {
                result : "ok"
            };
            return result;
        }
    }


    // find and delete
    async deleteById({nanoid}) {
        const product = await Product.findOne({nanoid});
        if(!product){
            const result = {
                result : "fail",
                reason : "조회된 상품이 없습니다."
            };
            return result;
        } else {
            await Product.deleteOne(product);
            const result = {
                result : "ok"
            };
            return result;
        }
    }
}

const productService = new ProductService();
module.exports = productService;