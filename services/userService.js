const {User} = require('../models');
const {Cash} = require('../models');
const {Like} = require('../models');

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
            const newUser = await User.create(bodyData);
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
        return users;
    }

    // findOne by nanoid
    async findById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            throw new Error("조회된 회원이 없습니다.");
        }
        return user;
    }

    // findOne by email
    async findByEmail({email}) {
        const user = await User.findOne({email});
        if(!user){
            throw new Error("이메일로 조회된 회원이 없습니다.");
        }
        return user;
    }

    // update by nanoid (bodyData : name or password or address or birthday or gender)
    async updateById({nanoid}, bodyData){
        const user = await User.findOne({nanoid});
        if(!user){
            throw new Error("조회된 회원이 없습니다.");
        } else {
            await User.updateOne(user, bodyData);
            return {message: `${nanoid} 사용자 수정 동작 완료`};
        }
    }

    // update by email (bodyData : name or password or address or birthday or gender)
    async updateByEmail({email}, bodyData){
        const user = await User.findOne({email});
        if(!user){
            throw new Error("조회된 회원이 없습니다.");
        } else {
            await User.updateOne(user, bodyData);
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