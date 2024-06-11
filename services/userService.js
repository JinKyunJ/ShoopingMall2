const {User} = require('../models');

class UserService {
    // create
    async createUser({email, name, password, address, birthday, gender}){
        const user = await User.findOne({email});
        if(user){
            const result = {
                result : "fail",
                reason : "이미 회원가입 되어 있는 이메일입니다."
            }
            return result;
        } else {
            const result = await User.create({email, name, password, address, birthday, gender});
            console.log(result);
            return result;
        }
    }

    // find all
    async selectAllUser(){
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
    async findUser({__id}) {
        const user = await User.findOne({__id});
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
    async findUserEmail({email}) {
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
    async findUpdate({__id}, query){
        const user = await User.findOne({__id});
        if(!user){
            const result = {
                result : "fail",
                reason : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.updateOne(user, query);
            const result = {
                result : "ok"
            };
            return result;
        }
    }

    // find email and update
    async findUpdateEmail({email}, query){
        const user = await User.findOne({email});
        if(!user){
            const result = {
                result : "fail",
                reason : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.updateOne(user, query);
            const result = {
                result : "ok"
            };
            return result;
        }
    }

    // find and delete
    async findDelete({__id}) {
        const user = await User.findOne({__id});
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
    async findDeleteEmail({email}) {
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