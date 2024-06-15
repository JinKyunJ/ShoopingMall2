module.exports = (req, res, next) => {
    if(!req.user.is_admin){
        throw new Error("접근할 수 없는 요청입니다.");
    }
    next();
}