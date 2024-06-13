const {User} = require('../models');

class UserService {
    // create
    async createUser(bodyData){
        const {email} = bodyData;
        const user = await User.findOne({email});
        if(user){
            const result = {
                result : "fail",
                reason : "이미 회원가입 되어 있는 이메일입니다."
            }
            return result;
        } else {
            const result = await User.create(bodyData);
            console.log(result);
            return result;
        }
    }

    // find all
    async findAllUser(){
        const users = await User.find();
        if(users.length === 0){
            const result = {
                result : "fail",
                reason : "조회된 회원이 없습니다."
            };
            return result;
        }
        return users;
    }

    // findOne
    async findById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            const result = {
                result : "fail",
                reason : "조회된 회원이 없습니다."
            };
            return result;
        }
        return user;
    }

    // findOne email
    async findByEmail({email}) {
        const user = await User.findOne({email});
        if(!user){
            const result = {
                result : "fail",
                reason : "이메일로 조회된 회원이 없습니다."
            };
            return result;
        }
        return user;
    }

    // find and update
    async updateById({nanoid}, bodyData){
        const user = await User.findOne({nanoid});
        if(!user){
            const result = {
                result : "fail",
                reason : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.updateOne(user, bodyData);
            const result = {
                result : "ok"
            };
            return result;
        }
    }

    // find email and update
    async updateByEmail({email}, bodyData){
        const user = await User.findOne({email});
        if(!user){
            const result = {
                result : "fail",
                reason : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.updateOne(user, bodyData);
            const result = {
                result : "ok"
            };
            return result;
        }
    }

    // find and delete
    async deleteById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            const result = {
                result : "fail",
                reason : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.deleteOne(user);
            const result = {
                result : "ok"
            };
            return result;
        }
    }

    // find email and delete
    async deleteByEmail({email}) {
        const user = await User.findOne({email});
        if(!user){
            const result = {
                result : "fail",
                reason : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.deleteOne(user);
            const result = {
                result : "ok"
            };
            return result;
        }
    }
}

const userService = new UserService();
module.exports = userService;