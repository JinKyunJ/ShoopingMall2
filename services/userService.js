const {User} = require('../models');

class UserService {
    // create
    async createUser(bodyData){
        const {email} = bodyData;
        const user = await User.findOne({email});
        if(user){
            const result = {
                value : "fail",
                data : "이미 회원가입 되어 있는 이메일입니다."
            };
            return result;
        } else {
            const data = await User.create(bodyData);
            const result = {
                value : "ok",
                data : data
            };
            return result;
        }
    }

    // find all
    async findAllUser(){
        const users = await User.find();
        if(users.length === 0){
            const result = {
                value : "fail",
                data : "조회된 회원이 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : users
        };
        return result;
    }

    // findOne
    async findById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            const result = {
                value : "fail",
                data : "조회된 회원이 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : user
        };
        return result;
    }

    // findOne email
    async findByEmail({email}) {
        const user = await User.findOne({email});
        if(!user){
            const result = {
                value : "fail",
                data : "이메일로 조회된 회원이 없습니다."
            };
            return result;
        }
        const result = {
            value : "ok",
            data : user
        };
        return result;
    }

    // find and update
    async updateById({nanoid}, bodyData){
        const user = await User.findOne({nanoid});
        if(!user){
            const result = {
                value : "fail",
                data : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.updateOne(user, bodyData);
            const result = {
                value : "ok",
                data : `${nanoid} 사용자 수정 동작 완료`
            };
            return result;
        }
    }

    // find email and update
    async updateByEmail({email}, bodyData){
        const user = await User.findOne({email});
        if(!user){
            const result = {
                value : "fail",
                data : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.updateOne(user, bodyData);
            const result = {
                value : "ok",
                data : `${email} 사용자 수정 동작 완료`
            };
            return result;
        }
    }

    // find and delete
    async deleteById({nanoid}) {
        const user = await User.findOne({nanoid});
        if(!user){
            const result = {
                value : "fail",
                data : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.deleteOne(user);
            const result = {
                value : "ok",
                data : `${nanoid} 사용자 삭제 동작 완료`
            };
            return result;
        }
    }

    // find email and delete
    async deleteByEmail({email}) {
        const user = await User.findOne({email});
        if(!user){
            const result = {
                value : "fail",
                data : "조회된 회원이 없습니다."
            };
            return result;
        } else {
            await User.deleteOne(user);
            const result = {
                value : "ok",
                data : `${email} 사용자 삭제 동작 완료`
            };
            return result;
        }
    }
}

const userService = new UserService();
module.exports = userService;