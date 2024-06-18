const {User, Product, Like} = require('../models');
const {Cash} = require('../models');
const cashService = require('../services/cashService');
const likeService = require('../services/likeService');
// sha256 단방향 해시 비밀번호 사용
const crypto = require('crypto');

class UserService {
    /* create (bodyData : required: true -> email, name, password, address
                        / required: false -> birthday, gender)
    */
    async createUser(bodyData){
        const {email} = bodyData;
        const user = await User.findOne({email});
        if(user){
            const error = new Error();
            Object.assign(error, {code: 400, message: "이미 회원가입 되어 있는 이메일입니다."})
            throw error;
        } else {
            // sha256 단방향 해시 비밀번호 사용
            const hash = crypto.createHash('sha256').update(bodyData.password).digest('hex');
            const newUser = await User.create({
                email: bodyData.email,
                name: bodyData.name,
                password: hash,
                address: bodyData.address,
                birthday: bodyData.birthday,
                gender: bodyData.gender,
                is_admin: false,
                is_passwordReset: false
            });
            await Cash.create({
                user_nanoid: newUser.nanoid,
                cash: 0
            });
            return {message: `${bodyData.email} 계정으로 회원가입이 성공하였습니다.`};
        }
    }

    // find all
    async findAllUser(){
        const users = await User.find();
        // 전체 유저 조회 시 적립금, like 한 제품을 모두 전달 (usersData)
        // 유저 나 상품 조회 시 like 를 객체 배열 전달로 수정하고 
        // likeProd 일 경우 그에 대한 상품 정보를, likeUser 일 경우 그에 대한 유저 정보를 넘김
        const usersData = [];
        for(let i = 0;i < users.length;i++){
            const userData = {user: users[i]};
            const user_nanoid = users[i].nanoid;
            const cash = await cashService.findById({user_nanoid});
            userData.cash = cash;
            const likes = await likeService.findByUser({user_nanoid});
            const likeProd = [];
            for(let j =0;j< likes.length;j++){
                const nanoid = likes[j].prod_nanoid;
                const data = await Product.findOne({nanoid: nanoid});
                likeProd.push(data);
            }
            userData.likeProd = likeProd;
            usersData[i] = userData;
        }
        return usersData;
    }

    // findOne by nanoid
    async findById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 회원이 없습니다."})
            throw error;
        }
        // 유저 조회 시 적립금, like 한 제품을 모두 전달 (userData)
        const userData = {user: user};
        const user_nanoid = user.nanoid;
        const cash = await cashService.findById({user_nanoid});
        userData.cash = cash;
        // 유저 나 상품 조회 시 like 를 객체 배열 전달로 수정하고 
        // likeProd 일 경우 그에 대한 상품 정보를, likeUser 일 경우 그에 대한 유저 정보를 넘김
        const likes = await likeService.findByUser({user_nanoid});
        const likeProd = [];
        for(let i=0;i<likes.length;i++){
            const nanoid = likes[i].prod_nanoid;
            const data = await Product.findOne({nanoid: nanoid});
            likeProd.push(data);
        }
        userData.likeProd = likeProd;
        return userData;
    }

    // findOne by email
    async findByEmail({email}) {
        const user = await User.findOne({email});
        if(!user){
            const error = new Error();
            Object.assign(error, {code: 404, message: "이메일로 조회된 회원이 없습니다."})
            throw error;
        }
        // 유저 조회 시 적립금, like 한 제품을 모두 전달 (userData)
        const userData = {user: user};
        const user_nanoid = user.nanoid;
        const cash = await cashService.findById({user_nanoid});
        userData.cash = cash;
        // 유저 나 상품 조회 시 like 를 객체 배열 전달로 수정하고 
        // likeProd 일 경우 그에 대한 상품 정보를, likeUser 일 경우 그에 대한 유저 정보를 넘김
        const likes = await likeService.findByUser({user_nanoid});
        const likeProd = [];
        for(let i=0;i<likes.length;i++){
            const nanoid = likes[i].prod_nanoid;
            const data = await Product.findOne({nanoid: nanoid});
            likeProd.push(data);
        }
        userData.likeProd = likeProd;
        return userData;
    }

    // update by nanoid (bodyData : name or password or address or birthday or gender)
    async updateById({nanoid}, bodyData){
        const user = await User.findOne({nanoid});
        if(!user){
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 회원이 없습니다."})
            throw error;
        } else {
            // 유저 수정 시 적립금에 변동이 있을 경우, 해당 유저의 적립금 데이터 수정
            const user_nanoid = user.nanoid;
            if(bodyData.password){
                // sha256 단방향 해시 비밀번호 사용
                const hash = crypto.createHash('sha256').update(bodyData.password).digest('hex');
                bodyData.password = hash
            }
            Reflect.deleteProperty(bodyData, "email");
            Reflect.deleteProperty(bodyData, "nanoid");
            await User.updateOne(user, bodyData);
            await cashService.updateById({user_nanoid}, bodyData);
            return {message: `${nanoid} 사용자 수정 동작 완료`};
        }
    }

    // update by email (bodyData : name or password or address or birthday or gender)
    async updateByEmail({email}, bodyData){
        const user = await User.findOne({email});
        if(!user){
            const error = new Error();
            Object.assign(error, {code: 404, message: "이메일로 조회된 회원이 없습니다."})
            throw error;
        } else {
            // 유저 수정 시 적립금에 변동이 있을 경우, 해당 유저의 적립금 데이터 수정
            const user_nanoid = user.nanoid;
            // sha256 단방향 해시 비밀번호 사용
            if(bodyData.password){
                // sha256 단방향 해시 비밀번호 사용
                const hash = crypto.createHash('sha256').update(bodyData.password).digest('hex');
                bodyData.password = hash
            }
            Reflect.deleteProperty(bodyData, "email");
            Reflect.deleteProperty(bodyData, "nanoid");
            await User.updateOne(user, bodyData);
            await cashService.updateById({user_nanoid}, bodyData);
            return {message: `${email} 사용자 수정 동작 완료`};
        }
    }

    // delete by nanoid
    async deleteById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            const error = new Error();
            Object.assign(error, {code: 404, message: "조회된 회원이 없습니다."})
            throw error;
        } else {
            await Like.deleteMany({user_nanoid: user.nanoid});
            await Cash.deleteOne({user_nanoid: user.nanoid});
            await User.deleteOne(user);
            return {message: `${nanoid} 사용자 삭제 동작 완료`};
        }
    }

    // delete by email
    async deleteByEmail({email}) {
        const user = await User.findOne({email});
        if(!user){
            const error = new Error();
            Object.assign(error, {code: 404, message: "이메일로 조회된 회원이 없습니다."})
            throw error;
        } else {
            await Like.deleteMany({user_nanoid: user.nanoid});
            await Cash.deleteOne({user_nanoid: user.nanoid});
            await User.deleteOne(user);
            return {message: `${email} 사용자 삭제 동작 완료`};
        }
    }
}

const userService = new UserService();
module.exports = userService;