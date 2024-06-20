const {Product} = require('../models');
const {User} = require('../models');
const {Category} = require('../models');
// 상품 조회 시 like 한 사람 데이터까지 모두 전달 (prodData)
const likeService = require('../services/likeService');

class ProductService {
    /* create (bodyData : required: true -> price, image, delivery, title, ad, seller 
                        / required: false -> sale, detail_image, detail_content)
    */
    async createProduct(bodyData){
        const category = await Category.findOne({
            name: bodyData.category
        });
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
        // 유저 나 상품 조회 시 like 를 객체 배열 전달로 수정하고 
        // likeProd 일 경우 그에 대한 상품 정보를, likeUser 일 경우 그에 대한 유저 정보를 넘김
        const prodsData = [];
        for(let i=0;i<products.length;i++){
            const prodData = {product: products[i]};
            const prod_nanoid = products[i].nanoid;
            const likes = await likeService.findByProd({prod_nanoid});
            const likeUser = [];
            for(let j =0;j< likes.length;j++){
                const nanoid = likes[j].user_nanoid;
                const data = await User.findOne({nanoid: nanoid});
                likeUser.push(data);
            }
            prodData.likeUser = likeUser;
            prodsData[i] = prodData;
        }
        return prodsData;
    }

    // findOne
    async findById({nanoid}){
        const product = await Product.findOne({nanoid}).populate('category');
        if(!product) {
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 상품이 없습니다."})
            throw error;
        } else {
            // 후기 내용 read 추가
            await Product.populate(product.comments, {
                path: 'author'
            });
            // 상품 조회 시 like 한 사람 데이터까지 모두 전달 (prodData)
            const prodData = {product: product};
            const prod_nanoid = product.nanoid;
            // 유저 나 상품 조회 시 like 를 객체 배열 전달로 수정하고 
            // likeProd 일 경우 그에 대한 상품 정보를, likeUser 일 경우 그에 대한 유저 정보를 넘김
            const likes = await likeService.findByProd({prod_nanoid});
            const likeUser = [];
            for(let j =0;j< likes.length;j++){
                const nanoid = likes[j].user_nanoid;
                const data = await User.findOne({nanoid: nanoid});
                likeUser.push(data);
            }
            prodData.likeUser = likeUser;
            return prodData;
        }
    }

    // 특정 상품에 후기 평(별 점 안 함) 남김
    async createComment({nanoid}, reqUser, bodyData){
        const product = await Product.findOne({nanoid});
        if(!product){
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 상품이 없습니다."})
            throw error;
        } else {
            const author = await User.findOne({
                nanoid: reqUser.nanoid
            });
            if(!bodyData.content) {
                const error = new Error();
                Object.assign(error, {code: 400, message: "후기 내용을 작성해주세요."})
                throw error;
            }
            // 한 상품에 후기를 한 개로 제한
            product.comments.forEach(v => {
                if(v.author.toString() === author._id.toString()){
                    const error = new Error();
                    Object.assign(error, {code: 400, message: "한 상품에 한 개의 후기만 작성할 수 있습니다."})
                    throw error;
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
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 상품이 없습니다."})
            throw error;
        } else {
            let category;
            if(bodyData.category){
                const categoryName = bodyData.category;
                category = await Category.findOne({
                    name: categoryName
                })
            } else {
                category = product.category;
            }

            const result = await Product.updateOne({nanoid: product.nanoid}, {
                price: bodyData.price,
                sale: bodyData.sale,
                image: bodyData.image,
                detail_image: bodyData.detail_image,
                detail_content: bodyData.detail_content,
                delivery: bodyData.delivery,
                title: bodyData.title,
                ad: bodyData.ad,
                seller: bodyData.seller,
                category: category,
            });
            // console.log(result)
            return {message: `${nanoid} 상품 수정 완료`};
        }
    }

    // update comment
    async updateCommentById({nanoid}, reqUser, bodyData){
        const product = await Product.findOne({nanoid});
        if(!product){
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 상품이 없습니다."})
            throw error;
        } else {
            const author = await User.findOne({
                nanoid: reqUser.nanoid
            });
            if(!bodyData.content) {
                const error = new Error();
                Object.assign(error, {code: 400, message: "후기 내용을 작성해주세요."})
                throw error;
            }
            // 내가 작성한 후기가 없을 때 에러처리
            const data = product.comments.find(v => {
                return v.author.toString() === author._id.toString();
            });

            if(!data){
                const error = new Error();
                Object.assign(error, {code: 404, message: "해당 상품에 작성하신 후기가 없습니다."})
                throw error;
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
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 상품이 없습니다."})
            throw error;
        } else {
            await Product.deleteOne(product);
            return {message: `${nanoid} 상품 삭제 완료`};
        }
    }

    // delete comment
    async deleteCommentById({nanoid}, reqUser){
        const product = await Product.findOne({nanoid});
        if(!product){
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 상품이 없습니다."})
            throw error;
        } else {
            const author = await User.findOne({
                nanoid: reqUser.nanoid
            });
            // 내가 작성한 후기가 없을 때 에러처리
            const data = product.comments.find(v => {
                return v.author.toString() === author._id.toString();
            });
            if(!data){
                const error = new Error();
                Object.assign(error, {code: 404, message: "해당 상품에 작성하신 후기가 없습니다."})
                throw error;
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