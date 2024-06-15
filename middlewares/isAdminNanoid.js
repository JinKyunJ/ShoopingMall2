module.exports = (req, res, next) => {
    if(req.user.nanoid !== req.params.nanoid && req.user.is_admin === false){
        throw new Error("접근할 수 없는 요청입니다.");
    }
    next();
}