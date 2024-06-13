const {Product} = require('../models');

class ProductService {
    /* create (bodyData : required: true -> price, image, delivery, title, ad, seller 
                        / required: false -> sale, detail_image, detail_content)
    */
    async createProduct(bodyData){
        const newProduct = await Product.create(bodyData);
        const result = {
            value: "ok",
            data: newProduct
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

    /* update (bodyData : price or image or delivery or title or ad or seller 
                or sale or detail_image or detail_content)
    */
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


    // delete
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