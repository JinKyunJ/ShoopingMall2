const {Like} = require('../models');

class LikeService {
    // createOrDelete (bodyData : user_nanoid & prod_nanoid)
    async createOrDelete(bodyData){
        const like = await Like.findOne(bodyData);
        if(like){
            await Like.deleteOne(like);
            const result = {
                value : "ok_delete",
                data : "찜이 해제되었습니다."
            }
            return result;
        } else {
            const newLike = await Like.create(bodyData);
            const result = {
                value : "ok_create",
                data : newLike
            };
            return result;
        }
    }

    // find
    async findAllLike(){
        const likes = await Like.find();
        if(likes.length === 0){
            const result = {
                value : "fail",
                data : "조회된 찜 데이터가 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : likes
        };
        return result;
    }

    // findOne By user_nanoid
    async findByUser({user_nanoid}) {
        const likes = await Like.find({user_nanoid});
        if(likes.length === 0){
            const result = {
                value : "fail",
                data : "해당 유저는 찜한 상품이 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : likes
        };
        return result;
    }

    // findOne By user_nanoid
    async findByProd({prod_nanoid}) {
        const likes = await Like.find({prod_nanoid});
        if(likes.length === 0){
            const result = {
                value : "fail",
                data : "해당 상품에는 찜한 사용자가 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : likes
        };
        return result;
    }
}

const likeService = new LikeService();
module.exports = likeService;