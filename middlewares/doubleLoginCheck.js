module.exports = (req, res, next) => {
    if(req.user){
        throw new Error("이미 로그인 되어있습니다. 로그아웃 후 시도해주세요.");
    }
    next();
}