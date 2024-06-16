const {Like} = require('../models');

class LikeService {
    // createOrDelete (bodyData : user_nanoid & prod_nanoid)
    async createOrDelete(bodyData){
        const like = await Like.findOne(bodyData);
        if(like){
            await Like.deleteOne(like);
            return {message: "찜이 해제되었습니다."};
        } else {
            return await Like.create(bodyData);
        }
    }

    // find
    async findAllLike(){
        const likes = await Like.find();
        return likes;
    }

    // findOne By user_nanoid
    async findByUser({user_nanoid}) {
        const likes = await Like.find({user_nanoid});
        if(likes.length === 0){
            throw new Error("해당 유저는 찜한 상품이 없습니다.");
        }
        return likes;
    }

    // findOne By user_nanoid
    async findByProd({prod_nanoid}) {
        const likes = await Like.find({prod_nanoid});
        if(likes.length === 0){
            throw new Error("해당 상품에는 찜한 사용자가 없습니다.");
        }
        return likes;
    }
}

const likeService = new LikeService();
module.exports = likeService;