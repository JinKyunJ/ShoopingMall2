const {Product} = require('../models');
const {User} = require('../models');
const {Category} = require('../models');
// 상품 조회 시 like 한 사람 데이터까지 모두 전달 (prodData)
const likeService = require('../services/likeService')

class ProductService {
    /* create (bodyData : required: true -> price, image, delivery, title, ad, seller 
                        / required: false -> sale, detail_image, detail_content)
    */
    async createProduct(bodyData){
        const category = await Category.findOne({
            name: bodyData.category
        });
        console.log(category)
        return await Product.create({
            price: bodyData.price,
            sale: bodyData.sale,
            image: bodyData.image,
            detail_image: bodyData.detail_image,
            detail_content: bodyData.detail_content,
            delivery: bodyData.delivery,
            title: bodyData.title,
            ad: bodyData.ad,
            seller: bodyData.seller,
            category: category
        });
    }

    // find all
    async findAllProduct(){
        const products = await Product.find().populate('category');
        // 후기 내용 read 추가
        await Product.populate(products.comments, {
            path: 'author'
        });
        // 전체 상품 조회 시 like 한 사람을 모두 전달 (prodsData)
        const prodsData = {};
        for(let i=0;i<products.length;i++){
            const prodData = {product: products[i]};
            const prod_nanoid = products[i].nanoid;
            const likeUser = await likeService.findByProd({prod_nanoid});
            prodData.likeUser = likeUser;
            prodsData[`prodData${i}`] = prodData;
        }
        return prodsData;
    }

    // findOne
    async findById({nanoid}){
        const product = await Product.findOne({nanoid}).populate('category');
        if(!product) {
            throw new Error("조회된 상품이 없습니다.");
        } else {
            // 후기 내용 read 추가
            await Product.populate(product.comments, {
                path: 'author'
            });
            // 상품 조회 시 like 한 사람 데이터까지 모두 전달 (prodData)
            const prodData = {product};
            const prod_nanoid = product.nanoid;
            const likeUser = await likeService.findByProd({prod_nanoid});
            prodData.likeUser = likeUser;
            return prodData;
        }
    }

    // 특정 상품에 후기 평(별 점 안 함) 남김
    async createComment({nanoid}, reqUser, bodyData){
        const product = await Product.findOne({nanoid});
        if(!product){
            throw new Error("조회된 상품이 없습니다.");
        } else {
            const author = await User.findOne({
                nanoid: reqUser.nanoid
            });
            if(!bodyData.content) {
                throw new Error("후기 내용을 작성해주세요.");
            }
            // 한 상품에 후기를 한 개로 제한
            product.comments.forEach(v => {
                if(v.author.toString() === author._id.toString()){
                    throw new Error("한 상품에 한 개의 후기만 작성할 수 있습니다.");
                }
            })
            // $push 오퍼레이터 : 상품에 추가되는 후기 요청 처리
            const comment = await Product.findOneAndUpdate(
                {nanoid}
            ,{
                $push: {comments:{
                    content: bodyData.content,
                    author
                }},
            }, {new: true} ); // 적용된 내용 확인
            return comment;
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
            return {message: `${nanoid} 상품 수정 완료`};
        }
    }

    // update comment
    async updateCommentById({nanoid}, reqUser, bodyData){
        const product = await Product.findOne({nanoid});
        if(!product){
            throw new Error("조회된 상품이 없습니다.");
        } else {
            const author = await User.findOne({
                nanoid: reqUser.nanoid
            });
            if(!bodyData.content) {
                throw new Error("후기 내용을 작성해주세요.");
            }
            // 내가 작성한 후기가 없을 때 에러처리
            const data = product.comments.find(v => {
                return v.author.toString() === author._id.toString();
            });

            if(!data){
                throw new Error("해당 상품에 작성하신 후기가 없습니다.");
            }
            // $set 오퍼레이터 : 상품에 수정되는 후기 요청 처리
            const comment = await Product.findOneAndUpdate(
               {
                nanoid: nanoid,
                "comments.author": author
               }
            ,{
                $set: {"comments.$.content": bodyData.content}
            }, {new: true} ); // 적용된 내용 확인
            return comment;
        }
    }

    // delete
    async deleteById({nanoid}) {
        const product = await Product.findOne({nanoid});
        if(!product){
            throw new Error("조회된 상품이 없습니다.");
        } else {
            await Product.deleteOne(product);
            return {message: `${nanoid} 상품 삭제 완료`};
        }
    }

    // delete comment
    async deleteCommentById({nanoid}, reqUser){
        const product = await Product.findOne({nanoid});
        if(!product){
            throw new Error("조회된 상품이 없습니다.");
        } else {
            const author = await User.findOne({
                nanoid: reqUser.nanoid
            });
            // 내가 작성한 후기가 없을 때 에러처리
            const data = product.comments.find(v => {
                return v.author.toString() === author._id.toString();
            });
            if(!data){
                throw new Error("해당 상품에 작성하신 후기가 없습니다.");
            }

            // $pull 오퍼레이터 : 상품에 제거되는 후기 요청 처리
            const comment = await Product.findOneAndUpdate(
                {
                    nanoid: nanoid,
                    "comments.author": author
                },{
                    $pull: {"comments":{author: author}}
                }, {new: true} ); // 적용된 내용 확인
                return comment;
        }
    }
}

const productService = new ProductService();
module.exports = productService;