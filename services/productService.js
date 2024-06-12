const {Product} = require('../models');

class ProductService {
    // create
    async createProduct(query){
        const result = await Product.create(query);
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
    async findProduct({__id}){
        const product = await Product.findOne({__id});
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
    async findUpdate({__id}, query){
        const product = await Product.findOne({__id});
        if(!product){
            const result = {
                result : "fail",
                reason : "조회된 상품이 없습니다."
            };
            return result;
        } else {
            await Product.updateOne(product, query);
            const result = {
                result : "ok"
            };
            return result;
        }
    }


    // find and delete
    async findDelete({__id}) {
        const product = await Product.findOne({__id});
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