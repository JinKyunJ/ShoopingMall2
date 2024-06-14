module.exports = (req, res, next) => {
    if(!req.user){
        throw new Error("로그인하지 않은 사용자입니다.");
    }
    next();
}