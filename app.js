const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const mainRouter = require('./routes');

// dotenv
const app = express();
dotenv.config();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// passport initialize
app.use(passport.initialize());

// mongoose connect
mongoose.connect(process.env.MONGO_URI,{
    dbName: "eliceShopping"
})
.then( res => console.log("mongoDB test collection connected"))
.catch( err => console.log(err));
mongoose.connection.on('err', (err) => {
    console.log("mongoDB err");
});

app.use('/', mainRouter);

app.use((err,req,res,next) => {
    console.log(err.message + " 내부 error 발생");
    res.json(err.message);
});

app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT} port connected`);
});