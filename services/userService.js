const {User, Product} = require('../models');
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
            throw new Error("이미 회원가입 되어 있는 이메일입니다.");
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
            return newUser;
        }
    }

    // find all
    async findAllUser(){
        const users = await User.find();
        // 전체 유저 조회 시 적립금, like 한 제품을 모두 전달 (usersData)
        const usersData = {};
        for(let i=0;i<users.length;i++){
            const userData = {user: users[i]};
            const user_nanoid = users[i].nanoid;
            const cash = await cashService.findById({user_nanoid});
            const likeProd = await likeService.findByUser({user_nanoid});
            userData.cash = cash;
            userData.likeProd = likeProd;
            usersData[`userData${i}`] = userData;
        }
        return usersData;
    }

    // findOne by nanoid
    async findById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            throw new Error("조회된 회원이 없습니다.");
        }
        // 유저 조회 시 적립금, like 한 제품을 모두 전달 (userData)
        const userData = {user};
        const user_nanoid = user.nanoid;
        const cash = await cashService.findById({user_nanoid});
        const likeProd = await likeService.findByUser({user_nanoid});
        userData.cash = cash;
        userData.likeProd = likeProd;
        return userData;
    }

    // findOne by email
    async findByEmail({email}) {
        const user = await User.findOne({email});
        if(!user){
            throw new Error("이메일로 조회된 회원이 없습니다.");
        }
        // 유저 조회 시 적립금, like 한 제품을 모두 전달 (userData)
        const userData = {user};
        const user_nanoid = user.nanoid;
        const cash = await cashService.findById({user_nanoid});
        const likeProd = await likeService.findByUser({user_nanoid});
        userData.cash = cash;
        userData.likeProd = likeProd;
        return userData;
    }

    // update by nanoid (bodyData : name or password or address or birthday or gender)
    async updateById({nanoid}, bodyData){
        const user = await User.findOne({nanoid});
        if(!user){
            throw new Error("조회된 회원이 없습니다.");
        } else {
            // 유저 수정 시 적립금에 변동이 있을 경우, 해당 유저의 적립금 데이터 수정
            const user_nanoid = user.nanoid;
            await User.updateOne(user, bodyData);
            await cashService.updateById({user_nanoid}, bodyData);
            return {message: `${nanoid} 사용자 수정 동작 완료`};
        }
    }

    // update by email (bodyData : name or password or address or birthday or gender)
    async updateByEmail({email}, bodyData){
        const user = await User.findOne({email});
        if(!user){
            throw new Error("조회된 회원이 없습니다.");
        } else {
            // 유저 수정 시 적립금에 변동이 있을 경우, 해당 유저의 적립금 데이터 수정
            const user_nanoid = user.nanoid;
            await User.updateOne(user, bodyData);
            await cashService.updateById({user_nanoid}, bodyData);
            return {message: `${email} 사용자 수정 동작 완료`};
        }
    }

    // delete by nanoid
    async deleteById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            throw new Error("조회된 회원이 없습니다.");
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
            throw new Error("조회된 회원이 없습니다.");
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