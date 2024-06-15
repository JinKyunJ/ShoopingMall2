module.exports = (err, req, res, next) => {
        if(err){
        console.log("내부 error 발생 : " + err);
        res.status(400).json(err.message);
    }
    
};
  




