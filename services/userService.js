const {User, Product, Like, Verify, Cash} = require('../models');
const cashService = require('../services/cashService');
const likeService = require('../services/likeService');
const code = require('../utils/data/code');
const generateRandomValue = require('../utils/generate-random-value');
const sendEmail = require('../utils/nodemailer');
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
            Object.assign(error, {code: 400, message: "이미 회원가입 되어 있는 이메일입니다."});
            throw error;
        } else {
            // 이메일 인증이 정상적으로 되었는지(is_verified === true) 검사
            const verify = await Verify.findOne({data: email, code: code.VERIFYCODE});
            if(!verify){
                const error = new Error();
                Object.assign(error, {code: 401, message: "이메일 인증을 먼저 진행해주세요."});
                throw error;
            }
            if(!verify.is_verified){
                const error = new Error();
                Object.assign(error, {code: 401, message: "이메일 인증이 되지 않았습니다. 메일에서 인증 코드를 확인해주세요."});
                throw error;
            }

            // 이메일 인증이 되었고 회원가입을 진행하므로 더 이상 쓸모가 없으므로 제거
            await Verify.deleteMany(verify);

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
            return {code: 200, message: `${bodyData.email} 계정으로 회원가입이 성공하였습니다.`};
        }
    }

    // 회원 가입 메일 인증 코드 발급
    async joinVerify({email}){
        // 이메일 형식 체크
        if(!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)){
            const error = new Error();
            Object.assign(error, {code: 400, message: "이메일 형식을 다시 확인해주세요."})
            throw error;
        }
        // 인증 코드 받는 이메일이 이미 존재하는지 검사
        // 이메일 인증이 정식으로 들어갈 때 createUser 에 있는 이메일 존재 검사는 필요없음.
        const user = await User.findOne({email});
        if(user){
            const error = new Error();
            Object.assign(error, {code: 400, message: "이미 회원가입 되어 있는 이메일입니다."});
            throw error;
        }

        // 기존 verify 데이터가 있을 시 새 secret 으로 변경
        const newSecret = generateRandomValue(code.VERIFYCODE);
        const verify = await Verify.findOne({data: email, code: code.VERIFYCODE});
        if(verify){
            await Verify.updateOne({data: email, code: code.VERIFYCODE, secret: newSecret});
        }
        else{
            // 기존 verify 가 없을 때 새 verify document 생성
            await Verify.create({data: email, code: code.VERIFYCODE, secret: newSecret});
        }

        // 이메일 전송
        const subject = "1조 쇼핑몰 회원가입 이메일 인증 코드를 확인해주세요.";
        const text = `이메일 인증 코드 : ${newSecret}`;
        const result = await sendEmail(email, subject, text);
        if(result === 1){
            return {code:200, message: "인증 코드가 정상 발송되었습니다."};
        }
        else{
            const error = new Error();
            Object.assign(error, {code: 400, message: "메일 인증 코드가 발송되지 않았습니다."})
            throw error;
        }
    }

    // 회원 가입 이메일 인증 코드 확인 요청
    async joinVerifyConfirm({email, secret}){
        // 이메일 형식 체크
        if(!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)){
            const error = new Error();
            Object.assign(error, {code: 400, message: "이메일 형식을 다시 확인해주세요."})
            throw error;
        }

        // verify document find
        const verify = await Verify.findOne({data: email, code: code.VERIFYCODE});
        if(!verify){
            const error = new Error();
            Object.assign(error, {code: 400, message: "이메일 인증을 먼저 진행해주세요."});
            throw error;
        }

        // 인증 코드 비교 진행( 정상 인증 코드로 판단 시 is_verified 를 true 로 변경하여 회원가입 절차가 가능하도록 함)
        if(secret === verify.secret){
            await Verify.updateOne({data: email, code: code.VERIFYCODE},{
                is_verified: true
            });
            return {code: 200, message: "이메일 인증 코드가 정상적으로 확인되었습니다."}
        } else {
            await Verify.updateOne({data: email, code: code.VERIFYCODE},{
                is_verified: false
            });
            const error = new Error();
            Object.assign(error, {code: 400, message: "이메일 인증 코드를 다시 확인해주세요."});
            throw error;
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
                likeProd.push({nanoid: data.nanoid, title: data.title, price: data.price, category: data.category});
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
            likeProd.push({nanoid: data.nanoid, title: data.title, price: data.price, category: data.category});
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
            likeProd.push({nanoid: data.nanoid, title: data.title, price: data.price, category: data.category});
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