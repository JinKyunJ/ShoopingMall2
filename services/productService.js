const {Product} = require('../models');

class ProductService {
    /* create (bodyData : required: true -> price, image, delivery, title, ad, seller 
                        / required: false -> sale, detail_image, detail_content)
    */
    async createProduct(bodyData){
        return await Product.create(bodyData);
    }

    // find all
    async findAllProduct(){
        const products = await Product.find();
        if(products.length === 0){
            throw new Error("조회된 상품이 없습니다.");
        } else {
            return products;
        }
    }

    // findOne
    async findById({nanoid}){
        const product = await Product.findOne({nanoid});
        if(!product) {
            throw new Error("조회된 상품이 없습니다.");
        } else {
            return product;
        }
    }

    /* update (bodyData : price or image or delivery or title or ad or seller 
                or sale or detail_image or detail_content)
    */
    async updateById({nanoid}, bodyData){
        const product = await Product.findOne({nanoid});
        if(!product){
            throw new Error("조회된 상품이 없습니다.");
        } else {
            await Product.updateOne(product, bodyData);
            return `${nanoid} 상품 수정 완료`;
        }
    }


    // delete
    async deleteById({nanoid}) {
        const product = await Product.findOne({nanoid});
        if(!product){
            throw new Error("조회된 상품이 없습니다.");
        } else {
            await Product.deleteOne(product);
            return `${nanoid} 상품 삭제 완료`;
        }
    }
}

const productService = new ProductService();
module.exports = productService;