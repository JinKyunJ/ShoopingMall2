module.exports = (err, req, res, next) => {
    if(err.code === 401){
        console.log(err.code + " Unauthorized error 발생 : " + err.message);
        return res.status(401).json(err.message);
    } else if(err.code === 404){
        console.log(err.code + " Not Found error 발생 : " + err.message);
        return res.status(404).json(err.message);
    } else {
        console.log("400 Bad Request error 발생 : " + err.message);
        return res.status(400).json(err.message);
    }
};
  




