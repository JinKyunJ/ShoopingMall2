const {Product} = require('../models');

class ProductService {
    // create
    async createProduct({price, image, detailImage, delivery, title, ad, maker}){
        const result = await Product.create({price, image, detailImage, delivery, title, ad, maker});
        console.log(result);
        return result;
    }

    // find

    // findOne

    // find and update

    // find and delete
}

const productService = new ProductService();
module.exports = productService;